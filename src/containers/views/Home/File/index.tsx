import * as React from 'react'
import { observer } from 'mobx-react'
import {
    EditOutlined,
    SaveOutlined,
    ExclamationCircleOutlined,
    ShareAltOutlined,
    EllipsisOutlined,
    LinkOutlined,
} from '@ant-design/icons'
import ReactMarkdown from '@components/ReactMarkdown'
import { Input, Spin, Tooltip, Dropdown, Menu, Modal, Button } from 'antd'
import dayjs from 'dayjs'

import message from '@components/AntdMessageExt'
import { useRootStore } from '@utils/customHooks'
import { sizeof, copyToClipboard } from '@utils/common'
import styles from './index.module.scss'
import Editor from './Editor'
import { setTopFile, createShareFileLink, editFile, cancelShareFile } from '@services/api/file'
import { Tabs } from '@store/extraStore'
import { SHARE_BASE_URL } from '@constant/index'
import CreateType from '@store/extraStore/CreateType'
import RenderContent from '@shared/RenderContent'
import MarkDownEditor from './MarkDownEditor'
import PageLoading from '@components/PageLoading'

const File: React.FC = () => {
    const {
        userInfoStore: { userInfo },
        fileStore: { currFileInfo, contentLoading, setCurrFileInfo, updateFile, getFiles },
        extraStore: { currTabId, getNewestFolderAndFile, getMyShareFile },
    } = useRootStore()

    const { id, type, key, parentFolderTitle, parentId, parentKey, createTime, updateTime } = currFileInfo
    const [isTop, setIsTop] = React.useState(currFileInfo.isTop)
    const [editing, setEditing] = React.useState(false)
    const [content, setContent] = React.useState('')
    const [mdEditAndRead, setMdEditAndRead] = React.useState(true)
    const [loading, setLoading] = React.useState(false)

    const title = React.useRef('')

    // 编辑
    const editTigger = () => {
        setEditing(!editing)
        setMdEditAndRead(true)
        setCurrFileInfo({
            title: title.current,
            content,
        })
    }
    // 保存
    const save = (content: string) => {
        editFile({ content, id, title: title.current, type })
        const size = sizeof(content, 'utf-8')
        updateFile({
            content,
            size,
            id,
            title: title.current,
        })
        message.success('保存成功')
    }
    // 加载操作项
    const renderBtns = () => {
        const setTop = async () => {
            try {
                const { id, parentKey } = currFileInfo
                const data = { id, is_top: Boolean(isTop) ? 0 : 1 }
                await setTopFile(data)
                if (Tabs.NewDoc === currTabId) {
                    getNewestFolderAndFile()
                } else {
                    await getFiles(parentKey)
                }
                message.success('操作成功')
                setTimeout(() => {
                    setIsTop(Number(!isTop) as 0 | 1)
                }, 300)
            } catch {}
        }
        const copy = async (link: string) => {
            copyToClipboard(link)
            message.success('复制成功')
        }
        // 获取分享链接
        const getShareLink = async () => {
            try {
                setLoading(true)
                const { username, email, avatar } = userInfo
                const size = sizeof(content, 'utf-8')
                await createShareFileLink({
                    id,
                    key,
                    parentFolderTitle,
                    parentId,
                    parentKey,
                    type,
                    updateTime,
                    size,
                    title: title.current,
                    ts: dayjs().valueOf(),
                    creator: { username, email, avatar },
                })
                const link = `${SHARE_BASE_URL}${id}`
                const dialog = Modal.info({
                    maskClosable: true,
                    className: styles.modalWrap,
                    width: 350,
                    title: '分享链接',
                    mask: false,
                    okButtonProps: { style: { display: 'none' } },
                    content: (
                        <div>
                            <span className={styles.tips}>链接生成成功, 复制链接分享给好友吧</span>
                            <Button
                                type="primary"
                                size="small"
                                className={styles.copyLinkBtn}
                                onClick={() => {
                                    copy(link)
                                    dialog.destroy()
                                }}
                            >
                                复制链接
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => {
                                    cancelShare()
                                    dialog.destroy()
                                }}
                            >
                                取消分享
                            </Button>
                        </div>
                    ),
                })
            } catch {}
            setLoading(false)
        }

        const menu = () => (
            <Menu>
                <Menu.Item onClick={setTop}>{Boolean(isTop) ? '取消置顶' : '置顶'}</Menu.Item>
            </Menu>
        )

        const info = () => {
            return (
                <div className={styles.info}>
                    <div>
                        <label>创建时间：</label>
                        <span>{dayjs(createTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>修改时间：</label>
                        <span>{dayjs(updateTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>文件夹：</label>
                        <span>{parentFolderTitle}</span>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.btns}>
                {[CreateType.Article, CreateType.MarkDown].includes(type) && (
                    <span onClick={editTigger}>
                        {editing ? (
                            <Tooltip title="保存">
                                <SaveOutlined className={styles.icon} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="编辑">
                                <EditOutlined className={styles.icon} />
                            </Tooltip>
                        )}
                    </span>
                )}
                {Tabs.MyShare === currTabId ? (
                    <React.Fragment>
                        <Tooltip title="复制分享链接">
                            <LinkOutlined onClick={() => copy(`${SHARE_BASE_URL}${id}`)} className={styles.icon} />
                        </Tooltip>
                        <Button type="danger" size="small" onClick={cancelShare} style={{ marginLeft: 12 }}>
                            取消分享
                        </Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Tooltip title="分享">
                            <ShareAltOutlined onClick={getShareLink} className={styles.icon} />
                        </Tooltip>
                        <Dropdown overlayClassName={styles.dropdownWrap} overlay={menu()}>
                            <EllipsisOutlined className={styles.icon} />
                        </Dropdown>
                        <Tooltip title={info()} placement="bottomRight" trigger="click">
                            <ExclamationCircleOutlined className={styles.icon} />
                        </Tooltip>
                    </React.Fragment>
                )}
            </div>
        )
    }

    // 渲染编辑内容
    const renderEditingContent = () => {
        switch (type) {
            case CreateType.Article:
                return <Editor defaultValue={content} onChange={setContent} onSave={save} />
            case CreateType.MarkDown:
                return (
                    <div className={styles.mdEditAndRead}>
                        <div className={styles.editMdContainer}>
                            <MarkDownEditor defaultValue={content} onChange={setContent} onSave={save} />
                        </div>
                        <div className={styles.divider} onClick={() => setMdEditAndRead(!mdEditAndRead)} />
                        <ReactMarkdown
                            className={mdEditAndRead ? null : styles.hideMarkdown}
                            content={content ?? ''}
                        ></ReactMarkdown>
                    </div>
                )
        }
    }
    // 编辑标题
    const editTitle = (val: string) => {
        try {
            editFile({ content, id, title: val, type })
            const size = sizeof(content, 'utf-8')
            updateFile({
                content,
                size,
                id,
                title: val,
            })
            setCurrFileInfo({ ...currFileInfo, title: val })
        } catch {}
    }

    // 取消分享
    const cancelShare = async () => {
        try {
            await cancelShareFile({
                id,
                isCancel: true,
            })
            if (currTabId == Tabs.MyShare) {
                setCurrFileInfo(null)
                getMyShareFile()
            }
            message.success('操作成功')
        } catch (err) {
            message.success('操作失败')
            console.error(err)
        }
    }

    React.useEffect(() => {
        setContent(currFileInfo.content || '')
        title.current = currFileInfo.title
        setIsTop(currFileInfo.isTop)
    }, [currFileInfo])

    return (
        <div className={styles.container}>
            {![Tabs.ShareToMe, Tabs.Recycle].includes(currTabId) && (
                <div className={styles.header}>
                    {editing ? (
                        <Input
                            defaultValue={currFileInfo.title}
                            onChange={(event) => (title.current = event.target.value)}
                        />
                    ) : (
                        <div
                            contentEditable={true}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    ;(e.target as HTMLDivElement).blur()
                                }
                            }}
                            className={styles.title}
                            onBlur={(e) => editTitle(e.target.innerText)}
                            dangerouslySetInnerHTML={{ __html: currFileInfo.title }}
                        />
                    )}
                    {!!currFileInfo.id && renderBtns()}
                </div>
            )}
            <div className={styles.content}>
                {contentLoading && <Spin className={styles.loading} />}
                {editing ? renderEditingContent() : <RenderContent type={type} content={content} />}
            </div>
            {loading && <PageLoading />}
        </div>
    )
}

export default observer(File)
