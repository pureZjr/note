import Http from '@utils/http'

const { get } = new Http()

// 获取七牛token
export const getToken = (data) => {
    return get('qiniu-token', data)
}
