import React from 'react'
import { Spin } from 'antd'

import PortalsContainer from '@components/PortalsContainer'
import styles from './index.scss'

interface Props {
    Icon?: React.ReactElement
}

function PageLoading({ Icon }: Props) {
    return <PortalsContainer className={styles.wrapper}>{Icon || <Spin />}</PortalsContainer>
}

export default PageLoading
