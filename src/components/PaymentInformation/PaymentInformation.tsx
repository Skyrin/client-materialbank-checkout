import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './PaymentInformation.module.scss';

type Props = RouteComponentProps

type State = {
    paymentInfo: any
}

export class PaymentInformation extends React.Component<Props, State> {
    state = {
        paymentInfo: {}
    }

    render() {
        return (
            <div className={styles.PaymentInformation}>
                Payment Info
            </div>
        )
    }
}

export default withRouter(PaymentInformation)
