import * as React from 'react'
import WangeEditor from 'wangeditor'
import classname from 'classnames'

import { useOnMount, useOnUnMount } from '@utils/customHooks'
import styles from './index.scss'

interface Props {
    className?: string
    defaultValue?: string
    colors?: string[]
    isGetText?: boolean
    onSave: (content: string) => void
    onChange: (txt: string) => void
}

const Editor: React.FC<Props> = ({ className, defaultValue, colors = [], isGetText, onSave, onChange }: Props) => {
    const ref = React.useRef(null)
    const editorRef = React.useRef(null)

    const create = editor => {
        editor.create()
    }

    const setTxt = (txt, editor) => {
        editor.txt.html(txt)
    }

    const bindOnTxtChange = editor => {
        editor.config.onchange = html => {
            if (isGetText) {
                onChange(editor.txt.text())
            } else {
                onChange(html)
            }
        }
    }

    const init = () => {
        const editor = new WangeEditor(ref.current)
        editorRef.current = editor
        editor.config.colors = colors
        bindOnTxtChange(editor)
        create(editor)
        setTxt(defaultValue, editor)
    }

    useOnMount(() => init())

    useOnUnMount(() => {
        onSave(editorRef.current.txt.text())
    })

    return <div className={classname(styles.wangeEditor, className)} ref={ref}></div>
}

export default Editor
