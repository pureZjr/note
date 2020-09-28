import * as React from 'react'
import { Dropdown, Menu, Upload } from 'antd'
import { PlusCircleOutlined, CloudUploadOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { RcFile } from 'antd/lib/upload/index'

import { useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import { Tabs } from '@store/extraStore'
import { QN_UPLOAD_URL, QN_BUCKET, FILE_SIZE_LIMIT, QN_SOURCE_URL } from '@constant/index'
import message from '@components/AntdMessageExt'
import { getToken } from '@services/api/qiniu'
import { create } from '@services/api/file'
import * as styles from './index.scss'

const Btns: React.FC = () => {
    const [qnToken, setQnToken] = React.useState('')

    const { extraStore, folderStore } = useRootStore()

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
        try {
            if (file.size > FILE_SIZE_LIMIT) {
                message.error('文件不能超过50M')
                return Promise.reject(false)
            }
            const token = await getToken({
                bucket: QN_BUCKET
            })
            setQnToken(token)
        } catch {}
    }

    const onSuccessUpload = async ({ title, type, content }) => {
        try {
            await create({
                title,
                type: type,
                content,
                parentId: folderStore.currSelectedFolderId
            })
            message.success('上传成功')
        } catch {}
    }

    // 最新文档、回收站没有新建功能
    const disabled = [Tabs.NewDoc, Tabs.Recycle].includes(extraStore.currTabId)

    return (
        <div className={styles.container}>
            <Dropdown overlay={menu()} disabled={disabled}>
                <div className={classnames(styles.btn, disabled && styles.disabled)}>
                    <PlusCircleOutlined
                        width={14}
                        height={14}
                        style={{ color: disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgb(25, 144, 255)' }}
                    />
                    <span className={styles.add}>新增</span>
                </div>
            </Dropdown>
            <Upload
                accept="image/*,video/*"
                disabled={disabled}
                action={QN_UPLOAD_URL}
                data={{
                    token: qnToken
                }}
                beforeUpload={beforeUpload}
                showUploadList={false}
                onChange={fileInfo => {
                    if (fileInfo.file.status === 'done') {
                        onSuccessUpload({
                            title: fileInfo.file.name,
                            type: fileInfo.file.type.includes('image') ? 'image' : 'video',
                            content: `${QN_SOURCE_URL}/${fileInfo.file.response.hash}`
                        })
                    }
                }}
            >
                <div className={classnames(styles.btn, disabled && styles.disabled)}>
                    <div className={styles.upload}>
                        <CloudUploadOutlined style={{ color: disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgb(25, 144, 255)' }} />{' '}
                        上传
                    </div>
                </div>
            </Upload>
        </div>
    )
}

export default observer(Btns)
