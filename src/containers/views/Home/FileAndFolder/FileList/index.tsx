import * as React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { get } from 'lodash'

import { useRootStore } from '@utils/customHooks'
import IconMarkdown from '@assets/svgs/markdown.svg'
import IconDocument from '@assets/svgs/document.svg'
import IconImage from '@assets/svgs/image.svg'
import IconVideo from '@assets/svgs/video.svg'
import { getFileContent } from '@services/api/file'
import { byteConvert, setAllKeysByCurrKey } from '@utils/common'
import styles from './index.scss'
import { Tabs } from '@store/extraStore'
import CreateType from '@store/extraStore/CreateType'
import IconFolderClose from '@assets/svgs/folder-close.svg'

const FileList: React.FC = () => {
    const {
        fileStore: { files, currFileInfo, setCurrFileInfo, setContentLoading },
        folderStore: { setCurrFolderInfo, setExpandTreeKeys },
        extraStore: { currTabId, isSearching, keyword, fileAndFolderDisplay, setCurrTabId, setMenuProps }
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
            case CreateType.Img:
                return <IconImage {...svgProps} />
            case CreateType.Video:
                return <IconVideo {...svgProps} />
        }
    }

    // 点击文章，更新阅读时间
    const onHandleClickItem = async ({
        id,
        parentId,
        parentKey,
        type,
        parentFolderTitle,
        title,
        isTop
    }: IFileStore.File) => {
        setCurrFileInfo(null)
        if (Tabs.MyFolder === currTabId) {
            setCurrFolderInfo({
                title: parentFolderTitle,
                id: parentId,
                key: parentKey
            })
        }
        try {
            setContentLoading(true)
            const res = await getFileContent({ id, type })
            setCurrFileInfo({ content: res, id, title, type, isTop, parentKey, parentFolderTitle })
        } catch {}
        setContentLoading(false)
    }
    // 跳转我的文件夹
    const gotoMyFolder = (key: string, id: string) => {
        setExpandTreeKeys()
        setCurrTabId(Tabs.MyFolder)
        setAllKeysByCurrKey(key)
        setCurrFolderInfo({
            id,
            key
        })
    }
    // 鼠标右键
    const onHandleContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        { parentId, parentKey, id, type, title, isTop }: IFileStore.File
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
        setCurrFolderInfo({ key: parentKey })
    }

    const renderTitle = (title: string) => {
        if (title.indexOf(keyword) > -1 && isSearching) {
            return (
                <span
                    dangerouslySetInnerHTML={{
                        __html: title.replace(
                            new RegExp(`${keyword}`),
                            `<span style="background:yellow;">${keyword}</span>`
                        )
                    }}
                />
            )
        } else {
            return title
        }
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

    return (
        <div className={styles.container}>
            {files.map(article => {
                const active = article.id === get(currFileInfo, 'id', '')
                return (
                    <div
                        className={`${styles.item} ${active ? styles.active : ''}`}
                        style={{
                            height: fileAndFolderDisplay === 'abstract' ? 72 : 46
                        }}
                        key={article.id}
                        onClick={() => onHandleClickItem(article)}
                        onContextMenu={e => onHandleContextMenu(e, article)}
                    >
                        <div className={styles.top}>
                            {renderSvg(article.type)}
                            <div className={styles.title}>
                                {renderTitle(article.title || '')}
                                {Boolean(article.isTop) && <div className={styles.isTop} />}
                            </div>
                            {fileAndFolderDisplay === 'list' && (
                                <div className={styles.updateTime}>
                                    {moment(article.updateTime).format('YYYY-MM-DD')}
                                </div>
                            )}
                        </div>
                        {fileAndFolderDisplay === 'abstract' && (
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
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default observer(FileList)
