import * as React from 'react'
import VideoPlayer from '@components/VideoPlayer'
import CreateType from '@store/extraStore/CreateType'
import { ImgView, ImgViewTrigger } from '@components/ImgView'
import ReactMarkdown from '@components/ReactMarkdown'

import styles from './index.scss'

interface Props {
    type: CreateType
    content: string
    style?: React.CSSProperties
}

const RenderContent: React.FC<Props> = ({ type, content, style = {} }: Props) => {
    // 渲染显示内容
    const renderReadingContent = () => {
        switch (type) {
            case CreateType.Img:
                return (
                    <ImgView
                        imgUrl={content}
                        style={{
                            padding: 12,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <ImgViewTrigger>
                            <img
                                style={{
                                    marginRight: 10,
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                    cursor: 'pointer',
                                }}
                                src={`${content}?imageView2/1/interlace/1`}
                            />
                        </ImgViewTrigger>
                    </ImgView>
                )
            case CreateType.MarkDown:
                return <ReactMarkdown content={content ?? ''}></ReactMarkdown>
            case CreateType.Video:
                return (
                    <VideoPlayer
                        url={content}
                        onVideoReady={(dom) => {
                            setTimeout(() => {
                                dom.parentElement.querySelector('.vjs-big-play-button').style.opacity = 1
                            }, 100)
                        }}
                        style={{
                            margin: '0 auto',
                            maxWidth: '99%',
                            maxHeight: '100%',
                        }}
                    />
                )
            case CreateType.Article:
                return (
                    <div
                        className={styles.article}
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                )
        }
    }

    return (
        <div style={style} className={styles.container}>
            {renderReadingContent()}
        </div>
    )
}

export default RenderContent
