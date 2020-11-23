import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from '../css/index.module.css';
import { HomeMainGame, CarrouselGame } from '../components/boxgame';

function Home() {
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [mostDownloaded, setMostDownloaded] = useState([]);

    useEffect(() => {
        const callApi = async () => {
            await api.get('/').then(response => {
                response.data.recentlyAdded.map((item, index) => {
                    response.data.recentlyAdded[index].images[0] = `http://localhost:3333/static/images/${item.images[0]}`
                })
                response.data.mostDownloaded.map((item, index) => {
                    response.data.mostDownloaded[index].images[0] = `http://localhost:3333/static/images/${item.images[0]}`
                })
                setRecentlyAdded(response.data.recentlyAdded);
                setMostDownloaded(response.data.mostDownloaded);
            });
        }
        callApi();
    }, [])


    return (
        <>
            <div className={styles.banner}></div>
            <div className={styles.boxCarrousel}>
                <label htmlFor='recent-add'>Adicionados Recentemente</label>
                <ul id='recent-add'>
                    {
                        recentlyAdded.map(item => {
                            return(
                                <li key={Math.random(1)}>
                                    <CarrouselGame {...item}/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className={styles.mainGames} id='main-games'>
                <label htmlFor='main-games'>Mais Baixados</label>
                {
                    mostDownloaded.map(item => <HomeMainGame {...item} key={Math.random(1)}/>)
                }
            </div>
        </>
    )
}

export default Home;