import * as React from 'react'
import { cloneDeep } from 'lodash'
import { message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { ConfigOnClose, MessageApi } from 'antd/lib/message'

import styles from './index.module.scss'

export type NoticeType = 'info' | 'success' | 'error' | 'warn' | 'warning' | 'loading'

// 扩展message
const AntdMessage: MessageApi = cloneDeep(message)

function notice(
    type: NoticeType,
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    const newContent: React.ReactNode = (
        <span>
            {content}
            <CloseOutlined className={styles.iconClose} onClick={AntdMessage.destroy} />
        </span>
    )
    message.destroy()
    return message[type](newContent, duration, onClose)
}

AntdMessage.info = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('info', content, duration, onClose)
}

AntdMessage.success = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('success', content, duration, onClose)
}

AntdMessage.error = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('error', content, duration, onClose)
}

AntdMessage.warn = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('warn', content, duration, onClose)
}

AntdMessage.warning = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('warning', content, duration, onClose)
}

AntdMessage.loading = function (
    content: React.ReactNode,
    duration?: number | (() => void) | undefined,
    onClose?: ConfigOnClose
) {
    return notice('loading', content, duration, onClose)
}

export default AntdMessage
