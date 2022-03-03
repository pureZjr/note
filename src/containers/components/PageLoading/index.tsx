import React from 'react'
import { Spin } from 'antd'

import PortalsContainer from '@components/PortalsContainer'
import styles from './index.module.scss'

interface Props {
    hasMask?: boolean
    Icon?: React.ReactElement
}

function PageLoading({ hasMask, Icon }: Props) {
    return (
        <PortalsContainer className={styles.wrapper}>
            {hasMask && <div className={styles.mask} />}
            {Icon || <Spin />}
        </PortalsContainer>
    )
}

export default PageLoading
