import * as React from 'react'
import { observer } from 'mobx-react'

import FolderTree from './FolderTree'
import { useRootStore, useOnMount } from '@utils/customHooks'
import styles from './index.module.scss'
import { Tabs as EnumTabs } from '@store/extraStore'
import Icon from '@components/Icon'

interface Props {
    setScrollToTop: (boo: boolean) => void
}

const Tabs: React.FC<Props> = ({ setScrollToTop }: Props) => {
    const {
        extraStore: {
            currTabId,
            setCurrTabId,
            getDelFolderAndFile,
            getFolderAndFile,
            getNewestFolderAndFile,
            setMenuProps,
        },
        folderStore: { setCurrFolderInfo, setFolder },
        fileStore: { setCurrFileInfo, setFiles },
    } = useRootStore()

    const svgProps = {
        width: 16,
        height: 16,
    }

    const tabs = [
        {
            id: EnumTabs.NewDoc,
            icon: <Icon type="iconnewest-article" {...svgProps} />,
            title: '最新文档',
        },
        {
            id: EnumTabs.MyFolder,
            icon:
                currTabId === EnumTabs.MyFolder ? (
                    <Icon type="iconfolder-open" {...svgProps} />
                ) : (
                    <Icon type="iconfolder-close" {...svgProps} />
                ),
            title: '我的文件夹',
            children: <FolderTree />,
        },
        {
            id: EnumTabs.Recycle,
            icon: <Icon type="icondustbin" {...svgProps} />,
            title: '回收站',
        },
    ]
    // 重置数据
    const resetData = () => {
        setFolder([])
        setFiles([])
        setCurrFolderInfo(null)
        setCurrFileInfo(null)
    }
    // 点击最新文档、我的文件夹、回收站
    const onHandleTabClick = async (id: EnumTabs) => {
        resetData()
        setCurrTabId(id)
        const title = id === EnumTabs.NewDoc ? '最新文档' : id === EnumTabs.MyFolder ? '我的文件夹' : '回收站'
        setCurrFolderInfo({ title })
        switch (id) {
            case EnumTabs.NewDoc:
                getNewestFolderAndFile()
                break
            case EnumTabs.MyFolder:
                await getFolderAndFile(EnumTabs.MyFolder)
                break
            case EnumTabs.Recycle:
                getDelFolderAndFile()
                setScrollToTop(true)
                setTimeout(() => {
                    setScrollToTop(null)
                }, 100)
                break
        }
    }
    // 右键
    const onHandleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        const { pageX, pageY } = event
        setMenuProps({
            x: pageX,
            y: pageY,
            visible: true,
            folderId: EnumTabs.MyFolder,
            key: EnumTabs.MyFolder,
            isFolder: true,
        })
        setCurrFolderInfo({ key: EnumTabs.MyFolder })
    }

    useOnMount(() => {
        onHandleTabClick(EnumTabs.NewDoc)
    })

    return (
        <div className={styles.container}>
            {tabs.map((tab) => {
                const active = tab.id === currTabId
                return (
                    <div className={styles.tabContainer} key={tab.id}>
                        <div
                            className={`${styles.tabParent} ${active ? styles.active : ''}`}
                            onClick={() => onHandleTabClick(tab.id)}
                            onContextMenu={tab.id === '2' ? onHandleContextMenu : null}
                        >
                            {tab.icon}
                            <div className={styles.tabName}>{tab.title}</div>
                        </div>
                        <div
                            style={{
                                display: active ? 'block' : 'none',
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
