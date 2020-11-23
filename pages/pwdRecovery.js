import React, {useState, useEffect} from 'react';
import styles from '../css/pwdRecovery.module.css';
import api from '../services/api';

function PwdRecovery() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [token, setToken] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [readyForChange, setReadyForChange] = useState(false);

    const requestPwdChange = async () => {
        await api.post('/requestpwdChange', {
            email,
            username
        }).then(response => {
            alert(response.data.message);
            alert(response.data.mailUrl);
        });
    }

    const changePwd = async () => {
        if(pwd !== confirmPwd) {
            alert('As senhas não conferem');
            return
        }
        await api.put('/changePwd', {
            token,
            email,
            username,
            pwd
        }).then(response => {
            alert(response.data.message);
            window.location = '/';
        });       
    }

    useEffect(()=> {
        if(process.browser && window.location.href.search('token') !== -1) {
            const urlParams = new URLSearchParams(window.location.search);
            setReadyForChange(true);
            setToken(urlParams.get('token'));
            setEmail(urlParams.get('email'));
            setUsername(urlParams.get('username'));
        }
    }, []);


    return (
        <div className={styles.main}>
            <fieldset>
                {
                    readyForChange? 
                        <>
                            <legend>Troca de senha</legend>
                            <form>
                                <input
                                    type='password' 
                                    name='pwd' 
                                    placeholder='Senha'
                                    value={pwd}
                                    onChange={e => setPwd(e.target.value)}
                                />
                                <input 
                                    type='password' 
                                    name='confirmPwd' 
                                    placeholder='Confirmar senha' 
                                    value={confirmPwd}
                                    onChange={e => setConfirmPwd(e.target.value)}
                                />
                                <button onClick={e => {
                                    e.preventDefault();
                                    changePwd();
                                }}>Trocar</button>
                            </form>
                            
                        </>
                    : 
                        <>
                            <legend>Recuperação de senha</legend>
                            <form>
                                <input
                                    type='text' 
                                    name='email' 
                                    placeholder='Email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <input 
                                    type='text' 
                                    name='username' 
                                    placeholder='Username' 
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                                <button onClick={e => {
                                    e.preventDefault();
                                    requestPwdChange();
                                }}>Solicitar</button>
                            </form>
                        </>
                }
            </fieldset>
        </div>
    )
}

export default PwdRecovery