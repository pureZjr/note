import * as React from 'react'
import { Avatar, Input, Menu, Dropdown } from 'antd'
import { CloseCircleOutlined, CaretDownOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { debounce } from 'lodash'

import { logout } from '@services/api/account'
import { useRootStore } from '@utils/customHooks'
import styles from './index.module.scss'
import { Tabs } from '@store/extraStore'
import UserInfo from '@shared/UserInfo'
import { LOCALSTORAGE } from '@constant/index'
import Icon from '@components/Icon'
import PageLoading from '@components/PageLoading'

const { Search } = Input

const Header: React.FC = () => {
    const [loading, setLoading] = React.useState(false)

    const { routerStore, extraStore, folderStore, userInfoStore } = useRootStore()

    const { userInfoVisible, setUserInfoVisible, userInfo } = userInfoStore

    const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        extraStore.setKeyword(event.target.value)
        autoSearch(event.target.value)
    }

    const autoSearch = React.useCallback(val => debounceWrapper(val), [])
    const debounceWrapper = debounce(val => handleSearch(val), 1000)

    const onHandleLogout = async () => {
        setLoading(true)
        await logout()
        setLoading(false)
        localStorage.removeItem(LOCALSTORAGE.USERINFO)
        routerStore.history.push('/login')
    }

    const handleSearch = (val: string) => {
        const { currTabId, searchFolderAndFile, setIsSearching } = extraStore
        const { currFolderInfo } = folderStore
        const data = {
            keyword: val,
            type: currTabId
        }
        if (currTabId === Tabs.MyFolder) {
            Object.assign(data, {
                key: currFolderInfo.key
            })
        }
        searchFolderAndFile(data)
        setIsSearching(true)
    }

    const clearSearch = () => {
        const { setKeyword, setIsSearching } = extraStore
        setKeyword('')
        setIsSearching(false)
    }

    const reset = () => {
        clearSearch()
        handleSearch('')
    }

    React.useEffect(() => {
        clearSearch()
    }, [extraStore.currTabId])

    const menu = (
        <Menu>
            <Menu.Item>
                <span onClick={() => setUserInfoVisible(true)}>个人信息</span>
            </Menu.Item>
            <Menu.Item>
                <span onClick={onHandleLogout}>登出</span>
            </Menu.Item>
        </Menu>
    )

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <Icon type="iconlogo" width={32} height={32} />
                码农笔记
            </div>
            <div className={styles.rightContainer}>
                <Search
                    className={styles.search}
                    placeholder="输入关键字搜索"
                    onChange={onHandleChange}
                    value={extraStore.keyword}
                    onSearch={handleSearch}
                    suffix={
                        <CloseCircleOutlined
                            style={{
                                marginRight: 4,
                                color: 'rgba(0, 0, 0, 0.45)',
                                display: Boolean(extraStore.keyword.length) ? 'inline' : 'none'
                            }}
                            onClick={reset}
                        />
                    }
                />
            </div>
            <Dropdown overlay={menu}>
                <div className={styles.avatarContainer}>
                    <Avatar
                        shape="square"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4,
                            marginRight: 4
                        }}
                        size={38}
                        icon={<img src={userInfo.avatar} width={24} height={24} />}
                    />
                    <CaretDownOutlined
                        style={{
                            cursor: 'pointer',
                            color: '#fff'
                        }}
                    />
                </div>
            </Dropdown>
            {userInfoVisible && <UserInfo close={() => setUserInfoVisible(false)} />}
            {loading && <PageLoading hasMask />}
        </div>
    )
}

export default observer(Header)
