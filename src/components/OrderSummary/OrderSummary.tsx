import * as React from 'react'
import styles from './OrderSummary.module.scss';

type Props = {}
type State = {
    personalInfo: any
}

export default class OrderSummary extends React.Component<Props, State> {
    state = {
        personalInfo: {}
    }

    render() {
        return (
            <div className={styles.OrderSummary}>
                Order Summary
            </div>
        )
    }
}
