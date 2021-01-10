import * as React from 'react'

import IconMarkdown from '@assets/svgs/markdown.svg'
import IconDocument from '@assets/svgs/document.svg'
import IconImage from '@assets/svgs/image.svg'
import IconVideo from '@assets/svgs/video.svg'
import CreateType from '@store/extraStore/CreateType'

interface Props {
    type: CreateType
    size?: number
}

const RenderFileIcon: React.FC<Props> = ({ type, size = 20 }: Props) => {
    const { MarkDown, Article, Img, Video } = CreateType

    const svgProps = {
        className: 'no-fill',
        width: size,
        height: size,
        style: {
            fontSize: size
        }
    }

    return (
        <React.Fragment>
            {type === MarkDown && <IconMarkdown {...svgProps} />}
            {type === Article && <IconDocument {...svgProps} />}
            {type === Img && <IconImage {...svgProps} />}
            {type === Video && <IconVideo {...svgProps} />}
        </React.Fragment>
    )
}

export default RenderFileIcon
