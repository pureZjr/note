import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'

import styles from './index.scss'

const Home = lazy(() => import('@views/Home'))
const Login = lazy(() => import('@views/Login'))
const Register = lazy(() => import('@views/Register'))
const NotFound = lazy(() => import('@views/NotFound'))
const ShareArticle = lazy(() => import('@views/ShareArticle'))

function App() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path="/login" exact={true}>
                        <Login />
                    </Route>
                    <Route path="/register" exact={true}>
                        <Register />
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
