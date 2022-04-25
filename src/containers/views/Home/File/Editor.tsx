import * as React from 'react'
import WangeEditor from 'wangeditor'
import classname from 'classnames'
import { uploadFile } from '@utils/common'
import { useRootStore } from '@utils/customHooks'

import { useOnMount, useOnUnMount } from '@utils/customHooks'
import styles from './index.module.scss'

interface Props {
    className?: string
    defaultValue?: string
    onSave: (content: string) => void
    onChange: (txt: string) => void
}

const Editor: React.FC<Props> = ({ className, defaultValue, onSave, onChange }: Props) => {
    const ref = React.useRef(null)
    const editorRef = React.useRef(null)
    const { fileStore } = useRootStore()

    const create = (editor) => {
        editor.create()
    }

    const setTxt = (txt, editor) => {
        editor.txt.html(txt)
    }

    const bindOnTxtChange = (editor) => {
        editor.config.onchange = (html) => {
            onChange(html)
        }
    }

    const init = () => {
        const editor = new WangeEditor(ref.current)
        editorRef.current = editor
        console.log(editor)

        bindOnTxtChange(editor)
        create(editor)
        setTxt(defaultValue, editor)
        initUploadImg()
    }

    const initUploadImg = async () => {
        editorRef.current.config.customUploadImg = async ([file], insertImgFn) => {
            try {
                const res = await uploadFile(file, fileStore.currFileInfo.id)
                insertImgFn(res)
            } catch {}
        }
    }

    useOnMount(() => init())

    useOnUnMount(() => {
        onSave(editorRef.current.txt.html())
    })

    return <div className={classname(styles.wangeEditor, className)} ref={ref}></div>
}

export default Editor
