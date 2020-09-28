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
import { SHHARE_BASE_URL } from '@constant/index'

const TextArea = Input.TextArea

const Article: React.FC = () => {
    const {
        articleStore: {
            articleContent,
            articles,
            currArticleId,
            contentLoading,
            setArticleContent,
            updateArticle,
            getArticles
        },
        extraStore: { currTabId, getNewestFolderAndFile }
    } = useRootStore()

    const [editing, setEditing] = React.useState(false)
    const [content, setContent] = React.useState(articleContent)
    const [title, setTitle] = React.useState('')

    React.useEffect(() => {
        setContent(articleContent)
    }, [articleContent])

    React.useEffect(() => {
        setContent('')
        setArticleContent('')
        setEditing(false)
    }, [currArticleId])

    const article = React.useMemo(() => {
        return articles.find(v => v.id === currArticleId)
    }, [currArticleId, articles])

    // 编辑
    const editTigger = (isEditing?: boolean) => {
        setEditing(!isEditing)
        if (isEditing) {
            save(content, currArticleId)
        } else {
            setContent(content || '')
            setTitle(article.title)
        }
    }

    // 写文章
    const onHandleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
    }

    // 保存
    const save = (content: string, currArticleId: string) => {
        if (editing) {
            editFile({ content, id: currArticleId, title, type: article.type })
            const size = sizeof(content, 'utf-8')
            updateArticle({
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
                const { id, isTop } = article
                const data = { id, is_top: Boolean(isTop) ? 0 : 1 }
                await setTopFile(data)
                if (Tabs.NewDoc === currTabId) {
                    getNewestFolderAndFile()
                } else {
                    await getArticles(article.parentKey)
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
                await createShareFileLink({ key: article.key, ts: moment().valueOf() })
                const link = `${SHHARE_BASE_URL}${article.key}`
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
                <Menu.Item onClick={setTop}>{Boolean(article.isTop) ? '取消置顶' : '置顶'}</Menu.Item>
            </Menu>
        )

        const info = () => {
            return (
                <div className={styles.info}>
                    <div>
                        <label>创建时间：</label>
                        <span>{moment(article.createTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>修改时间：</label>
                        <span>{moment(article.updateTime).format('YYYY-MM-DD')}</span>
                    </div>
                    <div>
                        <label>文件夹：</label>
                        <span>{article.parentFolderTitle}</span>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.btns}>
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

    if (!article) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {editing ? (
                    <Input value={title} onChange={onHandleChangeTitle} style={{ width: 150 }} />
                ) : (
                    <span className={styles.title}>{get(article, 'title')}</span>
                )}
                {!!currArticleId && renderBtns()}
            </div>
            <div className={styles.content}>
                {contentLoading && <Spin className={styles.loading} />}
                {editing ? (
                    <>
                        {article.type === 'article' ? (
                            <Editor
                                defaultValue={content}
                                onChange={v => {
                                    setContent(v)
                                }}
                            />
                        ) : (
                            <TextArea onChange={onHandleInput} value={content} />
                        )}
                    </>
                ) : (
                    <ReactMarkdown
                        className={styles.markdown}
                        source={content}
                        renderers={{
                            code: CodeBlock
                        }}
                        escapeHtml={false}
                    />
                )}
            </div>
        </div>
    )
}

export default observer(Article)
