import * as React from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-monokai'

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
            mode="markdown"
            theme="monokai"
            onChange={val => onChange(val)}
            defaultValue={defaultValue}
            name="blah2"
            height="100%"
            width="100%"
            highlightActiveLine
            setOptions={{ useWorker: false, tabSize: 2, wrap: true }}
            editorProps={{ $blockScrolling: true }}
        />
    )
}

export default MarkDownEditor
