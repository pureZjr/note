import * as React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

import { useRootStore } from '@utils/customHooks'
import IconFolderClose from '@assets/svgs/folder-close.svg'
import styles from './index.scss'
import { Tabs } from '@store/extraStore'
import { setAllKeysByCurrKey } from '@utils/common'

const FolderList: React.FC = () => {
    const {
        folderStore: {
            folders,
            currSelectedFolderId,
            setCurrSelectedFolderId,
            setCurrSelectedFolderName,
            setCurrSelectedFolderKey,
            setExpandTreeKeys
        },
        fileStore: { setCurrFileId },
        extraStore: {
            currTabId,
            isSearching,
            keyword,
            fileAndFolderDisplay,
            setCurrTabId,
            getFolderAndFile,
            setMenuProps
        }
    } = useRootStore()

    // 点击文件夹，更新阅读时间
    const onHandleClickItem = ({ id, title, key }: IFolderStore.ITreeData) => {
        setCurrSelectedFolderName(title)
        if (Tabs.Recycle === currTabId) {
            return
        }
        if (Tabs.NewDoc === currTabId) {
            setCurrTabId(Tabs.MyFolder)
        }
        setCurrFileId(null)
        setCurrSelectedFolderId(id)
        setCurrSelectedFolderKey(key)
        getFolderAndFile(key)
        if (isSearching) {
            setAllKeysByCurrKey(key)
        } else {
            setExpandTreeKeys(key)
        }
    }

    const onHandleContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        { id, key, title }: IFolderStore.ITreeData
    ) => {
        event.preventDefault()
        const { pageX, pageY } = event
        setMenuProps({
            x: pageX,
            y: pageY,
            visible: true,
            folderId: id,
            key,
            isFolder: true,
            title
        })
        setCurrSelectedFolderKey(key)
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

    const itemStyle: React.CSSProperties =
        fileAndFolderDisplay === 'abstract'
            ? {
                  height: 72,
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start'
              }
            : { height: 46, flexDirection: 'row', justifyContent: 'space-between' }

    return (
        <div className={styles.container}>
            {folders.map(folder => {
                return (
                    <div
                        className={`${styles.wrapper} ${folder.id === currSelectedFolderId ? styles.active : ''}`}
                        style={itemStyle}
                        key={folder.id}
                        onClick={() => onHandleClickItem(folder)}
                        onContextMenu={e => onHandleContextMenu(e, folder)}
                    >
                        <div className={styles.titleContainer}>
                            <IconFolderClose width={20} height={20} className="no-fill" />
                            <div className={styles.title}>{renderTitle(folder.title)}</div>
                        </div>
                        <div className={styles.updateTime}>{moment(folder.updateTime).format('YYYY-MM-DD')}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default observer(FolderList)
