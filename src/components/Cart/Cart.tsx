import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styles from './Cart.module.scss';

type Props = RouteComponentProps

type State = {
    products: any[],
}

export class Cart extends React.Component<Props, State> {
    state = {
        products: []
    }

    render () {
        return (
            <div className={styles.Cart}>
                Cart
            </div>
        )
    }
}

export default withRouter(Cart)
