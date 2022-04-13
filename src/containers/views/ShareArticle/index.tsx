import * as React from 'react'

import Header from '@components/Header'
import RenderContent from '@shared/RenderContent'
import { useOnMount } from '@utils/customHooks'
import { getShareFileLink } from '@services/api/file'
import CreateType from '@store/extraStore/CreateType'
import styles from './index.scss'

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [type, setType] = React.useState<CreateType>(null)

    useOnMount(() => {
        const key = location.href.split('/').at(-1)
        getShareFileLink({ key }).then((res) => {
            setTitle(res.title)
            setContent(res.content)
            setType(res.type)
        })
    })

    return (
        <div className={styles.container}>
            <Header hideSearch showLogin></Header>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.content}>
                <RenderContent type={type} content={content} />
            </div>
        </div>
    )
}

export default ShareArticle
