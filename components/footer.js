import React from 'react';
import styles from '../css/footer.module.css';

function Footer() {
    return (
        <div className={styles.footer}>
            <img src='/images/logo2.png' id='logo' className={styles.logo}/>
            <p htmlFor='logo'>2020 4Eyes</p>            
        </div>
    )
}

export default Footer;