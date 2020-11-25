import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from '../css/game.module.css';

function Games() {
    const [gameData, setGameData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModerator, setIsModerator] = useState(false);
    const [comment, setComment] = useState({
        text: '',
        rating: '',
        user: process.browser && localStorage.userInfoIndie4All? JSON.parse(localStorage.userInfoIndie4All)._id: ''
    });

    useEffect(() => {
        if(!process.browser) {
            return
        }
        const callApi = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get('name');
            const username = localStorage.userInfoIndie4All ?JSON.parse(localStorage.userInfoIndie4All).username: undefined;
            await api.get('/loadGame', {
                params: {
                    name,
                    username,
                },
            }).then(response => {
                if(response.data.message) {
                    alert(response.data.message);
                    window.location = '/'
                }
                response.data.images.map((item, index) => {
                    response.data.images[index] = `${api.defaults.baseURL}/static/images/${item}`;
                })
                response.data.rating = response.data.numberRt!==0? response.data.rating / response.data.numberRt: 0;
                setGameData(response.data);
                setIsLoading(false);
            });
            if(localStorage.userInfoIndie4All) {
                setIsModerator(JSON.parse(localStorage.userInfoIndie4All).moderator);
            }
        }
        callApi();
    }, []);

    const altGameStatus = async (modResponse) => {
        await api.put('/altGameStatus', {
            status: modResponse,
            name: gameData.name
        }).then(response => {
            if(response.data.nModified === 1) {
                alert('Jogo liberado com sucesso'); 
                window.location.href = '/';
            }
        });
    }

    const downloadGame = async () => {
        if(!process.browser) {
            return
        }
        await api.get(`/static/games/${gameData.archive}`, {
            responseType: 'blob'
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${gameData.name}.${gameData.archive.split('.')[1]}`);
            link.click();
        });
        await api.put('/addVisitOrDownload', {
            id: gameData._id,
            downloaded: true
        });
    }

    const makeComment = async () => {
        if(!process.browser) {
            return
        }
        await api.put('/comment', {
            name: gameData.name,
            comment,
        }).then(response => {
            const data = [ ...gameData.comments, {
                rating: comment.rating,
                text: comment.text,
                user: {
                    userImage: JSON.parse(localStorage.userInfoIndie4All).userImage.slice(36),
                    username: JSON.parse(localStorage.userInfoIndie4All).username
                }
            }]
            setGameData({...gameData, comments: data})
        });
    }

    return (
        <>
            {isLoading? <h1>Loading</h1>: 
                <div className={styles.main} id='main'>
                    <label htmlFor='main'> {gameData.name} </label>
                    <div className={styles.imgGallery}>
                        <ul id='gallery'>
                            {
                                gameData.images.map(item => {
                                    return (
                                        <li key={Math.random(1)}>
                                            <img src={item}></img>
                                        </li>   

                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div className={styles.infoGame}>
                        <div className={styles.sinopse} id='sinopse'>
                            <label htmlFor='sinopse'>Sinopse</label>
                            <p> {gameData.sinopse} </p>
                        </div>
                        <div className={styles.reqSys} id='req'>
                            <label htmlFor='req'>Requisitos de Sistema</label>
                            <ul aria-label='Minimo'>
                                <li>
                                    <p><strong>Processador</strong>: {gameData.reqMin.cpu} </p>
                                </li>
                                <li>
                                    <p><strong>Placa de Video</strong>: {gameData.reqMin.gpu} </p>
                                </li>
                                <li>
                                    <p><strong>Memória RAM</strong>: {gameData.reqMin.ram} </p>
                                </li>
                                <li>
                                    <p><strong>Armazenamento</strong>: {gameData.reqMin.storage} </p>
                                </li>
                                <li>
                                    <p><strong>Sistema Operacional</strong>: {gameData.reqMin.so} </p>
                                </li>
                            </ul>
                            <ul aria-label='Recomendado'>
                                <li>
                                    <p><strong>Processador</strong>: {gameData.reqRec.cpu} </p>
                                </li>
                                <li>
                                    <p><strong>Placa de Video</strong>: {gameData.reqRec.gpu} </p>
                                </li>
                                <li>
                                    <p><strong>Memória RAM</strong>: {gameData.reqRec.ram} </p>
                                </li>
                                <li>
                                    <p><strong>Armazenamento</strong>: {gameData.reqRec.storage} </p>
                                </li>
                                <li>
                                    <p><strong>Sistema Operacional</strong>: {gameData.reqRec.so} </p>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.generalInfo}>
                            <p>Desenvolvedor: <span>{gameData.dev.username}</span> </p>
                            <p>Lançamento: <span>{gameData.launchDate.slice(0, 10)}</span> </p>
                            <p>Nota média: <span>{gameData.rating}</span> </p>
                        </div>
                    </div>

                    <div className={styles.avaliations} id='avaliations'>
                        <label htmlFor='avaliations'>Avaliações</label>
                        {
                            gameData.comments.map(item => {
                                return (
                                    <div className={styles.comment} key={Math.random(1)}>
                                        <img src={`${api.defaults.baseURL}/static/images/${item.user.userImage}`}></img>
                                        <p> {item.user.username} </p>
                                        <p className={styles.stars}> {'★'.repeat(item.rating)} </p>
                                        <p> {item.text} </p>
                                    </div>
                                )
                            })
                        }
                        
                        <div className={styles.comment}>
                            {
                                localStorage.userInfoIndie4All? 
                                <>
                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        makeComment();
                                    }}>
                                        <div className={styles.starRating}>
                                            <input 
                                                type='radio' 
                                                id='5star' 
                                                value='5' 
                                                name='stars' 
                                                onChange={e => setComment({...comment, rating: e.target.value})}
                                            />
                                            <label htmlFor='5star'>☆</label>
                                            
                                            <input 
                                                type='radio' 
                                                id='4star' 
                                                value='4' 
                                                name='stars' 
                                                onChange={e => setComment({...comment, rating: e.target.value})}
                                            />
                                            <label htmlFor='4star'>☆</label>
                                            
                                            <input 
                                                type='radio' 
                                                id='3star' 
                                                value='3' 
                                                name='stars' 
                                                onChange={e => setComment({...comment, rating: e.target.value})}
                                            />
                                            <label htmlFor='3star'>☆</label>
                                            
                                            <input 
                                                type='radio' 
                                                id='2star' 
                                                value='2' 
                                                name='stars' 
                                                onChange={e => setComment({...comment, rating: e.target.value})}
                                            />
                                            <label htmlFor='2star'>☆</label>
                                            
                                            <input 
                                                type='radio' 
                                                id='1star' value='1' 
                                                name='stars' 
                                                onChange={e => setComment({...comment, rating: e.target.value})}
                                            />
                                            <label htmlFor='1star'>☆</label>
                                        </div>
                                        <textarea 
                                            placeholder='Dê a sua opinião'
                                            onChange={e => setComment({...comment, text: e.target.value})}
                                        />
                                        <button>Enviar</button>
                                    </form>
                                </>
                                : 
                                <>
                                    <img src='/images/default.png'></img>
                                    <p> Admin </p>
                                    <p>Você precisa estar logado para poder fazer um comentário</p>
                                </>
                                    
                            }
                        </div>
                    </div>

                    <button className={styles.btnDownload} onClick={downloadGame}>Download</button>
                    {
                        !gameData.analysed && isModerator? 
                            <div className={styles.moderatorOptions}>
                                <button onClick={e=>altGameStatus(true)}>Liberar</button>
                                <button onClick={e=>altGameStatus(false)}>Recusar</button>
                            </div>
                        :   
                            false
                    }
                </div>
            }
        </>
    )
}

export default Games;