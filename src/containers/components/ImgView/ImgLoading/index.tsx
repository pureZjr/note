import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './index.module.scss'
import PortalsContainer from '@components/PortalsContainer'

export interface ImgLoadingProps {
    onClick?: () => void
}

function ImgLoading({ onClick }: ImgLoadingProps) {
    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />
    return (
        <PortalsContainer style={{ backgroundColor: 'transparent', zIndex: 8990 }}>
            <Spin indicator={antIcon} className={styles.container} />
            <div onClick={onClick} className={styles.mask} />
        </PortalsContainer>
    )
}

export default ImgLoading
