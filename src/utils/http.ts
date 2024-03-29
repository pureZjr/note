import axios from 'axios'
import qs from 'qs'
import { isNil } from 'lodash'
import { routerStore, userInfoStore } from '@store/index'

import config from '@config/index'
import message from '@components/AntdMessageExt'
import { LOCALSTORAGE } from '@constant/index'

type HttpMethods = 'GET' | 'POST'

const baseUrl = config.baseUrl

export default class Http {
    get = (url: string, data: Record<string, any>, noErrTips?: boolean): Promise<any> => {
        return this.HandleHttp('GET', url, data, noErrTips)
    }
    post = (url: string, data: Record<string, unknown>, noErrTips?: boolean): Promise<any> => {
        return this.HandleHttp('POST', url, data, noErrTips)
    }

    HandleHttp = async (method: HttpMethods, u: string, data: Record<string, any>, noErrTips?: boolean) => {
        return new Promise(async (resolve, reject) => {
            let url = baseUrl + u
            const reqData = { ...data }
            if (method === 'GET') {
                url = `${baseUrl}${u}?${qs.stringify(reqData)}`
            }
            try {
                const userInfo = localStorage.getItem(LOCALSTORAGE.USERINFO)

                const headers = {}
                if (!!userInfo) {
                    const { token } = JSON.parse(userInfo)
                    Object.assign(headers, {
                        token: token,
                    })
                }

                const res = await axios.request({
                    headers,
                    url,
                    method,
                    data: reqData,
                })
                switch (res.status) {
                    case 200:
                        if (res.data.status === 'ok' && !res.data.logout) {
                            resolve(isNil(res.data.data) ? res.data.text : res.data.data)
                        } else if (res.data.status === 'error') {
                            if (!noErrTips) {
                                message.error(res.data.text)
                            }
                            reject()
                        } else {
                            reject()
                            if (!noErrTips) {
                                message.error(res.data.text)
                            }
                        }
                        if (res.data.logout) {
                            localStorage.removeItem(LOCALSTORAGE.USERINFO)
                            userInfoStore.setUserInfo({})
                            if (!noErrTips) {
                                return routerStore.history.push('/login')
                            }
                        }
                        break
                    default:
                        reject()
                        if (!noErrTips) {
                            message.error(res.data.text)
                        }
                }
            } catch (err) {
                message.error('网络错误')
                reject(new Error('请求出错'))
            }
        })
    }
}
