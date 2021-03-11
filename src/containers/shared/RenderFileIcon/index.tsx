import * as React from 'react'

import Icon from '@components/Icon'
import CreateType from '@store/extraStore/CreateType'

interface Props {
    type: CreateType
    size?: number
}

const RenderFileIcon: React.FC<Props> = ({ type, size = 20 }: Props) => {
    const { MarkDown, Article, Img, Video } = CreateType

    const svgProps = {
        width: size,
        height: size,
        style: {
            fontSize: size
        }
    }

    return (
        <React.Fragment>
            {type === MarkDown && <Icon type="iconmarkdown" {...svgProps} />}
            {type === Article && <Icon type="icondocument" {...svgProps} />}
            {type === Img && <Icon type="iconimage" {...svgProps} />}
            {type === Video && <Icon type="iconvideo" {...svgProps} />}
        </React.Fragment>
    )
}

export default RenderFileIcon
