import * as React from 'react'
import { Modal, Input, Avatar, Radio, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { getToken } from '@services/api/qiniu'
import { edit as editAccount } from '@services/api/account'
import { QN_UPLOAD_URL, QN_BUCKET, QN_SOURCE_URL, LOCALSTORAGE } from '@constant/index'
import { useRootStore, useOnMount } from '@utils/customHooks'
import message from '@components/AntdMessageExt'

import styles from './index.module.scss'

interface Props {
    close: () => void
}

const { TextArea } = Input

const UserInfo: React.FC<Props> = ({ close }: Props) => {
    const [info, setInfo] = React.useState<IUserInfoStore.IUserInfo>({})
    const [qnToken, setQnToken] = React.useState('')
    const [uploading, setUploading] = React.useState(false)
    const [loading, setloading] = React.useState(false)

    const { userInfoStore } = useRootStore()

    const onSubmit = async () => {
        try {
            setloading(true)
            await editAccount(info)
            const newInfo = { ...userInfoStore.userInfo, ...info }
            userInfoStore.setUserInfo(newInfo)
            localStorage.setItem(LOCALSTORAGE.USERINFO, JSON.stringify(newInfo))
            close()
            message.success('修改成功')
        } catch {
            message.error('修改失败')
        }
        setloading(false)
    }

    const beforeUpload = async () => {
        try {
            setUploading(true)
            const token = await getToken({
                bucket: QN_BUCKET,
            })
            setQnToken(token)
        } catch {}
        setUploading(false)
    }

    const onHandleChange = (prop) => {
        setInfo({
            ...info,
            ...prop,
        })
    }

    useOnMount(() => {
        setInfo(userInfoStore.userInfo)
    })

    return (
        <Modal
            width={300}
            title="个人信息"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
                loading,
            }}
            visible={true}
            onOk={onSubmit}
            onCancel={close}
        >
            <div className={styles.item}>
                <label>头像</label>
                <div className={styles.rightContainer}>
                    <Avatar src={info.avatar} className={styles.avatar} />
                    <div className={styles.upload}>
                        <Upload
                            accept="image/*"
                            action={QN_UPLOAD_URL}
                            data={{
                                token: qnToken,
                            }}
                            beforeUpload={() => beforeUpload()}
                            showUploadList={false}
                            onChange={(fileInfo) => {
                                if (fileInfo.file.status === 'done') {
                                    setInfo({
                                        ...info,
                                        avatar: `${QN_SOURCE_URL}/${fileInfo.file.response.hash}`,
                                    })
                                }
                            }}
                        >
                            <Button loading={uploading} size="small" style={{ fontSize: 12 }}>
                                <UploadOutlined /> 上传新头像
                            </Button>
                        </Upload>
                    </div>
                </div>
            </div>
            <div className={styles.item}>
                <label>邮箱</label>
                <div className={styles.rightContainer}>
                    <Input
                        size="small"
                        type="email"
                        value={info.email}
                        onChange={(e) => onHandleChange({ email: e.target.value })}
                    />
                </div>
            </div>
            <div className={styles.item}>
                <label>昵称</label>
                <div className={styles.rightContainer}>
                    <Input
                        size="small"
                        value={info.username}
                        onChange={(e) => onHandleChange({ username: e.target.value })}
                    />
                </div>
            </div>
            <div className={styles.item}>
                <label>性别</label>
                <div className={styles.rightContainer}>
                    <Radio.Group value={info.sex} onChange={(e) => onHandleChange({ sex: e.target.value })}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </Radio.Group>
                </div>
            </div>
            <div className={styles.item}>
                <label>地区</label>
                <Input size="small" value={info.area} onChange={(e) => onHandleChange({ area: e.target.value })} />
            </div>
            <div className={styles.item}>
                <label>签名</label>
                <TextArea value={info.sign} onChange={(e) => onHandleChange({ sign: e.target.value })} />
            </div>
        </Modal>
    )
}

export default UserInfo
