import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'

import { useRootStore, useOnMount } from '@utils/customHooks'
import { LOCALSTORAGE } from '@constant/index'
import PageLoading from '@components/PageLoading'
import styles from './index.module.scss'

const Home = lazy(() => import('@views/Home'))
const Login = lazy(() => import('@views/Login'))
const NotFound = lazy(() => import('@views/NotFound'))
const ShareArticle = lazy(() => import('@views/ShareArticle'))

function App() {
    const { routerStore, userInfoStore } = useRootStore()
    function checkLocalUserInfo() {
        const userInfo = localStorage.getItem(LOCALSTORAGE.USERINFO)
        if (!!userInfo) {
            userInfoStore.setUserInfo(JSON.parse(userInfo))
        } else if (!location.href.includes('share-article')) {
            routerStore.history.replace('/login')
        }
    }

    useOnMount(checkLocalUserInfo)

    return (
        <div className={styles.container}>
            <Suspense
                fallback={<PageLoading Icon={<img src={'https://src.renjianzahuopu.store/note/loading-pen.gif'} />} />}
            >
                <Switch>
                    <Route path="/login" exact={true}>
                        <Login />
                    </Route>
                    <Route path="/share-article">
                        <ShareArticle />
                    </Route>
                    <Route path="/" exact={true}>
                        <Home />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Suspense>
        </div>
    )
}

export default observer(App)
