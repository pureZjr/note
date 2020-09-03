import * as React from 'react'
import { observer } from 'mobx-react'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { get } from 'lodash'
import { Input, Spin } from 'antd'

import { editArticle } from '@services/api/article'
import { useRootStore } from '@utils/customHooks'
import { sizeof } from '@utils/common'
import * as styles from './index.scss'
import CodeBlock from './CodeBlock'
import Editor from './Editor'

const TextArea = Input.TextArea

const Article: React.FC = () => {
    const {
        articleStore: { articleContent, setArticleContent, articles, currArticleId, contentLoading, updateArticle }
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
            editArticle({ content, id: currArticleId, title, type: article.type })
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
    const IconStyle = {
        width: 16,
        height: 16
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {editing ? (
                    <Input value={title} onChange={onHandleChangeTitle} style={{ width: 150 }} />
                ) : (
                    <span>{get(article, 'title')}</span>
                )}
                {!!currArticleId && (
                    <div className={styles.btns}>
                        <span onClick={() => editTigger(editing)}>
                            {editing ? <EyeOutlined {...IconStyle} /> : <EditOutlined {...IconStyle} />}
                        </span>
                    </div>
                )}
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
