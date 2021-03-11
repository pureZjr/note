import * as React from 'react'
import * as ReactDom from 'react-dom'
import { HashRouter, Router } from 'react-router-dom'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import 'mobx-react-lite/batchingForReactDom'
import 'antd/dist/antd.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import * as store from '@store/index'
import { RootProvider } from '@components/RootProvider'
import App from '@views/App'
import '../src/styles/app.scss'
import 'viewerjs/dist/viewer.min.css'

Sentry.init({
    dsn: 'https://1acbb6a203324896bdf6f136b10e8f6c@o547927.ingest.sentry.io/5670826',
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
})

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
