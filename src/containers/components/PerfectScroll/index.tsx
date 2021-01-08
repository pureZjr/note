import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import { AutoSizer } from 'react-virtualized'
import PerfectScrollbar from 'perfect-scrollbar'

import styles from './index.scss'
import { useOnMount, useOnUnMount } from '@utils/customHooks'

interface Props {
    children?: any
    height?: number
    style?: React.CSSProperties
    className?: string
    autoSizerStyle?: React.CSSProperties
    onReachStart?: (e) => void
    onReachEnd?: (e) => void
    bindReachEndUpdateOnce?: boolean // 是否在componentUpdate时重新绑定ps-y-reach-end事件，在聊天记录里用到;要保证getList的参数是最新的
    shouldUpdate?: boolean
    setPerfectScrollWrapperRef?: (ref: HTMLDivElement) => void
    suppressScrollX?: boolean
    scrollToTop?: boolean
}

/**
 * 封装perfect-scroll-bar，统一不同系统浏览器滚动条样式差异
 * @param height 传height时能单独使用，否则height为父元素高度
 */
const PerfectScroll: React.FC<Props> = ({
    children,
    height,
    style,
    className,
    autoSizerStyle,
    onReachEnd,
    onReachStart,
    bindReachEndUpdateOnce,
    shouldUpdate,
    setPerfectScrollWrapperRef,
    suppressScrollX,
    scrollToTop
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>()
    const scrollbar = useRef<PerfectScrollbar>(null)
    const updateTimer = useRef<NodeJS.Timer>(null)

    useOnMount(() => {
        scrollbar.current = new PerfectScrollbar(wrapperRef.current, {
            suppressScrollX
        })
        // 监听滚动到底部事件
        if (!bindReachEndUpdateOnce) {
            wrapperRef.current.addEventListener('ps-y-reach-start', onReachStart)
            wrapperRef.current.addEventListener('ps-y-reach-end', onReachEnd)
        }
        if (!!setPerfectScrollWrapperRef) {
            setPerfectScrollWrapperRef(wrapperRef.current)
        }
    })

    useOnUnMount(() => {
        clearTimeout(updateTimer.current)
        if (scrollbar.current) {
            scrollbar.current.destroy()
            scrollbar.current = null
        }
        if (wrapperRef.current) {
            wrapperRef.current = null
        }
    })

    useEffect(() => {
        if (shouldUpdate) {
            scrollbar.current && scrollbar.current.update()
            wrapperRef.current.scrollTop = 1000 // shouldUpdate目前只有seleceMember用到，这句代码和这个数值不严谨
        }
    }, [shouldUpdate])

    useEffect(() => {
        if (scrollToTop) {
            wrapperRef.current.scrollTop = 0
        }
    }, [scrollToTop])

    useEffect(() => {
        clearTimeout(updateTimer.current)
        updateTimer.current = setTimeout(() => {
            if (scrollbar.current) {
                scrollbar.current.update()
                if (bindReachEndUpdateOnce) {
                    wrapperRef.current.addEventListener('ps-y-reach-start', onReachStart, { once: true })
                    wrapperRef.current.addEventListener('ps-y-reach-end', onReachEnd, { once: true })
                }
            }
        }, 1000)
    })

    return (
        <div className={classnames(styles.wrapper, className)} style={{ ...style, height }} ref={wrapperRef}>
            <AutoSizer disableWidth style={autoSizerStyle}>
                {() => {
                    return children
                }}
            </AutoSizer>
        </div>
    )
}

export default PerfectScroll
