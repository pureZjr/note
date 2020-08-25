import * as React from 'react'

import IconNotfound from '@assets/svgs/404.svg'
import styles from './index.scss'

export default class NotFound extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <IconNotfound className="no-fill" />
            </div>
        )
    }
}
