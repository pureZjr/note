import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { useOnMount, useRootStore } from '@utils/customHooks'
import { getShareFileLink } from '@services/api/file'
import CodeBlock from '../Home/File/CodeBlock'
import { LOCALSTORAGE } from '@constant/index'
import styles from './index.scss'

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [type, setType] = React.useState('')

    const { routerStore } = useRootStore()

    useOnMount(() => {
        const key = location.href.split('/')[location.href.split('/').length - 1]
        getShareFileLink({ key }).then(res => {
            setTitle(res.title)
            setContent(res.content)
            setType(res.type)
        })
    })

    const hasUserInfo = localStorage.getItem(LOCALSTORAGE.USERINFO)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {!hasUserInfo && (
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
