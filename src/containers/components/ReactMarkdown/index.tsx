import * as React from 'react'
import cs from 'classnames'

import _ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './index.module.scss'
import 'katex/dist/katex.min.css'

interface Props {
    className?: string
    content: string
}

const ReactMarkdown: React.FC<Props> = ({ className, content }: Props) => {
    return (
        <div className={cs(styles.container, className)}>
            <_ReactMarkdown
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                // eslint-disable-next-line react/no-children-prop
                                children={String(children).replace(/\n$/, '')}
                                style={dark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {content}
            </_ReactMarkdown>
        </div>
    )
}

export default ReactMarkdown
