import * as React from 'react'
import { observer } from 'mobx-react'

import { useRootStore } from '@utils/customHooks'
import IconFolderClose from '@assets/svgs/folder-close.svg'
import * as styles from './index.scss'
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
        extraStore: { currTabId, isSearching, setCurrTabId, getFolderAndFile, setMenuProps }
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

    return (
        <div className={styles.container}>
            {folders.map(folder => {
                return (
                    <div
                        className={`${styles.wrapper} ${folder.id === currSelectedFolderId ? styles.active : ''}`}
                        key={folder.id}
                        onClick={() => onHandleClickItem(folder)}
                        onContextMenu={e => onHandleContextMenu(e, folder)}
                    >
                        <IconFolderClose width={20} height={20} className="no-fill" />
                        <div className={styles.title}>{folder.title}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default observer(FolderList)
