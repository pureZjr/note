import * as React from 'react'
import { observer } from 'mobx-react'
import dayjs from 'dayjs'
import { get } from 'lodash'

import { useRootStore } from '@utils/customHooks'
import { getFileContent } from '@services/api/file'
import { byteConvert, setAllKeysByCurrKey } from '@utils/common'
import styles from './index.module.scss'
import { Tabs } from '@store/extraStore'
import RenderFileIcon from '@shared/RenderFileIcon'
import Icon from '@components/Icon'

const FileList: React.FC = () => {
    const {
        fileStore: { files, currFileInfo, setCurrFileInfo, setContentLoading },
        folderStore: { setCurrFolderInfo, setExpandTreeKeys },
        extraStore: { currTabId, isSearching, keyword, fileAndFolderDisplay, setCurrTabId, setMenuProps },
    } = useRootStore()

    // 点击文章，更新阅读时间
    const onHandleClickItem = async ({
        id,
        parentId,
        parentKey,
        type,
        parentFolderTitle,
        title,
        isTop,
        key,
        createTime,
        updateTime,
    }: IFileStore.File) => {
        setCurrFileInfo(null)
        if (Tabs.MyFolder === currTabId) {
            setCurrFolderInfo({
                title: parentFolderTitle,
                id: parentId,
                key: parentKey,
            })
        }
        try {
            setContentLoading(true)
            const res = await getFileContent({ id, type })
            setCurrFileInfo({
                content: res,
                id,
                title,
                type,
                isTop,
                parentKey,
                parentFolderTitle,
                key,
                createTime,
                updateTime,
            })
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
            key,
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
            isTop,
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
                        ),
                    }}
                />
            )
        } else {
            return title
        }
    }

    const svgProps = {
        width: 12,
        height: 12,
        style: {
            marginRight: 14,
            marginLeft: 4,
        },
    }

    return (
        <div className={styles.container}>
            {files.map((article) => {
                const active = article.id === get(currFileInfo, 'id', '')
                return (
                    <div
                        className={`${styles.item} ${active ? styles.active : ''}`}
                        style={{
                            height: fileAndFolderDisplay === 'abstract' ? 72 : 46,
                        }}
                        key={article.id}
                        onClick={() => onHandleClickItem(article)}
                        onContextMenu={Tabs.ShareToMe !== currTabId ? (e) => onHandleContextMenu(e, article) : null}
                    >
                        <div className={styles.top}>
                            <RenderFileIcon type={article.type} />
                            <div className={styles.title}>
                                {renderTitle(article.title || '')}
                                {Boolean(article.isTop) && <div className={styles.isTop} />}
                            </div>
                            {fileAndFolderDisplay === 'list' && (
                                <div className={styles.updateTime}>
                                    {dayjs(article.updateTime).format('YYYY-MM-DD')}
                                </div>
                            )}
                        </div>
                        {fileAndFolderDisplay === 'abstract' && (
                            <div className={styles.bottom}>
                                {![Tabs.MyFolder, Tabs.Recycle, Tabs.ShareToMe].includes(currTabId) && active ? (
                                    <div
                                        className={styles.parentFolderTitle}
                                        onClick={() => gotoMyFolder(article.parentKey, article.id)}
                                    >
                                        <Icon type="iconfolder-close" {...svgProps} />
                                        {article.parentFolderTitle}
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.updateTime}>
                                            {dayjs(article.updateTime).format('YYYY-MM-DD')}
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
