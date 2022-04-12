import * as React from 'react'
import cs from 'classnames'

import _ReactMarkdown from 'react-markdown'
import styles from './index.module.scss'

interface Props {
    className?: string
    content: string
}

const ReactMarkdown: React.FC<Props> = ({ className, content }: Props) => {
    return (
        <div className={cs(styles.container, className)}>
            <_ReactMarkdown>{content}</_ReactMarkdown>
        </div>
    )
}

export default ReactMarkdown
