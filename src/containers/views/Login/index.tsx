import * as React from 'react'
import { Form, Input, Button } from 'antd'
import qs from 'qs'

import { login } from '@services/api/account'
import { useRootStore, useOnMount } from '@utils/customHooks'
import { LOCALSTORAGE } from '@constant/index'
import styles from './index.scss'

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

    const formRef = React.useRef(null)

    const { routerStore, userInfoStore } = useRootStore()

    const onFinish = async values => {
        setSubmitLoading(true)
        try {
            const res = await login(values)
            localStorage.setItem(LOCALSTORAGE.USERINFO, JSON.stringify(res))
            userInfoStore.setUserInfo(res)
            routerStore.history.push('/')
        } catch (err) {
            console.log(err)
            setSubmitLoading(false)
        }
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    const handleRegister = () => {
        routerStore.history.push('/register')
    }

    useOnMount(() => {
        const loginParam = qs.parse(routerStore.location.search.replace(/\?/, ''))
        formRef.current.setFieldsValue({
            remember: true,
            email: loginParam.email || '',
            password: loginParam.password || ''
        })
        if (localStorage.getItem(LOCALSTORAGE.USERINFO)) {
            routerStore.history.push('/')
        }
    })

    return (
        <Form
            className={styles.container}
            {...layout}
            name="basic"
            ref={formRef}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <div className={styles.bg} style={{ backgroundImage: `url(${require('@assets/img/login-banner.jpg')})` }} />
            <div className={styles.inputContainer}>
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
                <Form.Item style={{ ...itemStyle, marginTop: 8 }} {...tailLayout}>
                    <Button type="primary" htmlType="submit" loading={submitLoading}>
                        提交
                    </Button>
                    <Button style={{ float: 'right' }} type="primary" htmlType="button" onClick={handleRegister}>
                        注册
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}

export default Login
