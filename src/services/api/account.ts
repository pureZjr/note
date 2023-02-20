import Http from '@utils/http'

const { post } = new Http()

// 登录
export const login = (data) => {
    return post('account-login', data)
}

// 登出
export const logout = () => {
    return post('account-logout', {})
}

// 注册
export const register = (data) => {
    return post('account-register', data)
}

// 编辑
export const edit = (data) => {
    return post('account-edit', data)
}
