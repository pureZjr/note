import * as React from 'react'
import ReactMarkdown from 'react-markdown'

import { useOnMount, useRootStore } from '@utils/customHooks'
import { getShareFileLink } from '@services/api/file'
import CreateType from '@store/extraStore/CreateType'
import { LOCALSTORAGE } from '@constant/index'
import styles from './index.module.scss'

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [type, setType] = React.useState('')

    const { routerStore } = useRootStore()

    useOnMount(() => {
        const key = location.href.split('/').at(-1)
        getShareFileLink({ key }).then((res) => {
            setTitle(res.title)
            setContent(res.content)
            setType(res.type)
        })
    })

    const renderContent = () => {
        const { Article, MarkDown } = CreateType

        switch (type) {
            case Article:
                return <div>{content}</div>
            case MarkDown:
                return <ReactMarkdown>{content}</ReactMarkdown>
        }
    }

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
            <div className={styles.content}>{renderContent()}</div>
        </div>
    )
}

export default ShareArticle
