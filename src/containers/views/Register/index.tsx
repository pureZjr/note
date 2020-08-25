import * as React from 'react'
import { Form, Input, Button } from 'antd'

import * as styles from './index.scss'
import { useRootStore } from '@utils/customHooks'
import { register } from '@services/api/account'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
}
const itemStyle = { width: 300 }

const Register: React.FC = () => {
    const [registerLoading, setRegisterLoading] = React.useState(false)

    const { routerStore } = useRootStore()

    const onFinish = async values => {
        setRegisterLoading(true)
        try {
            await register(values)
            routerStore.history.push('/login')
        } catch (err) {
            console.log(err)
        }
        setRegisterLoading(false)
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    return (
        <Form
            className={styles.container}
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                style={itemStyle}
                label="用户名"
                name="username"
                rules={[{ required: true, message: '用户名不能为空!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                style={itemStyle}
                label="邮箱"
                name="email"
                rules={[{ required: true, message: '邮箱不能为空!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                style={itemStyle}
                label="密码"
                name="password"
                rules={[{ required: true, message: '密码不能为空!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item style={itemStyle} {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={registerLoading} onClick={onFinish}>
                    注册
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Register
