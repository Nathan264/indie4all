import React, {useState} from 'react';
import Link from 'next/link';
import api from '../services/api';
import styles from '../css/navbar.module.css';

function Navbar() {
    const [userInfo, setUserInfo] = useState(
        {
            userImage: '/images/sign-in-icon.png'
        }
    );
    
    process.browser && localStorage.userInfoIndie4All !== undefined? window.onload = () => {
        setUserInfo(JSON.parse(localStorage.userInfoIndie4All));
    }: false;

    process.browser? window.onunload = () => {
        localStorage.removeItem.userInfoIndie4All;
    }: false


    const handleLogin = async () => {
        if(!process.browser) {
            return
        }

        const password = document.getElementById('userpwd').value;
        const username = document.getElementById('username').value;
        await api.post('/login', { password, username }).then(response => {
            if(response.data.message) {
                alert(response.data.message);
                return
            }
            response.data.user.userImage = `http://localhost:3333/static/images/${response.data.user.userImage}`
            localStorage.setItem('tokenIndie4All', JSON.stringify(response.data.token));
            localStorage.setItem('userInfoIndie4All', JSON.stringify(response.data.user));
            setUserInfo(JSON.parse(localStorage.userInfoIndie4All));
        });
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.boxLogo}>
                <Link href='/'>
                    <img src='/images/logo2.png' className={styles.logo}/>
                </Link>
            </div>

            <div className={styles.boxSearch}>
                <form action='/search/'>
                    <input type='search' className={styles.inputSearch} name='game'/>
                </form>
            </div>

            <label htmlFor={styles.dpdBtn}>
                <input type='checkbox' id={styles.dpdBtn} />
                <div className={styles.boxUser}>
                    <img src={userInfo.userImage} id='userImg' className={styles.user}/>,
                    {
                        userInfo.username?

                        <div className={styles.dpdUser}>
                            <Link href={`/user`}><p>Perfil</p></Link>
                            <p onClick={e => {
                                setUserInfo({userImage: '/images/sign-in-icon.png'});
                                localStorage.clear();
                            }}>Sair</p>
                        </div>
                        :
                    
                        <div className={styles.formLogin}>
                            <form>
                                <input type='text' name='username' id='username' placeholder='Username' className={styles.inputLogin}/>
                                <input type='password' name='password' id='userpwd' placeholder='Password' className={styles.inputLogin}/>
                                <button 
                                    className={styles.btnLogin} 
                                    onClick={e => {
                                        e.preventDefault();
                                        handleLogin();
                                    }}
                                >Login</button>
                                <Link href='/register'>
                                    <p>Ainda não fez seu cadastro?</p>
                                </Link>
                                
                                <Link href='/pwdRecovery'>
                                    <p>Esqueceu a senha?</p>
                                </Link>
                            </form>
                        </div>
                    }
                    
                    
                </div>
            </label>

        </nav>
    )
}

export default Navbar;