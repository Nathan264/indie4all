import React from 'react';
import Link from 'next/link'
import styles from '../css/sidebar.module.css';

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sbBtn}>Categorias</div>
            <div className={styles.sbContent}>
                <ul className={styles.sbList}>
                    <li><Link href={`/search/`}>Ação</Link></li><hr/>
                    <li><Link href={`/search/`}>Aventura</Link></li><hr/>
                    <li><Link href={`/search/`}>RPG</Link></li><hr/>
                    <li><Link href={`/search/`}>Simulação</Link></li><hr/>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;