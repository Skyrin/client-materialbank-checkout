import * as React from 'react'
import App from 'components/App/App'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory();

export default function Root() {
    return (
        <Router history={history}>
            <App />
        </Router>
    )
}
