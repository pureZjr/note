import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'

import Home from '@views/Home'
import Login from '@views/Login'
import Register from '@views/Register'
import NotFound from '@views/NotFound'
import ShareArticle from '@views/ShareArticle'
import styles from './index.scss'

function App() {
    return (
        <div className={styles.container}>
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
        </div>
    )
}

export default observer(App)
