import * as React from 'react'
import WangeEditor from 'wangeditor'
import classname from 'classnames'
import { getToken } from '@services/api/qiniu'
import { QN_BUCKET } from '@constant/index'

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
        const token = await getToken({
            bucket: QN_BUCKET,
        })
        editorRef.current.config.uploadImgServer = 'https://upload-z2.qiniup.com'
        editorRef.current.config.uploadImgParams = {
            token,
            key: 123123213,
        }
        console.log(editorRef.current)
        editorRef.current.config.uploadImgHooks = {
            before: async (args) => {
                console.log(args)
            },
            success: () => {},
        }
    }

    useOnMount(() => init())

    useOnUnMount(() => {
        onSave(editorRef.current.txt.html())
    })

    return <div className={classname(styles.wangeEditor, className)} ref={ref}></div>
}

export default Editor
