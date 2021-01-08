import React from 'react'
import { Spin } from 'antd'
import classNames from 'classnames'

import styles from './index.scss'

export interface IProps {
    className?: string
    style?: React.CSSProperties
}

/**
 * 界面Loading, 默认css样式以position: absolute实现居中, 此时需要父级元素设置为position: relative
 *
 * @param {IProps} { className, style }
 * @returns
 */
function SectionLoading({ className, style }: IProps) {
    return <Spin className={classNames(styles.loading, className)} style={style} />
}

export default SectionLoading
