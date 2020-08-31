import * as React from 'react'
import { observer } from 'mobx-react'
import { FolderOpenFilled, FolderFilled } from '@ant-design/icons'

import IconDelete from '@assets/svgs/delete.svg'
import IconLatest from '@assets/svgs/latest.svg'
import FolderTree from './FolderTree'
import { useRootStore, useOnMount } from '@utils/customHooks'
import * as styles from './index.scss'
import { Tabs as EnumTabs } from '@store/extraStore'

interface IProps {}

const Tabs: React.FC<IProps> = () => {
    const {
        extraStore: {
            currTabId,
            setCurrTabId,
            getDelFolderAndFile,
            getFolderAndFile,
            getNewestFolderAndFile,
            setMenuProps
        },
        folderStore: { setCurrSelectedFolderId, setCurrSelectedFolderName, setCurrSelectedFolderKey, setFolder },
        articleStore: { setCurrArticleId, setArticles }
    } = useRootStore()

    const tabs = [
        {
            id: EnumTabs.NewDoc,
            icon: <IconLatest width={16} height={16} />,
            title: '最新文档11'
        },
        {
            id: EnumTabs.MyFolder,
            icon:
                currTabId === EnumTabs.MyFolder ? (
                    <FolderOpenFilled width={16} height={16} />
                ) : (
                    <FolderFilled width={16} height={16} />
                ),
            title: '我的文件夹',
            children: <FolderTree />
        },
        {
            id: EnumTabs.Recycle,
            icon: <IconDelete width={16} height={16} />,
            title: '回收站'
        }
    ]

    const onHandleTabClick = (id: EnumTabs) => {
        setCurrTabId(id)
        setCurrSelectedFolderId(null)
        setFolder([])
        setArticles([])
        setCurrSelectedFolderKey(null)
        const title = id === EnumTabs.NewDoc ? '最新文档' : id === EnumTabs.MyFolder ? '我的文件夹' : '回收站'
        setCurrSelectedFolderName(title)
        switch (id) {
            case EnumTabs.NewDoc:
                getNewestFolderAndFile()
                setCurrArticleId(null)
                break
            case EnumTabs.MyFolder:
                getFolderAndFile(EnumTabs.MyFolder)
                break
            case EnumTabs.Recycle:
                getDelFolderAndFile()
                setCurrArticleId(null)
                break
        }
    }

    const onHandleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        const { pageX, pageY } = event
        setMenuProps({
            x: pageX,
            y: pageY,
            visible: true,
            folderId: EnumTabs.MyFolder,
            key: EnumTabs.MyFolder,
            isFolder: true
        })
        setCurrSelectedFolderKey(EnumTabs.MyFolder)
    }

    useOnMount(() => {
        onHandleTabClick(EnumTabs.NewDoc)
    })

    return (
        <div className={styles['tabs-container']}>
            {tabs.map(tab => {
                const active = tab.id === currTabId
                return (
                    <div className={styles.tabContainer} key={tab.id}>
                        <div
                            className={`${styles.tabParent} ${active ? styles.active : ''}`}
                            onClick={() => onHandleTabClick(tab.id)}
                            onContextMenu={tab.id === '2' ? onHandleContextMenu : null}
                        >
                            <span>{tab.icon}</span>
                            <div className={styles.tabName}>{tab.title}</div>
                        </div>
                        <div
                            style={{
                                display: active ? 'block' : 'none'
                            }}
                        >
                            {!!tab.children && tab.children}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default observer(Tabs)
