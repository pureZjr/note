import { UserInfoStore as UserInfoStoreModel } from './index'

export as namespace IUserInfoStore

export interface UserInfoStore extends UserInfoStoreModel {}

interface IUserInfo {
    avatar?: string
    email?: string
    username?: string
    sex?: 0 | 1
    area?: string
    sign?: string
    token?: string
}
