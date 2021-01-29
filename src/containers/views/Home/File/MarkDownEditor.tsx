import * as React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-twilight'

import { useOnUnMount } from '@utils/customHooks'

interface Props {
    className?: string
    defaultValue?: string
    onSave: (content: string) => void
    onChange: (txt: string) => void
}

const MarkDownEditor: React.FC<Props> = ({ className, defaultValue, onSave, onChange }: Props) => {
    const aceRef = React.useRef(null)

    useOnUnMount(() => {
        onSave(aceRef.current.props.defaultValue)
    })

    return (
        <AceEditor
            placeholder="开始你的大创作..."
            ref={aceRef}
            className={className}
            mode="javascript"
            theme="twilight"
            onChange={onChange}
            defaultValue={defaultValue}
            name="blah2"
            height="1000%"
            width="1000%"
            editorProps={{ $blockScrolling: true }}
        />
    )
}

export default MarkDownEditor
