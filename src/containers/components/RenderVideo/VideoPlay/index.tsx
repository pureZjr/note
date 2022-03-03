import * as React from 'react'
import * as ReactDOM from 'react-dom'

import styles from './index.module.scss'
import { downloadRemoteFile } from '@utils/common'
import message from '@components/AntdMessageExt'
import Icon from '@components/Icon'

export interface ShowOptions {
    width?: number
    height?: number
    title?: string
    content?: string
    poster?: string
    beforeHide?: () => Promise<any>
    disableDownload?: boolean
    downloadCallback?: () => any
    disableAutoplay?: boolean
}

export interface VideoPlayProps extends ShowOptions {
    url: string
}

class VideoPlay extends React.Component<VideoPlayProps> {
    constructor(props) {
        super(props)
    }

    static setUpContainer(url: string, options?: ShowOptions) {
        const container = document.createElement('div')
        document.body.appendChild(container)
        ;(VideoPlay as any).container = container

        let width = (options && options.width) || 640
        let height = (options && options.height) || 480

        if (options && options.title) {
            const { clientHeight, clientWidth } = document.getElementsByTagName('html')[0]
            const ratio = clientHeight / clientWidth
            if ((clientHeight - 300) / ratio < height || (clientWidth - 150) * ratio < width) {
                height = clientWidth * ratio - 300
                width = height / 0.65
            }
        }

        const Component = (
            <VideoPlay
                url={url}
                width={width}
                height={height}
                beforeHide={options ? options.beforeHide : null}
                title={options ? options.title : ''}
                content={options ? options.content : ''}
                poster={options ? options.poster : ''}
                disableDownload={options ? options.disableDownload : false}
                downloadCallback={options ? options.downloadCallback : null}
                disableAutoplay={options ? options.disableAutoplay : false}
            />
        )
        ReactDOM.render(Component, (VideoPlay as any).container)
    }

    static show(url: string, options?: ShowOptions) {
        if (!url || typeof url !== 'string') {
            throw new Error('the show method only accept a string value!')
        }
        VideoPlay.setUpContainer(url, options)
    }

    beforeHide = async (): Promise<any> => {
        const { beforeHide } = this.props
        if (beforeHide) {
            try {
                await beforeHide()
            } catch (err) {}
        }
        VideoPlay.hide()
    }

    static hide() {
        ReactDOM.unmountComponentAtNode((VideoPlay as any).container)
        document.body.removeChild((VideoPlay as any).container)
    }

    setVideoRef = v => {
        if (!!v) {
            // 去掉画中画
            v.disablePictureInPicture = true
            // 禁止右键
            v.oncontextmenu = function() {
                return false
            }
        }
    }

    downloadEvent = async () => {
        const { url, downloadCallback } = this.props
        const videoName = this.getVideoName()
        try {
            await downloadRemoteFile(url, videoName)
            if (!!downloadCallback) {
                downloadCallback()
            }
        } catch (err) {
            if (err.message === 'Network Error') {
                message.error('下载失败')
            }
        }
    }

    getVideoName = () => {
        const { url } = this.props
        const slantingIndex = url.lastIndexOf('/')
        const dotIndex = url.lastIndexOf('!')
        return url.slice(slantingIndex + 1, dotIndex > -1 ? dotIndex : url.length)
    }

    render() {
        const { url, width, height, title, content, poster, disableDownload, disableAutoplay } = this.props
        return (
            <div className={styles.container}>
                <div className={styles.videoBox}>
                    <video
                        ref={this.setVideoRef}
                        className={styles.video}
                        width={width}
                        height={height}
                        controls={true}
                        poster={poster}
                        autoPlay={disableAutoplay ? false : true}
                    >
                        <source src={url} type="video/mp4" />
                    </video>
                    <Icon
                        type="iconv2-close-png"
                        className={styles.iconClose}
                        width={50}
                        height={50}
                        onClick={this.beforeHide}
                    />
                    {!disableDownload && (
                        <Icon type="icondownload" onClick={this.downloadEvent} className={styles.downLoadIcon} />
                    )}
                </div>
                <div className={styles.overlay} onClick={this.beforeHide} />
                {title && (
                    <div className={styles.title} style={{ width }}>
                        {title}
                    </div>
                )}
                {content && (
                    <div className={styles.content} style={{ width }}>
                        {content}
                    </div>
                )}
            </div>
        )
    }
}

export default VideoPlay
