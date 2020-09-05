import * as React from 'react'
import { Avatar, Input, Menu, Dropdown } from 'antd'
import { CloseCircleOutlined, CaretDownOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'

import { logout } from '@services/api/account'
import { useRootStore } from '@utils/customHooks'
import * as styles from './index.scss'
import { Tabs } from '@store/extraStore'

const { Search } = Input

const Header: React.FC = () => {
    const [kw, setKw] = React.useState('')

    const { routerStore, extraStore, folderStore } = useRootStore()

    const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKw(event.target.value)
    }

    const onHandleLogout = async () => {
        await logout()
        localStorage.removeItem('token')
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

    const reset = () => {
        setKw('')
        extraStore.setIsSearching(false)
        handleSearch('')
    }

    React.useEffect(() => {
        setKw('')
        extraStore.setIsSearching(false)
    }, [extraStore.currTabId, folderStore.currSelectedFolderKey])

    const menu = (
        <Menu>
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
            <div className={styles['right-container']}>
                <Search
                    className={styles.search}
                    placeholder="输入关键字搜索"
                    onChange={onHandleChange}
                    value={kw}
                    onSearch={handleSearch}
                    suffix={
                        <CloseCircleOutlined
                            style={{
                                marginRight: 4,
                                color: 'rgba(0, 0, 0, 0.45)',
                                display: Boolean(kw.length) ? 'inline' : 'none'
                            }}
                            onClick={reset}
                        />
                    }
                />
                <Avatar
                    shape="square"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    size={46}
                    icon={<img src={require('@assets/img/joker.jpeg')} width={24} height={24} />}
                />
                <Dropdown overlay={menu}>
                    <CaretDownOutlined
                        style={{
                            marginLeft: 8
                        }}
                        color={'#000'}
                    />
                </Dropdown>
            </div>
        </div>
    )
}

export default observer(Header)
