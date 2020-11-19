import * as React from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.Footer}>
            <a href='/' className={styles.link}>Refund Policy</a>
            <a href='/' className={styles.link}>Privacy Policy</a>
            <a href='/' className={styles.link}>Terms of Service</a>
        </footer>
    )
}
