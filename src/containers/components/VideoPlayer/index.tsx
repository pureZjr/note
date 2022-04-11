import 'video.js/dist/video-js.css'

import React from 'react'
import { useVideoJS } from 'react-hook-videojs'

import styles from './index.module.scss'

const defaultVideoProps = {
    controls: true,
    preload: 'auto',
    muted: true,
    playsinline: true,
    controlBar: {
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: true,
        fullscreenToggle: false,
        pictureInPictureToggle: false,
        volumePanel: {
            inline: false,
        },
    },
    playbackRates: [0.5, 1, 1.5, 2],
}

const VideoPlayer = (args) => {
    const { url, videoProps, style, onVideoReady, disableClickPause, disableDbClickFullScreen } = args
    const className = 'video-js-cover vjs-big-play-centered'
    const { Video, player, ready } = useVideoJS(
        { sources: [{ src: url }], ...defaultVideoProps, ...videoProps },
        className
    )

    if (ready) {
        const videoDom = player.el_.querySelector('video')
        if (typeof onVideoReady === 'function') {
            onVideoReady(videoDom)
        }

        // 禁用单击暂停
        if (disableClickPause) {
            player.tech_.off('click')
        }

        // 禁用双击全屏
        if (disableDbClickFullScreen) {
            player.tech_.off('dblclick')
        }
    }

    return (
        <div className={styles.container}>
            <Video style={style} />
        </div>
    )
}

export default VideoPlayer
