import * as React from 'react'
import WangeEditor from 'wangeditor'

import { useOnMount } from '@utils/customHooks'
import * as styles from './index.scss'

interface IProps {
    defaultValue?: string
    onChange: (txt: string) => void
}

const Editor: React.FC<IProps> = ({ defaultValue, onChange }: IProps) => {
    const ref = React.useRef(null)

    const create = editor => {
        editor.create()
    }

    const setTxt = (txt, editor) => {
        editor.txt.html(txt)
    }

    const bindOnTxtChange = editor => {
        editor.customConfig.onchange = html => {
            onChange(html)
        }
    }

    const init = () => {
        const editor = new WangeEditor(ref.current)
        bindOnTxtChange(editor)
        create(editor)
        setTxt(defaultValue, editor)
    }

    useOnMount(() => {
        init()
    })

    return <div className={styles['wange-editor']} ref={ref}></div>
}

export default Editor
