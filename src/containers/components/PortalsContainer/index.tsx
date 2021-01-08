import * as React from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import styles from './index.scss'

export interface PortalsContainerProps {
    containers?: HTMLElement
    containersClassName?: string
    className?: string
    style?: React.CSSProperties
}

class PortalsContainer extends React.Component<PortalsContainerProps> {
    static defaultProps = {
        containers: window.document.body
    }
    el: HTMLDivElement = null
    constructor(props: PortalsContainerProps) {
        super(props)
        this.el = document.createElement('div')
        if (!!props.containersClassName) {
            this.el.className = props.containersClassName
        }
        if (!!props.containers) {
            props.containers.appendChild(this.el)
        }
    }

    componentWillUnmount() {
        if (!!this.props.containers) {
            this.props.containers.removeChild(this.el)
        }
    }

    render() {
        const { className, style } = this.props
        const classNamesTop = classNames(styles.portalsContainer, className)
        const element = (
            <div style={style} className={classNamesTop}>
                {this.props.children}
            </div>
        )
        return createPortal(element, this.el)
    }
}
export default PortalsContainer
