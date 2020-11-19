import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './PersonalInformation.module.scss';

type Props = RouteComponentProps

type State = {
    personalInfo: any
}

export class PersonalInformation extends React.Component<Props, State> {
    state = {
        personalInfo: {}
    }

    render() {
        return (
            <div className={styles.PersonalInformation}>
                Payment Info
            </div>
        )
    }
}

export default withRouter(PersonalInformation)
