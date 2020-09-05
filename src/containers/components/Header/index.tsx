import * as React from 'react'
import { Avatar, Input, Menu, Dropdown } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'

import { logout } from '@services/api/account'
import { useRootStore } from '@utils/customHooks'
import IconZhou from '@assets/svgs/zhou.svg'
import IconYouDaoYun from '@assets/svgs/youdaoyun.svg'
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
        <div className={styles.container}>
            <Dropdown overlay={menu}>
                <Avatar
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    size={50}
                    icon={<IconZhou width={40} height={40} />}
                />
            </Dropdown>
            <div className={styles.title}>
                <div className={styles.box}>
                    <IconYouDaoYun color="#fff" width={12} height={12} />
                </div>
                幻象笔记
            </div>
            <Search
                className={styles.search}
                placeholder="搜索..."
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
        </div>
    )
}

export default observer(Header)
