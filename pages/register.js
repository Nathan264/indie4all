import React, { useState } from 'react';
import api from '../services/api';
import styles from '../css/register.module.css';

function Register() {
    const [ userData, setUserData ] = useState({
        username: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
    });

    const callApi = async () => {
        if(userData.password !== userData.confirmPassword){
            return alert('As senhas não conferem')
        }
        alert('Aguarde um momento');    
        await api.post('/register', userData).then(response => {
            alert(response.data.message);
            alert(response.data.mailUrl);
        });
    }

    const handleChange = (event, field) => {
        setUserData({...userData, [field]: event.target.value});
    }
    
    return (
        <div className={styles.divForm}>
            <fieldset>
                <legend>Cadastro</legend>
                <form>
                    <input 
                        type='text' 
                        name='username' 
                        value={userData.username} 
                        onChange={e => handleChange(e, 'username')}
                        placeholder='Username' 
                        required
                    />
                    <input 
                        type='email' 
                        name='email' 
                        value={userData.email} 
                        onChange={e => handleChange(e, 'email')}
                        placeholder='Email' 
                        required
                    />
                    <input 
                        type='date' 
                        name='birthday' 
                        value={userData.birthDate} 
                        onChange={e => handleChange(e, 'birthDate')}
                        required
                    />
                    <input 
                        type='password' 
                        name='pwd' 
                        placeholder='Senha' 
                        value={userData.password} 
                        onChange={e => handleChange(e, 'password')}
                        required
                    />
                    <input 
                        type='password' 
                        name='confirmPwd' 
                        placeholder='Confirme a senha' 
                        value={userData.confirmPassword} 
                        onChange={e => handleChange(e, 'confirmPassword')}
                        required
                    />
                    <input type='button' name='cad' value='Cadastrar' onClick={e => callApi()} />
                </form>
            </fieldset>
        </div>
    )
}

export default Register;