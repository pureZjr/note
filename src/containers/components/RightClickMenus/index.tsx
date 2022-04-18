import * as React from 'react'
import { Menu, Modal, Input, Button } from 'antd'
import { observer } from 'mobx-react'

import { useOnMount, useOnUnMount, useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import { delFolder, delFolderComplete, recoverFolder, renameFolder } from '@services/api/folder'
import { delFile, delFileComplete, recoverFile, renameFile, setTopFile, cancelShareFile } from '@services/api/file'
import styles from './index.module.scss'
import extraStore, { Tabs } from '@store/extraStore'
import message from '@components/AntdMessageExt'

const menuHeight = 40

const { SubMenu } = Menu

const RightClickMenus: React.FC = () => {
    const containerRef = React.useRef(null)

    const menuRef = React.useRef<Menu>(null)

    const {
        extraStore: {
            currTabId,
            menuProps: { x, y, visible, folderId, articleId, isFolder, isTree, key: folderKey, type, title, isTop },
            setCreateFileFolderType,
            setCreateFileFolderDialogvisible,
            setMenuProps,
            getFolderAndFile,
            getNewestFolderAndFile,
        },
        folderStore,
        fileStore,
    } = useRootStore()

    const [_y, _setY] = React.useState(null)

    let currTitle = title

    const closeMenu = () => {
        setMenuProps({ visible: false })
    }

    const clearFolderAndArticleList = () => {
        folderStore.setFolder([])
        fileStore.setFiles([])
    }

    const handleClick = async ({ key }) => {
        const { setCurrFolderInfo, getTreeData } = folderStore
        setCurrFolderInfo({ id: folderId })

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
                ;(isFolder ? delFolder : delFile)({ id: isFolder ? folderId : articleId, type }).then(() => {
                    if (isFolder) {
                        const { delFolder, setExpandTreeKeys, setCurrFolderInfo, setNameByParentKey } = folderStore
                        getTreeData()
                        delFolder(folderId)
                        setExpandTreeKeys(folderKey)
                        const parentKey = folderKey.replace(`-${folderId}`, '')
                        setCurrFolderInfo({ key: parentKey })
                        getFolderAndFile(parentKey)
                        setNameByParentKey(parentKey)
                        if (isTree) {
                            clearFolderAndArticleList()
                        }
                    } else {
                        fileStore.delFile(articleId)
                        if (fileStore.currFileInfo && articleId === fileStore.currFileInfo.id) {
                            fileStore.setCurrFileInfo(null)
                        }
                    }
                })
                break
            case '4':
                Modal.confirm({
                    title: '彻底删除',
                    content: '确认彻底删除',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        ;(isFolder ? delFolderComplete : delFileComplete)({
                            id: isFolder ? folderId : articleId,
                            type,
                        }).then(() => {
                            if (isFolder) {
                                getTreeData()
                                folderStore.delFolder(folderId)
                                if (isTree) {
                                    clearFolderAndArticleList()
                                }
                            } else {
                                fileStore.delFile(articleId)
                            }
                        })
                    },
                })
                break
            case '5':
                Modal.confirm({
                    title: '恢复',
                    content: '确认恢复',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        ;(isFolder ? recoverFolder : recoverFile)({
                            id: isFolder ? folderId : articleId,
                        }).then(() => {
                            if (isFolder) {
                                getTreeData()
                                folderStore.delFolder(folderId)
                            } else {
                                fileStore.delFile(articleId)
                            }
                        })
                    },
                })
                break
            case '7':
                const onOk = async () => {
                    const data = {
                        title: currTitle,
                    }
                    if (!currTitle) {
                        return message.error('标题不能为空')
                    }
                    if (currTitle === title) {
                        return modal.destroy()
                    }
                    let api
                    if (isFolder) {
                        Object.assign(data, {
                            id: folderId,
                        })
                        api = renameFolder
                    } else {
                        Object.assign(data, {
                            id: articleId,
                            type,
                        })
                        api = renameFile
                    }
                    try {
                        modal.update({
                            okButtonProps: {
                                loading: true,
                            },
                        })
                        await api(data)
                        if (isFolder) {
                            folderStore.getTreeData()
                            folderStore.setFolderName(folderId, currTitle)
                            if (folderStore.currFolderInfo.id === folderId) {
                                folderStore.setCurrFolderInfo({
                                    title: currTitle,
                                })
                            }
                        } else {
                            fileStore.setFileName(articleId, currTitle)
                        }
                        message.success('操作成功')
                        modal.destroy()
                    } catch (err) {
                        console.log(err)
                    }
                }
                const modal = Modal.confirm({
                    title: '重命名',
                    onOk: onOk,
                    okText: '确认',
                    cancelButtonProps: {
                        style: { display: 'none' },
                    },
                    content: (
                        <div
                            style={{
                                height: 50,
                            }}
                        >
                            <Input
                                ref={(ref) => {
                                    if (!!ref) {
                                        setTimeout(() => {
                                            ref.focus()
                                        }, 100)
                                    }
                                }}
                                autoFocus
                                maxLength={20}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        onOk()
                                    }
                                }}
                                onChange={(v) => (currTitle = v.target.value)}
                                defaultValue={title}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 96,
                                    marginTop: 42,
                                }}
                            >
                                <Button
                                    style={{ marginRight: 12 }}
                                    ghost
                                    type="primary"
                                    onClick={() => modal.destroy()}
                                >
                                    取消
                                </Button>
                            </div>
                        </div>
                    ),
                })
                break
            case '8':
                const data = { id: articleId, is_top: Boolean(isTop) ? 0 : 1 }
                try {
                    await setTopFile(data)
                    if (Tabs.NewDoc === currTabId) {
                        await getNewestFolderAndFile()
                    } else {
                        await fileStore.getFiles(folderKey)
                    }
                    message.success('操作成功')
                } catch {}
                break
            case '9':
                try {
                    await cancelShareFile({
                        id: articleId,
                        isCancel: true,
                    })
                    if (currTabId == Tabs.MyShare) {
                        fileStore.setCurrFileInfo(null)
                        extraStore.getMyShareFile()
                    }
                    message.success('操作成功')
                } catch (err) {
                    message.success('操作失败')
                    console.error(err)
                }
                break
        }
        closeMenu()
    }

    const close = (e) => {
        if (!containerRef.current.contains(e.target)) {
            closeMenu()
        }
    }

    React.useEffect(() => {
        try {
            const menuTotalHeight = (menuRef.current.props.children as any[]).filter((v) => !!v).length * menuHeight
            if (menuTotalHeight + y > document.body.clientHeight) {
                _setY(y - menuTotalHeight)
            } else {
                _setY(y)
            }
        } catch {}
    }, [y])

    useOnMount(() => {
        window.addEventListener('click', close)
    })

    useOnUnMount(() => {
        window.removeEventListener('click', close)
        setMenuProps(null)
    })
    const isRecycle = currTabId === Tabs.Recycle
    const isMyShare = currTabId === Tabs.MyShare
    const isRootFolder = currTabId === Tabs.MyFolder || folderId === Tabs.MyFolder
    const isArticle = !!articleId

    return (
        <div
            className={styles.container}
            style={{
                left: x,
                top: _y,
            }}
            ref={containerRef}
        >
            {visible && (
                <Menu onClick={handleClick} style={{ width: 200 }} mode="vertical" ref={menuRef}>
                    {isFolder && isRootFolder && (
                        <SubMenu key="sub1" title="新建">
                            <Menu.Item key="1">文件夹</Menu.Item>
                            <Menu.Item key="2">Markdown</Menu.Item>
                            <Menu.Item key="6">文章</Menu.Item>
                        </SubMenu>
                    )}
                    {isRecycle && <Menu.Item key="5">恢复</Menu.Item>}
                    {isRecycle && <Menu.Item key="4">彻底删除</Menu.Item>}
                    {isArticle && !isRecycle && !isMyShare && (
                        <Menu.Item key="8">{isTop ? '取消置顶' : '置顶'}</Menu.Item>
                    )}
                    {(folderId !== Tabs.MyFolder || isArticle) && !isRecycle && <Menu.Item key="7">重命名</Menu.Item>}
                    {(folderId !== Tabs.MyFolder || isArticle) && !isRecycle && !isMyShare && (
                        <Menu.Item key="3">删除</Menu.Item>
                    )}
                    {isMyShare && <Menu.Item key="9">取消分享</Menu.Item>}
                </Menu>
            )}
        </div>
    )
}

export default observer(RightClickMenus)
