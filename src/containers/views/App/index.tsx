import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'

import PageLoading from '@components/PageLoading'
import styles from './index.module.scss'

const Home = lazy(() => import(/* webpackChunkName: "Home" */ '@views/Home'))
const Login = lazy(() => import(/* webpackChunkName: "Login" */ '@views/Login'))
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@views/NotFound'))
const ShareArticle = lazy(() => import(/* webpackChunkName: "ShareArticle" */ '@views/ShareArticle'))

function App() {
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
