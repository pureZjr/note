import React from 'react'
import { Spin } from 'antd'

import styles from './index.scss'
import PlayAngel from '@assets/svgs/play-angle.svg'
import VideoPlay from './VideoPlay'
import { PlayCircleOutlined } from '@ant-design/icons'

export interface IP {
    videoSrc: string
    width?: number
    height?: number
    style?: React.CSSProperties
    useMateriaFn?: () => any
    disableAutoplay?: boolean
    noPlay?: boolean
}

function RenderVideo({ videoSrc, width, height, style, useMateriaFn, disableAutoplay, noPlay }: IP) {
    const [notFound, setNotFound] = React.useState<boolean>(true)

    React.useEffect(() => {
        loadImg()
    }, [videoSrc])

    const src = `${videoSrc}?vframe/png/offset/1/w/${width || 156}/h/${height || 100}`

    const loadImg = () => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            setNotFound(false)
        }
        img.onerror = () => {
            setNotFound(true)
        }
    }

    const play = () => {
        VideoPlay.show(videoSrc, {
            downloadCallback: !!useMateriaFn ? useMateriaFn : null,
            disableAutoplay: disableAutoplay ? true : false
        })
    }

    const renderVideo = React.useMemo(() => {
        if (notFound) {
            return <Spin className={styles.loading} />
        } else {
            return <img src={src} width={width || 156} height={height || 100} />
        }
    }, [notFound])

    return (
        <div className={styles.container} style={{ width: width || 156, height: height || 100, ...style }}>
            {renderVideo}
            {!noPlay && (
                <div className={styles.mask} onClick={play}>
                    <PlayCircleOutlined className={styles.playIcon} />
                    <PlayAngel className={styles.playAngel} />
                </div>
            )}
        </div>
    )
}

export default RenderVideo
