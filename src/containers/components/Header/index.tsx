import * as React from 'react'
import { Avatar, Input, Menu, Dropdown } from 'antd'
import { CloseCircleOutlined, CaretDownOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { debounce } from 'lodash'

import { logout } from '@services/api/account'
import { useRootStore } from '@utils/customHooks'
import styles from './index.scss'
import { Tabs } from '@store/extraStore'
import UserInfo from '@shared/UserInfo'
import { LOCALSTORAGE } from '@constant/index'

const { Search } = Input

const Header: React.FC = () => {
    const { routerStore, extraStore, folderStore, userInfoStore } = useRootStore()

    const { userInfoVisible, setUserInfoVisible, userInfo } = userInfoStore

    const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        extraStore.setKeyword(event.target.value)
        autoSearch(event.target.value)
    }

    const autoSearch = React.useCallback(val => debounceWrapper(val), [])
    const debounceWrapper = debounce(val => handleSearch(val), 1000)

    const onHandleLogout = async () => {
        await logout()
        localStorage.removeItem(LOCALSTORAGE.USERINFO)
        routerStore.history.push('/login')
    }

    const handleSearch = (val: string) => {
        const { currTabId, searchFolderAndFile, setIsSearching } = extraStore
        const { currSelectedFolderKey } = folderStore
        const data = {
            keyword: val,
            type: currTabId
        }
        if (currTabId === Tabs.MyFolder) {
            Object.assign(data, {
                key: currSelectedFolderKey
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
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${require('@assets/img/header-bg.png')})`
            }}
        >
            <div className={styles.title}>
                <img src={require('@assets/img/illusion.jpg')} width={40} height={40} />
                幻象笔记
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
                <div className={styles.container}>
                    <Avatar
                        shape="square"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        size={46}
                        icon={<img src={userInfo.avatar} width={24} height={24} />}
                    />
                    <CaretDownOutlined />
                </div>
            </Dropdown>
            {userInfoVisible && <UserInfo close={() => setUserInfoVisible(false)} />}
        </div>
    )
}

export default observer(Header)
