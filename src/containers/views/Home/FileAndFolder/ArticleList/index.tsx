import * as React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

import { useRootStore } from '@utils/customHooks'
import IconMarkdown from '@assets/svgs/markdown.svg'
import IconDocument from '@assets/svgs/document.svg'
import { getArticleContent } from '@services/api/article'
import { byteConvert } from '@utils/common'
import * as styles from './index.scss'
import { Tabs } from '@store/extraStore'
import { setAllKeysByCurrKey } from '@utils/common'
import CreateType from '@store/extraStore/CreateType'
import IconFolderClose from '@assets/svgs/folder-close.svg'

const ArticleList: React.FC = () => {
    const {
        articleStore: { articles, currArticleId, setCurrArticleId, setArticleContent, setContentLoading },
        folderStore: {
            setCurrSelectedFolderId,
            setCurrSelectedFolderKey,
            setExpandTreeKeys,
            setCurrSelectedFolderName
        },
        extraStore: { currTabId, isSearching, keyword, setCurrTabId, setMenuProps }
    } = useRootStore()

    const renderSvg = (type: string) => {
        const svgProps = {
            className: 'no-fill',
            width: 20,
            height: 20
        }
        switch (type) {
            case CreateType.MarkDown:
                return <IconMarkdown {...svgProps} />
            case CreateType.Article:
                return <IconDocument {...svgProps} />
        }
    }

    // 点击文章，更新阅读时间
    const onHandleClickItem = async ({ id, parentId, parentKey, type, parentFolderTitle }: IArticleStore.IArticle) => {
        if ([Tabs.MyFolder, Tabs.NewDoc].includes(currTabId)) {
            setCurrArticleId(id)
        }
        if (Tabs.MyFolder === currTabId) {
            setCurrSelectedFolderName(parentFolderTitle)
            setCurrSelectedFolderId(parentId)
            setCurrSelectedFolderKey(parentKey)
        }
        try {
            setContentLoading(true)
            const res = await getArticleContent({ id, type })
            setArticleContent(res)
            setContentLoading(false)
        } catch {}
    }

    // 跳转我的文件
    const gotoMyFolder = (key: string, id: string) => {
        setExpandTreeKeys()
        setCurrTabId(Tabs.MyFolder)
        setAllKeysByCurrKey(key)
        setCurrSelectedFolderId(id)
        setCurrSelectedFolderKey(key)
    }

    // 鼠标右键
    const onHandleContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        { parentId, parentKey, id, type, title, isTop }: IArticleStore.IArticle
    ) => {
        event.preventDefault()
        const { pageX, pageY } = event
        setMenuProps({
            x: pageX,
            y: pageY,
            visible: true,
            folderId: parentId,
            articleId: id,
            key: parentKey,
            type,
            title,
            isTop
        })
        setCurrSelectedFolderKey(parentKey)
    }

    const svgProps = {
        className: 'no-fill',
        width: 12,
        height: 12,
        style: {
            marginRight: 14,
            marginLeft: 4
        }
    }
    console.log(keyword, isSearching)
    return (
        <div className={styles.container}>
            {articles.map(article => {
                const active = article.id === currArticleId
                return (
                    <div
                        className={`${styles.item} ${active ? styles.active : ''}`}
                        key={article.id}
                        onClick={() => onHandleClickItem(article)}
                        onContextMenu={e => onHandleContextMenu(e, article)}
                    >
                        <div className={styles.top}>
                            {renderSvg(article.type)}
                            <div className={styles.title}>
                                {article.title}
                                {Boolean(article.isTop) && <div className={styles['is-top']} />}
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            {Tabs.MyFolder !== currTabId && active ? (
                                <div
                                    className={styles.parentFolderTitle}
                                    onClick={() => gotoMyFolder(article.parentKey, article.id)}
                                >
                                    <IconFolderClose {...svgProps} />
                                    {article.parentFolderTitle}
                                </div>
                            ) : (
                                <>
                                    <div className={styles.updateTime}>
                                        {moment(article.updateTime).format('YYYY-MM-DD')}
                                    </div>
                                    <div className={styles.size}>{byteConvert(article.size)}</div>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default observer(ArticleList)
