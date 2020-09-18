import { observable, action } from 'mobx'

/**
 * 用户信息store
 *
 * @export
 * @class UserInfoStore
 */

export class UserInfoStore {
    @observable
    userInfo: IUserInfoStore.IUserInfo = {}
    @action
    setUserInfo = (info: IUserInfoStore.IUserInfo) => {
        this.userInfo = info
    }

    @observable
    userInfoVisible = false
    @action
    setUserInfoVisible = (boo: boolean) => {
        this.userInfoVisible = boo
    }
}

export default new UserInfoStore()
