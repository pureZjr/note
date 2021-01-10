import * as React from 'react'
import { Dropdown, Menu, Upload } from 'antd'
import { PlusCircleOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { RcFile } from 'antd/lib/upload/index'

import { useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import { FILE_SIZE_LIMIT } from '@constant/index'
import message from '@components/AntdMessageExt'
import { create } from '@services/api/file'
import PageLoading from '@components/PageLoading'
import SelectFolder from '@shared/SelectFolder'
import { uploadFile } from '@utils/common'
import styles from './index.scss'

const Btns: React.FC = () => {
    const [uploadLoading, setUploadLoading] = React.useState(false)
    const [currFile, setCurrFile] = React.useState<File>(null)
    const [showSelectFolder, setShowSelectFolder] = React.useState(false)

    const { extraStore, fileStore } = useRootStore()

    const menu = () => {
        const { setCreateFileFolderDialogvisible, setCreateFileFolderType } = extraStore

        const handleSelect = (type: IExtraStore.CreateType) => {
            setCreateFileFolderType(type)
            setCreateFileFolderDialogvisible(true)
        }

        return (
            <Menu>
                <Menu.Item
                    onClick={() => {
                        handleSelect(CreateType.Folder)
                    }}
                >
                    文件夹
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        handleSelect(CreateType.MarkDown)
                    }}
                >
                    MarkDown
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        handleSelect(CreateType.Article)
                    }}
                >
                    文章
                </Menu.Item>
            </Menu>
        )
    }

    const beforeUpload = async (file: RcFile) => {
        if (file.size > FILE_SIZE_LIMIT) {
            message.error('文件不能超过50M')
            return Promise.reject(false)
        }
        setShowSelectFolder(true)
        setCurrFile(file)
    }

    const onUpload = async (id: string) => {
        try {
            setUploadLoading(true)
            const url = await uploadFile(currFile)
            onSuccessUpload({
                title: currFile.name,
                size: currFile.size,
                type: currFile.type.includes('image') ? 'image' : 'video',
                content: url,
                folderId: id
            })
        } catch {
            setUploadLoading(false)
        }
    }

    const onSuccessUpload = async ({ title, type, content, size, folderId }) => {
        try {
            const res = await create({
                title,
                type: type,
                content,
                size,
                parentId: folderId
            })
            fileStore.insertFile(res)
            fileStore.setCurrFileInfo({ ...res, content })
            message.success('上传成功')
        } catch {}
        setUploadLoading(false)
    }

    return (
        <div className={styles.container}>
            <Dropdown overlay={menu()}>
                <div className={classnames(styles.btn)}>
                    <PlusCircleOutlined className={styles.icon} />
                    <span className={styles.label}>新增</span>
                </div>
            </Dropdown>
            <Upload accept="image/*,video/*" beforeUpload={beforeUpload} showUploadList={false}>
                <div className={classnames(styles.btn)}>
                    <CloudUploadOutlined className={styles.icon} />
                    <span className={styles.label}>上传</span>
                </div>
            </Upload>
            {uploadLoading && <PageLoading />}
            {showSelectFolder && (
                <SelectFolder
                    file={currFile}
                    defaultParentId={'2'}
                    defaultPath={'/'}
                    onSelectFolder={onUpload}
                    close={() => setShowSelectFolder(false)}
                />
            )}
        </div>
    )
}

export default observer(Btns)
