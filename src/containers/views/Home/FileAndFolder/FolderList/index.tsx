import * as React from 'react'
import { observer } from 'mobx-react'
import dayjs from 'dayjs'

import { useRootStore } from '@utils/customHooks'
import styles from './index.module.scss'
import { Tabs } from '@store/extraStore'
import { setAllKeysByCurrKey } from '@utils/common'
import Icon from '@components/Icon'

const FolderList: React.FC = () => {
    const {
        folderStore: { folders, currFolderInfo, setCurrFolderInfo, setExpandTreeKeys },
        fileStore: { setCurrFileInfo },
        extraStore: {
            currTabId,
            isSearching,
            keyword,
            fileAndFolderDisplay,
            setCurrTabId,
            getFolderAndFile,
            setMenuProps,
        },
    } = useRootStore()

    // 点击文件夹，更新阅读时间
    const onHandleClickItem = ({ id, title, key }: IFolderStore.TreeData) => {
        if (Tabs.Recycle === currTabId) {
            return
        }
        if (Tabs.NewDoc === currTabId) {
            setCurrTabId(Tabs.MyFolder)
        }
        setCurrFileInfo(null)
        setCurrFolderInfo({ title, id, key })
        getFolderAndFile(key)
        if (isSearching) {
            setAllKeysByCurrKey(key)
        } else {
            setExpandTreeKeys(key)
        }
    }

    const onHandleContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        { id, key, title }: IFolderStore.TreeData
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
            title,
        })
        setCurrFolderInfo({ key })
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

    const itemStyle: React.CSSProperties =
        fileAndFolderDisplay === 'abstract'
            ? {
                  height: 72,
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
              }
            : { height: 46, flexDirection: 'row', justifyContent: 'space-between' }

    return (
        <div className={styles.container}>
            {folders.map((folder) => {
                return (
                    <div
                        className={`${styles.wrapper} ${folder.id === currFolderInfo.id ? styles.active : ''}`}
                        style={itemStyle}
                        key={folder.id}
                        onClick={() => onHandleClickItem(folder)}
                        onContextMenu={(e) => onHandleContextMenu(e, folder)}
                    >
                        <div className={styles.titleContainer}>
                            <Icon type="iconfolder-close" width={20} height={20} />
                            <div className={styles.title}>{renderTitle(folder.title)}</div>
                        </div>
                        <div className={styles.updateTime}>{dayjs(folder.updateTime).format('YYYY-MM-DD')}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default observer(FolderList)
