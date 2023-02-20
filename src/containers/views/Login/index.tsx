import * as React from 'react'
import { Button } from 'antd'
import classnames from 'classnames'

import { login, register } from '@services/api/account'
import { useRootStore, useOnMount } from '@utils/customHooks'
import { LOCALSTORAGE } from '@constant/index'
import message from '@components/AntdMessageExt'
import styles from './index.scss'

const Login: React.FC = () => {
    const [loading, setLoading] = React.useState(false)
    const [handleLogin, setHandleLogin] = React.useState(true)
    const [bgImg, setBgImg] = React.useState('')

    const [formData, setFormData] = React.useState({
        email: '',
        username: '',
        password: '',
        insure: ''
    })

    const { routerStore, userInfoStore } = useRootStore()

    const onHandleChangeUsername = (val: string) => {
        setFormData({
            ...formData,
            username: val
        })
    }
    const onHandleChangeEmail = (val: string) => {
        setFormData({
            ...formData,
            email: val
        })
    }
    const onHandleChangePassword = (val: string) => {
        setFormData({
            ...formData,
            password: val
        })
    }
    const onHandleInsurePassword = (val: string) => {
        setFormData({
            ...formData,
            insure: val
        })
    }
    const submit = async () => {
        const reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
        if (!reg.test(formData.email)) {
            return message.warn('请确保邮箱正确')
        }
        if (handleLogin) {
            try {
                if (!formData.email || !formData.password) {
                    return message.warn('请确保输入完整')
                }
                setLoading(true)
                const res = await login({
                    email: formData.email,
                    password: formData.password
                })
                localStorage.setItem(LOCALSTORAGE.USERINFO, JSON.stringify(res))
                userInfoStore.setUserInfo(res)
                routerStore.history.push('/')
            } catch (err) {
                setLoading(false)
            }
        } else {
            if (!formData.email || !formData.password || !formData.username || !formData.insure) {
                return message.warn('请确保输入完整')
            }
            if (formData.password !== formData.insure) {
                return message.warn('两次密码不一致，请重新输入')
            }
            setLoading(true)
            try {
                await register(formData)
                tigger()
                message.success('注册成功，赶紧登录体验吧！')
            } catch {}
            setLoading(false)
        }
    }
    const tigger = () => {
        setHandleLogin(!handleLogin)
    }
    const loadBg = () => {
        const img = new Image()
        img.src = 'http://src.renjianzahuopu.store/note/bg.png'
        img.onload = () => {
            setBgImg(img.src)
        }
    }
    const onEnter = e => {
        if (e.keyCode === 13) {
            submit()
        }
    }

    useOnMount(() => {
        if (localStorage.getItem(LOCALSTORAGE.USERINFO)) {
            routerStore.history.push('/')
        } else {
            loadBg()
        }
    })
    return (
        <div className={classnames(styles.container, handleLogin ? styles.handleLogin : styles.handleRegister)}>
            <div
                className={styles.bgImgs}
                style={{
                    backgroundImage: `url(${bgImg})`
                }}
            >
                <img
                    src={'http://src.renjianzahuopu.store/note/bg-small.png'}
                    style={{
                        opacity: Number(!bgImg)
                    }}
                />
                <div className={styles.bgImgsMask} />
            </div>
            <div className={styles.wrapperMask} />
            <div className={styles.formWrapper}>
                <h1>{handleLogin ? '欢迎回来' : '立即注册'}</h1>
                <div className={styles.form}>
                    {!handleLogin && (
                        <div className={styles.item}>
                            <label>昵称</label>
                            <input
                                autoComplete="off"
                                value={formData.username}
                                onChange={e => onHandleChangeUsername(e.target.value)}
                            />
                        </div>
                    )}
                    <div className={styles.item}>
                        <label>邮箱</label>
                        <input
                            autoComplete="off"
                            value={formData.email}
                            onChange={e => onHandleChangeEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.item}>
                        <label>密码</label>
                        <input
                            type="password"
                            value={formData.password}
                            onKeyDown={handleLogin ? onEnter : null}
                            onChange={e => onHandleChangePassword(e.target.value)}
                        />
                    </div>
                    {!handleLogin && (
                        <div className={styles.item}>
                            <label>确认密码</label>
                            <input
                                type="password"
                                value={formData.insure}
                                onKeyDown={onEnter}
                                onChange={e => onHandleInsurePassword(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <Button type="primary" shape="round" loading={loading} className={styles.submit} onClick={submit}>
                    {handleLogin ? '登录' : '注册'}
                </Button>
            </div>
            <div className={styles.subCount}>
                <div className={styles.subCountWrap}>
                    <div className={styles.desc}>
                        <h2>{handleLogin ? '还没注册?' : '已有帐号？'}</h2>
                        <span>{handleLogin ? '立即注册体验一下吧！' : '有帐号就登录吧，好久不见了！'}</span>
                    </div>
                    <div className={styles.btn} onClick={tigger}>
                        <div className={handleLogin ? styles.loginBtn : styles.registerBtn}>
                            <div>注册</div>
                            <div>登录</div>
                        </div>
                    </div>
                    <img src={'http://src.renjianzahuopu.store/note/code-maker.gif'} width="900" height="550" />
                    <div className={styles.mask} />
                </div>
            </div>
        </div>
    )
}

export default Login
