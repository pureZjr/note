import * as React from 'react'
import * as ReactDom from 'react-dom'
import { HashRouter, Router } from 'react-router-dom'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import 'mobx-react-lite/batchingForReactDom'
import 'antd/dist/antd.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import * as store from '@store/index'
import { RootProvider } from '@components/RootProvider'
import App from '@views/App'
import '../src/styles/app.scss'
import 'viewerjs/dist/viewer.min.css'

const hashHistory = createHashHistory()
const history = syncHistoryWithStore(hashHistory, store.routerStore)

const render = () => {
    ReactDom.render(
        <HashRouter>
            <RootProvider>
                <Router history={history}>
                    <App />
                </Router>
            </RootProvider>
        </HashRouter>,
        document.querySelector('#app')
    )
}
render()
