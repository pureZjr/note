import React, { Children, cloneElement } from 'react'
import Viewer from 'viewerjs'
/* tslint:disable:no-string-literal */

import message from './../AntdMessageExt'
import RenderImg from './RenderImg'
import ImgLoading from './ImgLoading'
import { BREAK_IMAGE } from '@constant/index'

const ImgViewTriggerName = 'imgViewTrigger'
const isImgViewTrigger = (el) => {
    return el.type && el.type.componentName === ImgViewTriggerName
}

function deepMap(children, callback) {
    return Children.map(children, (child) => {
        if (child === null) {
            return null
        }
        if (isImgViewTrigger(child)) {
            return callback(child)
        }
        if (React.isValidElement(child)) {
            return cloneElement(child, child.props)
        }
        return child
    })
}
export interface ImgViewTriggerProps {
    children: React.ReactNode
    index?: number
}

export interface IS {
    show: boolean
    index: number
    loading: boolean
    isLoaded: boolean
}
export interface IP {
    imgUrl?: string | string[]
    options?: Viewer.Options
    thumbnailConfig?: boolean
    className?: string
    style?: React.CSSProperties
    onView?: (index?: number) => void
    cancelShowImg?: boolean
    downloadCallback?: () => any
}

export class ImgViewTrigger extends React.Component<ImgViewTriggerProps> {
    render() {
        return null
    }
}

ImgViewTrigger['componentName'] = ImgViewTriggerName

export class ImgView extends React.Component<IP, IS> {
    constructor(props: IP) {
        super(props)
        this.state = { show: false, index: 0, loading: false, isLoaded: false }
    }

    static defaultProps = { imgUrl: BREAK_IMAGE, options: {} }

    handleShow = async (index = 0): Promise<any> => {
        if (this.props.cancelShowImg) {
            return
        }
        this.setState({ index })
        if (this.state.isLoaded) {
            this.setImageState()
        }
        const { imgUrl } = this.props
        const src = typeof imgUrl === 'string' ? [imgUrl] : imgUrl
        this.setState({ loading: true })
        this.loadImageAsync(src[index])
            .then((e) => {
                this.setState({ isLoaded: true })
                const { target, path } = e
                if ((target && (target as any).naturalWidth) || (path && path[0] && (path[0] as any).naturalWidth)) {
                    if (this.state.loading) {
                        this.setImageState()
                    }
                }
            })
            .catch(() => {
                message.info('正在加载中，请稍后重试...')
                this.setState({ loading: false })
            })
    }

    handleView = (event: CustomEvent) => {
        if (!event || !event.detail || typeof event.detail.index !== 'number') {
            return message.info('你的浏览器环境不支持图片切换!')
        }
        const { index } = event.detail
        this.setState({ index })
        const { onView } = this.props
        if (onView) {
            onView(index)
        }
    }

    setImageState = () => {
        this.setState({ show: true, loading: false })
    }

    loadImageAsync = (url: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onload = (e) => resolve(e)
            img.onerror = (e) => reject(e)
        })
    }

    handleHide = () => {
        this.setState({ show: false })
    }

    handleClick = () => {
        this.setState({ loading: false }, () => {
            this.handleHide()
        })
    }

    render() {
        const { className, style, children, imgUrl, options, onView, downloadCallback } = this.props
        const { show, index: currentIndex, loading } = this.state
        const src = typeof imgUrl === 'string' ? [imgUrl] : [...imgUrl]
        const customOptions = src.length === 1 ? { toolbar: { prev: false, next: false } } : options
        if (onView) {
            ;(customOptions as Viewer.Options).view = this.handleView
        }
        return (
            <div className={className} style={style}>
                {loading ? (
                    <ImgLoading onClick={this.handleClick} />
                ) : (
                    show && (
                        <RenderImg
                            downloadCallback={downloadCallback}
                            imgUrl={src}
                            index={currentIndex}
                            hide={this.handleHide}
                            options={customOptions as Viewer.Options}
                        />
                    )
                )}
                {deepMap(children, (child) => {
                    const props = {
                        onClick: () => {
                            const { index, children: nativeChild } = child.props
                            if (nativeChild.props.onClick) {
                                nativeChild.props.onClick()
                            }
                            this.handleShow(index)
                        },
                    }
                    return cloneElement(child.props.children, props)
                })}
            </div>
        )
    }
}
