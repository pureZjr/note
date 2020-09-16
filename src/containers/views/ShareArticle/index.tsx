import * as React from 'react'

import { useOnMount } from '@utils/customHooks'
import { getShareArticleLink } from '@services/api/article'
import * as styles from './index.scss'

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')

    useOnMount(() => {
        const key = location.href.split('/')[location.href.split('/').length - 1]
        getShareArticleLink({ key }).then(res => {
            setTitle(res.title)
            setContent(res.content)
        })
    })

    const hasToken = localStorage.getItem('token')

    return (
        <div className={styles.container}>
            <div>
                {title}
                {!hasToken && <div className={styles.btn}>注册 / 登录</div>}
            </div>
            <div>{content}</div>
        </div>
    )
}

export default ShareArticle
