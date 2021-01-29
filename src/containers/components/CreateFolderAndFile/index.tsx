import * as React from 'react'
import { Modal, Input } from 'antd'
import { observer } from 'mobx-react'

import message from '@components/AntdMessageExt'
import { createFile } from '@services/api/file'
import { createFolder } from '@services/api/folder'
import { useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import styles from './index.scss'

const CreateFolderAndFile: React.FC = () => {
    const [name, setName] = React.useState('')
    const [loading, setLoading] = React.useState(false)

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
            expandTreeKeys,
            currFolderInfo,
            setExpandTreeKeys,
            getTreeData,
            setCurrFolderInfo,
            setFolder
        } = folderStore
        const { setCurrFileInfo, insertFile, setFiles } = fileStore

        const { currTabId } = extraStore
        const fid = currFolderInfo.id || currTabId
        try {
            setLoading(true)
            if (extraStore.createFileFolderType === CreateType.Folder) {
                const { doc } = await createFolder({ title: name, id: fid, key: currFolderInfo.key || '2' })
                setCurrFolderInfo({ ...doc })
                if (!expandTreeKeys.includes(currFolderInfo.key)) {
                    setExpandTreeKeys(currFolderInfo.key)
                }
                getTreeData()
                setFiles([])
                setFolder([])
                setCurrFileInfo(null)
            } else {
                const res = await createFile({
                    title: name,
                    type: extraStore.createFileFolderType,
                    content: '',
                    parentId: fid
                })
                insertFile(res)
                setCurrFileInfo(null)
                setCurrFileInfo(res)
            }
        } catch {}
        setLoading(false)
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
            okButtonProps={{
                loading
            }}
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
