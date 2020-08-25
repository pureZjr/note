import * as React from 'react'
import { Form, Input, Button } from 'antd'

import { login } from '@services/api/account'
import { useRootStore } from '@utils/customHooks'
import * as styles from './index.scss'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
}
const itemStyle = { width: 300 }

const Login: React.FC = () => {
    const [submitLoading, setSubmitLoading] = React.useState(false)

    const { routerStore } = useRootStore()

    const onFinish = async values => {
        setSubmitLoading(true)
        try {
            const res = await login(values)
            localStorage.setItem('token', res.token)
            routerStore.history.push('/')
        } catch (err) {
            console.log(err)
        }
        setSubmitLoading(false)
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    const handleRegister = () => {
        routerStore.history.push('/register')
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
            <Form.Item style={{ ...itemStyle }} {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={submitLoading}>
                    提交
                </Button>
                <Button style={{ float: 'right' }} type="primary" htmlType="button" onClick={handleRegister}>
                    注册
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Login
