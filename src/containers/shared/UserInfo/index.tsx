import * as React from 'react'
import { Modal, Input, Avatar, Radio, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { getToken } from '@services/api/qiniu'
import { edit as editAccount } from '@services/api/account'
import { QN_UPLOAD_URL, QN_BUCKET, QN_SOURCE_URL, LOCALSTORAGE } from '@constant/index'
import { useRootStore, useOnMount } from '@utils/customHooks'
import message from '@components/AntdMessageExt'

import styles from './index.scss'

interface Props {
    close: () => void
}

const { TextArea } = Input

const UserInfo: React.FC<Props> = ({ close }: Props) => {
    const [info, setInfo] = React.useState<IUserInfoStore.IUserInfo>({})
    const [qnToken, setQnToken] = React.useState('')

    const { userInfoStore } = useRootStore()

    const onSubmit = async () => {
        try {
            await editAccount(info)
            const newInfo = { ...userInfoStore.userInfo, ...info }
            userInfoStore.setUserInfo(newInfo)
            localStorage.setItem(LOCALSTORAGE.USERINFO, JSON.stringify(newInfo))
            close()
            message.success('修改成功')
        } catch {
            message.error('修改失败')
        }
    }

    const beforeUpload = async () => {
        try {
            const token = await getToken({
                bucket: QN_BUCKET
            })
            setQnToken(token)
        } catch {}
    }

    const onChangeEmail = value => {
        setInfo({
            ...info,
            email: value
        })
    }

    const onChangeSex = value => {
        setInfo({
            ...info,
            sex: value
        })
    }

    const onChangeArea = value => {
        setInfo({
            ...info,
            area: value
        })
    }

    const onChangeSign = value => {
        setInfo({
            ...info,
            sign: value
        })
    }

    useOnMount(() => {
        setInfo(userInfoStore.userInfo)
    })

    return (
        <Modal className={styles.container} title="个人信息" visible={true} onOk={onSubmit} onCancel={close}>
            <div>
                <span>头像</span>
                <div className={styles.rightContainer}>
                    <Avatar src={info.avatar} />
                    <div className={styles.upload}>
                        <Upload
                            accept="image/*"
                            action={QN_UPLOAD_URL}
                            data={{
                                token: qnToken
                            }}
                            beforeUpload={() => beforeUpload()}
                            showUploadList={false}
                            onChange={fileInfo => {
                                if (fileInfo.file.status === 'done') {
                                    setInfo({
                                        ...info,
                                        avatar: `${QN_SOURCE_URL}/${fileInfo.file.response.hash}`
                                    })
                                }
                            }}
                        >
                            <Button>
                                <UploadOutlined /> 上传新头像
                            </Button>
                        </Upload>
                    </div>
                </div>
            </div>
            <div>
                <span>邮箱</span>
                <div className={styles.rightContainer}>
                    <Input type="email" value={info.email} onChange={e => onChangeEmail(e.target.value)} />
                </div>
            </div>
            <div>
                <span>昵称</span>
                <div className={styles.rightContainer}>
                    <Input value={info.nickname} />
                </div>
            </div>
            <div>
                <span>性别</span>
                <div className={styles.rightContainer}>
                    <Radio.Group value={info.sex} onChange={e => onChangeSex(e.target.value)}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </Radio.Group>
                </div>
            </div>
            <div>
                <span>地区</span>
                <Input value={info.area} onChange={e => onChangeArea(e.target.value)} />
            </div>
            <div>
                <span>签名</span>
                <TextArea value={info.sign} onChange={e => onChangeSign(e.target.value)} />
            </div>
        </Modal>
    )
}

export default UserInfo
