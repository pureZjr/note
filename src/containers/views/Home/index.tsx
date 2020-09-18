import * as React from 'react'
import { Layout } from 'antd'
import { observer } from 'mobx-react'

import Header from '@components/Header'
import FileAndFolder from './FileAndFolder'
import Article from './Article'
import Tabs from './Tabs'
import Btns from './Btns'
import { useRootStore, useOnMount } from '@utils/customHooks'
import CreateFolderAndFile from '@components/CreateFolderAndFile'
import RightClickMenus from '@components/RightClickMenus'
import { LOCALSTORAGE } from '@constant/index'

import * as styles from './index.scss'

const { Sider, Content } = Layout

const Home: React.FC = () => {
    const { routerStore, userInfoStore } = useRootStore()

    function checkLocalUserInfo() {
        const userInfo = localStorage.getItem(LOCALSTORAGE.USERINFO)
        if (!!userInfo) {
            userInfoStore.setUserInfo(JSON.parse(userInfo))
        } else {
            routerStore.history.replace('/login')
        }
    }

    useOnMount(checkLocalUserInfo)

    return (
        <Layout className={styles.container}>
            <Header />
            <Layout className={styles.layout}>
                <Sider width={250} className={styles.sider}>
                    <Btns />
                    <Tabs />
                </Sider>
                <FileAndFolder />
                <Content className={styles.content}>
                    <Article />
                </Content>
            </Layout>
            <CreateFolderAndFile />
            <RightClickMenus />
        </Layout>
    )
}

export default observer(Home)
