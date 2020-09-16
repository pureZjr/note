import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { useOnMount, useRootStore } from '@utils/customHooks'
import { getShareArticleLink } from '@services/api/article'
import CodeBlock from '../Home/Article/CodeBlock'
import * as styles from './index.scss'

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [type, setType] = React.useState('')

    const { routerStore } = useRootStore()

    useOnMount(() => {
        const key = location.href.split('/')[location.href.split('/').length - 1]
        getShareArticleLink({ key }).then(res => {
            setTitle(res.title)
            setContent(res.content)
            setType(res.type)
        })
    })

    const hasToken = localStorage.getItem('token')

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {!hasToken && (
                    <div
                        onClick={() => {
                            routerStore.history.push('/login')
                        }}
                        className={styles.btn}
                    >
                        注册 / 登录
                    </div>
                )}
            </div>
            <div className={styles.content}>
                {type === 'article' ? (
                    <div>{content}</div>
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

export default ShareArticle
