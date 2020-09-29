import * as React from 'react'
import { observer } from 'mobx-react'
import {
    EditOutlined,
    SaveOutlined,
    ExclamationCircleOutlined,
    ShareAltOutlined,
    EllipsisOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { get } from 'lodash'
import { Input, Spin, Tooltip, Dropdown, Menu, Modal, Button } from 'antd'
import moment from 'moment'

import message from '@components/AntdMessageExt'
import { editFile } from '@services/api/file'
import { useRootStore } from '@utils/customHooks'
import { sizeof, copyToClipboard } from '@utils/common'
import * as styles from './index.scss'
import CodeBlock from './CodeBlock'
import Editor from './Editor'
import { setTopFile, createShareFileLink } from '@services/api/file'
import { Tabs } from '@store/extraStore'
import { SHHARE_BASE_URL, BREAK_IMAGE } from '@constant/index'
import CreateType from '@store/extraStore/CreateType'
import { ImgView, ImgViewTrigger } from '@components/ImgView'
import RenderVideo from '@components/RenderVideo'

const TextArea = Input.TextArea

const File: React.FC = () => {
    const {
        fileStore: { files, currFileId, contentLoading, fileContent, setFileContent, updateFile, getFiles },
        extraStore: { currTabId, getNewestFolderAndFile }
    } = useRootStore()

    const [editing, setEditing] = React.useState(false)
    const [content, setContent] = React.useState(fileContent)
    const [title, setTitle] = React.useState('')
    const [mdEditAndRead, setMdEditAndRead] = React.useState(true)

    React.useEffect(() => {
        setContent(fileContent)
    }, [fileContent])

    React.useEffect(() => {
        setContent('')
        setFileContent('')
        setEditing(false)
    }, [currFileId])

    const file = React.useMemo(() => {
        return files.find(v => v.id === currFileId)
    }, [currFileId, files])

    // 编辑
    const editTigger = (isEditing?: boolean) => {
        setEditing(!isEditing)
        if (isEditing) {
            save(content, currFileId)
        } else {
            setContent(content || '')
            setTitle(file.title)
            setMdEditAndRead(true)
        }
    }

    // 写文章
    const onHandleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
    }

    // 保存
    const save = (content: string, currArticleId: string) => {
        if (editing) {
            editFile({ content, id: currArticleId, title, type: file.type })
            const size = sizeof(content, 'utf-8')
            updateFile({
                content,
                size,
                id: currArticleId,
                title
            })
        }
    }

    // 标题
    const onHandleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }
    // 加载操作项
    const renderBtns = () => {
        const setTop = async () => {
            try {
                const { id, isTop } = file
                const data = { id, is_top: Boolean(isTop) ? 0 : 1 }
                await setTopFile(data)
                if (Tabs.NewDoc === currTabId) {
                    getNewestFolderAndFile()
                } else {
                    await getFiles(file.parentKey)
                }
                message.success('操作成功')
            } catch {}
        }
        const copy = async (link: string) => {
            copyToClipboard(link)
            message.success('复制成功')
        }
        // 获取分享链接
        const getShareLink = async () => {
            try {
                await createShareFileLink({ key: file.key, ts: moment().valueOf() })
                const link = `${SHHARE_BASE_URL}${file.key}`
                const dialog = Modal.info({
                    title: '分享链接',
                    mask: false,
                    okButtonProps: { title: '关闭' },
                    content: (
                        <div>
                            <span className={styles.tips}>链接生成成功, 复制链接分享给好友吧</span>
                            <div>
                                <span>{link}</span>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => {
                                        copy(link)
                                        dialog.destroy()
                                    }}
                                >
                                    复制链接
                                </Button>
                            </div>
                        </div>
                    )
                })
            } catch {}
        }

        const menu = () => (
            <Menu>
                <Menu.Item onClick={setTop}>{Boolean(file.isTop) ? '取消置顶' : '置顶'}</Menu.Item>
            </Menu>
        )

        const info = () => {
            return (
                <div className={styles.info}>
                    <div>
                        <label>创建时间：</label>
                        <span>{moment(file.createTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>修改时间：</label>
                        <span>{moment(file.updateTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>文件夹：</label>
                        <span>{file.parentFolderTitle}</span>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.btns}>
                {[CreateType.Article, CreateType.MarkDown].includes(file.type) && (
                    <span onClick={() => editTigger(editing)}>
                        {editing ? (
                            <Tooltip title="保存">
                                <SaveOutlined style={IconStyle} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="编辑">
                                <EditOutlined style={IconStyle} />
                            </Tooltip>
                        )}
                    </span>
                )}
                <Tooltip title="分享">
                    <ShareAltOutlined onClick={getShareLink} style={IconStyle} />
                </Tooltip>
                <Dropdown overlay={menu()}>
                    <EllipsisOutlined style={IconStyle} />
                </Dropdown>
                <Tooltip title={info()} placement="bottomRight" trigger="click">
                    <ExclamationCircleOutlined style={IconStyle} />
                </Tooltip>
            </div>
        )
    }

    const IconStyle = {
        marginLeft: 8,
        cursor: 'pointer',
        fontSize: 18
    }

    const mdDivider = () => <div className={styles.divider} onClick={() => setMdEditAndRead(!mdEditAndRead)} />

    const renderReadingContent = () => {
        switch (file.type) {
            case CreateType.Img:
                return (
                    <ImgView
                        imgUrl={content}
                        style={{
                            padding: 12,
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            display: 'flex'
                        }}
                    >
                        <ImgViewTrigger>
                            <img
                                style={{
                                    marginRight: 10
                                }}
                                width={100}
                                height={100}
                                src={content}
                                ref={ref => {
                                    if (ref) {
                                        ref.onerror = () => {
                                            ref.src = BREAK_IMAGE
                                        }
                                    }
                                }}
                            />
                        </ImgViewTrigger>
                    </ImgView>
                )
            case CreateType.MarkDown:
                return (
                    <ReactMarkdown
                        className={styles.markdown}
                        source={content}
                        renderers={{
                            code: CodeBlock
                        }}
                        escapeHtml={false}
                    />
                )
            case CreateType.Video:
                return (
                    <RenderVideo
                        videoSrc={content}
                        width={500}
                        height={300}
                        style={{
                            margin: 12
                        }}
                    />
                )
            case CreateType.Article:
                return (
                    <div
                        style={{ padding: 12 }}
                        dangerouslySetInnerHTML={{
                            __html: content
                        }}
                    />
                )
        }
    }

    const renderEditingContent = () => {
        switch (file.type) {
            case CreateType.Article:
                return (
                    <Editor
                        defaultValue={content}
                        onChange={v => {
                            setContent(v)
                        }}
                    />
                )
            case CreateType.MarkDown:
                const textarea = (
                    <TextArea style={{ border: 0, padding: 12 }} onChange={onHandleInput} value={content} />
                )
                return (
                    <>
                        {mdEditAndRead ? (
                            <div className={styles['md-edit-and-read']}>
                                <div className={styles['textarea-container']}>
                                    {textarea}
                                    {mdDivider()}
                                </div>
                                <ReactMarkdown
                                    className={styles.markdown}
                                    source={content}
                                    renderers={{
                                        code: CodeBlock
                                    }}
                                    escapeHtml={false}
                                />
                            </div>
                        ) : (
                            <>
                                {textarea}
                                {mdDivider()}
                            </>
                        )}
                    </>
                )
        }
    }

    if (!file) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}
            >
                <img
                    style={{
                        filter: 'grayscale(100%)',
                        borderRadius: 4
                    }}
                    src={require('@assets/img/illusion.jpg')}
                    width={90}
                    height={90}
                />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {editing ? (
                    <Input value={title} onChange={onHandleChangeTitle} style={{ width: 150 }} />
                ) : (
                    <span className={styles.title}>{get(file, 'title')}</span>
                )}
                {!!currFileId && renderBtns()}
            </div>
            <div className={styles.content}>
                {contentLoading && <Spin className={styles.loading} />}
                {editing ? renderEditingContent() : renderReadingContent()}
            </div>
        </div>
    )
}

export default observer(File)
