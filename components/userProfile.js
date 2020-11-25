import React, { useState, useEffect } from 'react';
import styles from '../css/userProfile.module.css';
import api from '../services/api';

function UserProfile() {
    const [user, setUser] = useState({
        email: '',
        username: '',
        moderator: '',
        birthDate: '',
        password: '',
        confirmPwd: '',
        userImage: 'default.png'
    });  

    const callApi = async () => {
        if(!process.browser) {
            return
        }
        await api.get('/getUserInfo', {
            params: {
                username: JSON.parse(localStorage.userInfoIndie4All).username
            }
        }).then(response => {
            response.data.birthDate = response.data.birthDate !== undefined?  response.data.birthDate.slice(0, 10): '';
            setUser({...user, ...response.data});
        });
    }

    const handleChangeUser = (event, field) => {
        setUser({...user, [field]: event.target.value});
    }

    const handleImgUser = async (event) => {
        const imgBox = document.getElementById('img-box');
        const imgUser = document.getElementById('userImg');
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            imgBox.src = reader.result
            imgUser.src = reader.result
        }
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('avatar', file);
        formData.append('username', user.username);
        await api.put('/altUserImg', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const storage = JSON.parse(localStorage.userInfoIndie4All);
            storage.userImage = `${response.data.userImage}`;
            localStorage.userInfoIndie4All = JSON.stringify(storage);
            console.log(localStorage.userInfoIndie4All)
        });
    }

    const altInfoUser = async (field) => {
        const data = {};
        data.username = JSON.parse(localStorage.userInfoIndie4All).username;
        if(field === 'newPassword') {
            if(user.password === user.confirmPwd) {
                data.newPassword = user.password;
            }else {
                alert('As senhas informadas não conferem');
                return
            }
        }else if(field === 'newUsername') {
            data.newUsername = user.username;
        }
        await api.put('/altUserInfo', data).then(response => {
            alert(response.data.message);
            const userData = JSON.parse(localStorage.userInfoIndie4All);
            userData.username = user.username;
            localStorage.userInfoIndie4All = JSON.stringify(userData); 
            console.log(JSON.parse(localStorage.userInfoIndie4All))
        });
    }

    useEffect(() => {
        callApi();
    }, []);

    return (
        <div className={styles.profile}>
            <img id='img-box' src={`${api.defaults.baseURL}/static/images/${user.userImage}`}/>
            <label htmlFor='img-user'><img src='/images/change.png' /></label>
            <input 
                type='file' 
                name='userImage' 
                id='img-user' 
                accept='image/jpg,png'
                onChange={e => {
                    handleImgUser(e);
                } 
            }
            />
            
            <input 
                type='text' 
                name='username' 
                placeholder='Username' 
                value={user.username} 
                onChange={e => handleChangeUser(e, 'username')}
                required
            />
            <input 
                type='email' 
                name='email' 
                placeholder='Email' 
                value={user.email} 
                disabled
            />
            <input 
                type='date' 
                name='birthDate' 
                value={user.birthDate} 
                disabled
            />
            <button onClick={e => altInfoUser('newUsername')}>Atualizar informações</button>

            <input 
                type='password' 
                name='password' 
                placeholder='Senha' 
                value={user.password} 
                onChange={e => handleChangeUser(e, 'password')}
                required
            />
            <input 
                type='password' 
                name='confirmPwd' 
                placeholder='Confirme a senha' 
                value={user.confirmPwd} 
                onChange={e => handleChangeUser(e, 'confirmPwd')}
                required
            />
            <button onClick={e => altInfoUser('newPassword')}>Atualizar Senha</button>
        </div>
    )
}

export default UserProfile;