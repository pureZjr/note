import * as React from 'react'
import { Menu, Modal } from 'antd'
import { observer } from 'mobx-react'

import { useOnMount, useOnUnMount, useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import { delFolder, delFolderComplete, recoverFolder } from '@services/api/folder'
import { delFile, delArticleComplete, recoverArticle } from '@services/api/article'
import * as styles from './index.scss'
import { Tabs } from '@store/extraStore'

const { SubMenu } = Menu

const RightClickMenus: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    const {
        extraStore: {
            currTabId,
            menuProps: { x, y, visible, folderId, articleId, isFolder, isTree, key: folderKey, type },
            setCreateFileFolderType,
            setCreateFileFolderDialogvisible,
            setMenuProps,
            getFolderAndFile
        },
        folderStore,
        articleStore
    } = useRootStore()

    const closeMenu = () => {
        setMenuProps({ visible: false })
    }

    const clearFolderAndArticleList = () => {
        folderStore.setFolder([])
        articleStore.setArticles([])
    }

    const handleClick = ({ key }) => {
        const { setCurrSelectedFolderId, getTreeData } = folderStore
        setCurrSelectedFolderId(folderId)

        switch (key) {
            case '1':
            case '2':
            case '6':
                const createType =
                    key === '1' ? CreateType.Folder : key === '2' ? CreateType.MarkDown : CreateType.Article
                setCreateFileFolderType(createType)
                setCreateFileFolderDialogvisible(true)
                break
            case '3':
                ;(isFolder ? delFolder : delFile)({ id: isFolder ? folderId : articleId, type })
                    .then(() => {
                        if (isFolder) {
                            const {
                                delFolder,
                                setExpandTreeKeys,
                                setCurrSelectedFolderKey,
                                setNameByParentKey
                            } = folderStore
                            getTreeData()
                            delFolder(folderId)
                            setExpandTreeKeys(folderKey)
                            const parentKey = folderKey.replace(`-${folderId}`, '')
                            setCurrSelectedFolderKey(parentKey)
                            getFolderAndFile(parentKey)
                            setNameByParentKey(parentKey)
                            if (isTree) {
                                clearFolderAndArticleList()
                            }
                        } else {
                            articleStore.delArticle(articleId)
                        }
                    })
                    .finally(() => {})
                break
            case '4':
                Modal.confirm({
                    title: '彻底删除',
                    content: '确认彻底删除',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        ;(isFolder ? delFolderComplete : delArticleComplete)({
                            id: isFolder ? folderId : articleId,
                            type
                        })
                            .then(() => {
                                if (isFolder) {
                                    getTreeData()
                                    folderStore.delFolder(folderId)
                                    if (isTree) {
                                        clearFolderAndArticleList()
                                    }
                                } else {
                                    articleStore.delArticle(articleId)
                                }
                            })
                            .finally(() => {})
                    }
                })
                break
            case '5':
                Modal.confirm({
                    title: '恢复',
                    content: '确认恢复',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        ;(isFolder ? recoverFolder : recoverArticle)({
                            id: isFolder ? folderId : articleId
                        })
                            .then(() => {
                                if (isFolder) {
                                    getTreeData()
                                    folderStore.delFolder(folderId)
                                } else {
                                    articleStore.delArticle(articleId)
                                }
                            })
                            .finally(() => {})
                    }
                })
                break
        }
        closeMenu()
    }

    const close = e => {
        if (!containerRef.current.contains(e.target)) {
            closeMenu()
        }
    }

    useOnMount(() => {
        window.addEventListener('click', close)
    })

    useOnUnMount(() => {
        window.removeEventListener('click', close)
        setMenuProps(null)
    })
    return (
        <div
            className={styles.container}
            style={{
                left: x,
                top: y
            }}
            ref={containerRef}
        >
            {visible && (
                <Menu onClick={handleClick} style={{ width: 200 }} mode="vertical">
                    {isFolder && (currTabId === Tabs.MyFolder || folderId === Tabs.MyFolder) && (
                        <SubMenu key="sub1" title="新建">
                            <Menu.Item key="1">文件夹</Menu.Item>
                            <Menu.Item key="2">Markdown</Menu.Item>
                            <Menu.Item key="6">文章</Menu.Item>
                        </SubMenu>
                    )}
                    {currTabId === Tabs.Recycle && <Menu.Item key="5">恢复</Menu.Item>}
                    {currTabId === Tabs.Recycle && <Menu.Item key="4">彻底删除</Menu.Item>}
                    {(folderId !== Tabs.MyFolder || !!articleId) && currTabId !== Tabs.Recycle && (
                        <Menu.Item key="3">删除</Menu.Item>
                    )}
                </Menu>
            )}
        </div>
    )
}

export default observer(RightClickMenus)
