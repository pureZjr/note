import * as React from 'react'
import { cloneDeep } from 'lodash'
import { message as AntdMessage } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { ConfigOnClose, MessageApi } from 'antd/lib/message'

import styles from './index.scss'

export type NoticeType = 'info' | 'success' | 'error' | 'warn' | 'warning' | 'loading'

// 扩展message
const message: MessageApi = cloneDeep(AntdMessage)

function notice(
    type: NoticeType,
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    const newContent: React.ReactNode = (
        <span>
            {content}
            <CloseOutlined className={styles.iconClose} onClick={message.destroy} />
        </span>
    )
    AntdMessage.destroy()
    return AntdMessage[type](newContent, duration, onClose)
}

message.info = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('info', content, duration, onClose)
}

message.success = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('success', content, duration, onClose)
}

message.error = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('error', content, duration, onClose)
}

message.warn = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('warn', content, duration, onClose)
}

message.warning = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('warning', content, duration, onClose)
}

message.loading = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('loading', content, duration, onClose)
}

export default message
