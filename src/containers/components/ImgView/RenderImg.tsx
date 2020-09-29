import React from 'react'
import Viewer from 'viewerjs'
import { isEqual } from 'lodash'

import { downloadRemoteFile } from '@utils/common'

export interface IP {
    imgUrl?: string[]
    index?: number
    options?: Viewer.Options
    hide?: () => void
    downloadCallback?: () => any
}

export default class RenderImg extends React.Component<IP> {
    viewerRef: HTMLDivElement = null
    viewerInstance: Viewer = null
    updateTimer: NodeJS.Timer = null

    // 图片下载
    imgDownLoad = () => {
        const { imgUrl, index, downloadCallback } = this.props
        const imgName = this.getImgName()
        if (!!downloadCallback) {
            downloadCallback()
        }
        downloadRemoteFile(imgUrl[index], imgName)
    }

    getImgName = () => {
        const { imgUrl, index } = this.props
        const slantingIndex = imgUrl[index].lastIndexOf('/')
        const dotIndex = imgUrl[index].lastIndexOf('!')
        return imgUrl[index].slice(slantingIndex + 1, dotIndex > -1 ? dotIndex : imgUrl[index].length)
    }

    createDownLoadBtn = () => {
        const target = document.querySelector('.viewer-container')
        if (!target || !this.props.downloadCallback) {
            return
        }
        const btnWrapper = document.createElement('div')
        const btnWrapperStyle = {
            height: '32px',
            width: '100%',
            position: 'absolute',
            zIndex: '100',
            display: 'flex',
            justifyContent: 'center',
            bottom: '40px'
        }
        Object.assign(btnWrapper.style, btnWrapperStyle)
        const btn = document.createElement('div')
        btn.innerText = '下载'
        btn.addEventListener('click', () => {
            this.imgDownLoad()
        })
        const style = {
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '82px',
            height: '32px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'white'
        }
        Object.assign(btn.style, style)
        btnWrapper.appendChild(btn)
        target.appendChild(btnWrapper)
    }

    componentDidMount() {
        const { options: customOptions, index, hide } = this.props
        const { toolbar, hidden, ...rest } = customOptions || ({ toolbar: {} } as Viewer.Options)
        const customToolbar = toolbar as {}
        const options: Viewer.Options = {
            button: false,
            title: false,
            loop: false,
            navbar: false,
            hidden: () => {
                if (hidden !== undefined) {
                    hidden(null)
                }
                hide()
            },
            toolbar: {
                zoomIn: true,
                zoomOut: true,
                oneToOne: true,
                reset: true,
                prev: true,
                play: false,
                next: true,
                rotateLeft: true,
                rotateRight: true,
                flipHorizontal: true,
                flipVertical: true,
                ...customToolbar
            },
            ...rest
        }
        this.viewerInstance = new Viewer(this.viewerRef, options)
        this.viewerInstance.view(index)

        this.createDownLoadBtn()
    }

    componentDidUpdate(prevProps: IP) {
        const { index, imgUrl } = this.props
        if (isEqual(prevProps.imgUrl, imgUrl)) {
            return
        }
        if (this.viewerInstance) {
            this.viewerInstance.update()
            this.viewerInstance.view(index)
        }
    }

    componentWillUnmount() {
        this.viewerInstance.destroy()
    }

    render() {
        return (
            <div style={{ display: 'none' }} ref={ref => (this.viewerRef = ref)}>
                {this.props.imgUrl.map((url, index) => (
                    <img src={url} key={index} style={{ display: 'none' }} />
                ))}
            </div>
        )
    }
}
