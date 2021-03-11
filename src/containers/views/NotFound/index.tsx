import * as React from 'react'

import Icon from '@components/Icon'
import styles from './index.scss'

export default class NotFound extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <Icon type="icon404" />
            </div>
        )
    }
}
