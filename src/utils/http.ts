import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
import { isNil } from 'lodash'
import { routerStore } from '@store/index'

import config from '@config/index'
console.log(config)
type HttpMethods = 'GET' | 'POST'

const baseUrl = config.baseUrl

export default class Http {
    get = (url: string, data: Record<string, any>): Promise<any> => {
        return this.HandleHttp('GET', url, data)
    }
    post = (url: string, data: {}): Promise<any> => {
        return this.HandleHttp('POST', url, data)
    }

    HandleHttp = async (method: HttpMethods, u: string, data: Record<string, any>) => {
        return new Promise(async (resolve, reject) => {
            let url = baseUrl + u
            const reqData = { ...data }
            if (method === 'GET') {
                console.log(baseUrl, u, reqData)
                url = `${baseUrl}${u}?${qs.stringify(reqData)}`
            }
            try {
                const token = localStorage.getItem('token')
                const headers = {}
                if (!!token) {
                    Object.assign(headers, {
                        token: token
                    })
                }

                const res = await axios.request({
                    headers,
                    url,
                    method,
                    data: reqData
                })
                switch (res.status) {
                    case 200:
                        if (res.data.status === 'ok' && !res.data.logout) {
                            resolve(isNil(res.data.data) ? res.data.text : res.data.data)
                        } else if (res.data.status === 'error') {
                            message.error(res.data.text)
                            reject()
                        } else {
                            reject()
                            message.error(res.data.text)
                        }
                        if (res.data.logout) {
                            localStorage.removeItem('token')
                            return routerStore.history.push('/login')
                        }
                        break
                    default:
                        reject()
                        message.error(res.data.text)
                }
            } catch (err) {
                reject(new Error('请求出错'))
            }
        })
    }
}
