import React, { useState, useEffect} from 'react';
import Link from 'next/link';
import api from '../services/api';
import styles from '../css/user.module.css'
import GameModal from '../components/gameModal';
import UserProfile from '../components/userProfile';

function User() {
    const emptyProps = {
        name: '',
        categories: '',
        sinopse: '',
        file: {},
        reqMin: {
            cpu: '',
            gpu: '',
            ram: '',
            so: '',
            storage: ''
        },
        reqRec: {
            cpu: '',
            gpu: '',
            ram: '',
            so: '',
            storage: ''
        },
        images: {}
    }

    const [userGames, setUserGames] = useState([]);
    const [isModerator, setIsModerator] = useState(false)
    const [gamesForInspection, setGamesForInspection] = useState([]);
    const [modalProps, setModalProps] = useState(emptyProps);

    const callApi = async () => {
        if(!process.browser) {
            return
        }
        setIsModerator(JSON.parse(localStorage.userInfoIndie4All).moderator);

        await api.get('/loadUserGames', { 
            params: {
                dev: JSON.parse(localStorage.userInfoIndie4All)._id
            }
        }).then(response => {
            setUserGames(response.data);
        });
        
        await api.get('/analyzeGames').then(response => {
            setGamesForInspection(response.data);
        });
    }

    useEffect(() => {
        callApi();
    }, []);

    const removeGame = async (id) => {
        await api.delete('/removeGame', {
            params: {
                id,
            }
        }).then(response => {
            alert(response.data.message);
        });
    }

    return (
        <div className={styles.main} id='main'>
            <div className={styles.menu}>
                <label htmlFor='option1'>Gerenciar Perfil</label>
                <label htmlFor='option2'>Meus Jogos</label>
                {
                    isModerator? <label htmlFor='option3'>Jogos em Análise</label>: false
                }
            </div>

            <input type='radio' name='menu' value='1' id='option1' defaultChecked/>
            <UserProfile />
            
            <input type='radio' name='menu' value='2' id='option2'/>
            <div className={styles.gamesManagement}>
                {
                    userGames.length>0? userGames.map((game, index) => {
                        return (
                            <div key={Math.random(1)}>
                                <img 
                                    className={styles.excludeButton}
                                    src='/images/excluir.png'
                                    onClick={e => {
                                        const confirmation = confirm('Deseja excluir esse jogo?');
                                        if(!confirmation) {
                                            return
                                        }
                                        const newArray = userGames.filter((item, i) => {
                                            return i !== index? item: null
                                        });
                                        setUserGames(newArray);
                                        removeGame(game._id);
                                    }}
                                />
                                <div className={styles.boxgame}  onClick={e => {
                                    setModalProps({...game, newGame: false})
                                    const modal = document.getElementById('modal');
                                    modal.style.height= '100%';
                                    modal.style.paddingTop = '100px';
                                }}>
                                    <img src={`${api.defaults.baseURL}/static/images/${game.images[0]}`}></img>
                                    <p>{game.name}</p>
                                </div>
                            </div>
                        )
                    }): false
                }
                <div className={`${styles.boxgame} ${styles.add}`} onClick={e=> {
                    setModalProps({newGame: true});
                    const modal = document.getElementById('modal');
                    modal.style.height= '100%';
                    modal.style.paddingTop = '100px'
                }}>
                    <img src='/images/add.ico' className={styles.addGame}></img>
                    <p>Adicionar Jogo</p>
                </div>
            </div>
            
            <input type='radio' name='menu' value='3' id='option3'/>
            <div className={styles.inspection}>
                {
                    gamesForInspection.length>0? gamesForInspection.map(item => {
                        return (
                            <Link href={`http://localhost:3000/games/?name=${item.name}`}  key={Math.random(1)}>
                                <div className={styles.boxgame}>
                                    <img src={`${api.defaults.baseURL}/static/images/${item.images[0]}`}></img>
                                    <p>{item.name}</p>
                                </div>
                            </Link>
                        )
                    }): false
                }
            </div>
            <GameModal {...modalProps}/>
        </div>
    )
}

export default User;