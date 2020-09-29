import * as React from 'react'
import { Modal, Input } from 'antd'
import { observer } from 'mobx-react'

import message from '@components/AntdMessageExt'
import { createFile } from '@services/api/file'
import { createFolder } from '@services/api/folder'
import { useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import * as styles from './index.scss'

const CreateFolderAndFile: React.FC = () => {
    const [name, setName] = React.useState('')

    const { extraStore, folderStore, fileStore } = useRootStore()

    const modalTitle = React.useMemo(() => {
        const type = extraStore.createFileFolderType
        return type === CreateType.Folder ? '新建文件夹' : type === CreateType.Article ? '新建文章' : '新建MarkDown'
    }, [extraStore.createFileFolderType])

    const submit = async () => {
        if (!name) {
            return message.error('名称不能为空')
        }
        const {
            currSelectedFolderId,
            expandTreeKeys,
            currSelectedFolderKey,
            setExpandTreeKeys,
            getTreeData,
            setCurrSelectedFolderKey,
            setFolder
        } = folderStore
        const { setCurrFileId, insertFile, setFiles, setFileContent } = fileStore

        const { currTabId } = extraStore
        const fid = currSelectedFolderId || currTabId
        try {
            if (extraStore.createFileFolderType === CreateType.Folder) {
                const { key } = await createFolder({ title: name, id: fid, key: currSelectedFolderKey || '2' })
                setCurrSelectedFolderKey(key)
                if (!expandTreeKeys.includes(currSelectedFolderKey)) {
                    setExpandTreeKeys(currSelectedFolderKey)
                }
                getTreeData()
                setFiles([])
                setFolder([])
                setCurrFileId(null)
                setFileContent('')
            } else {
                const res = await createFile({
                    title: name,
                    type: extraStore.createFileFolderType,
                    content: '',
                    parentId: fid
                })
                insertFile(res)
                setCurrFileId(res.id)
            }
        } catch {}
        close()
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const close = () => {
        setName('')
        extraStore.setCreateFileFolderDialogvisible(false)
    }

    return (
        <Modal
            title={modalTitle}
            visible={extraStore.createFileFolderDialogvisible}
            okText={'确定'}
            cancelText={'取消'}
            onOk={submit}
            onCancel={close}
            destroyOnClose
        >
            <div className={styles.folderName}>
                <span style={{ display: 'inline-block', width: 60 }}>名称：</span>
                <Input value={name} onChange={onChange} autoFocus onPressEnter={submit} />
            </div>
        </Modal>
    )
}

export default observer(CreateFolderAndFile)
