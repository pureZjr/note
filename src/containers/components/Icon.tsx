import React from 'react'

interface Props extends React.SVGAttributes<SVGElement> {
    type: string
    className?: string
    size?: string
}

// https://mobile.ant.design/docs/react/upgrade-notes-cn#Icon
function Icon({ type = '', className = '', size = 'md', ...restProps }: Props) {
    return (
        <svg className={`am-icon am-icon-${type} am-icon-${size}  ${className}`} {...restProps}>
            <use xlinkHref={`#${type}`} />
        </svg>
    )
}

export default Icon
