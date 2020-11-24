import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SearchedGame } from '../components/boxgame';
import styles from '../css/search.module.css';

function Search() {
    const [gameList, setGameList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [order, setOrder] = useState('rating');

    const callApi = async () => {
        const parameters = {};
        document.URL.search != -1 ? parameters.name = document.URL.slice(34): false;
        categories.length>0 ? parameters.categories = categories: false;
        parameters.order = order;
        await api.get('/search',{ 
            params: parameters
        }).then(response => {
            response.data.games.map((item, index) => {
                item.images[0] = `${api.defaults.baseURL}/static/images/${item.images[0]}`
            });
            setGameList(response.data.games);
        });
    }

    useEffect(() => {
        callApi();
    }, []);

    const handleFilter = () => {
        let i = 0;
        let cat = [];
        const form = document.getElementById('form');
        const chks = form.getElementsByTagName('input');
        while(i < chks.length) {
            if(chks[i].checked === true) {
                cat.push(chks[i].value);
            }
            i++
        }
        setCategories(cat);
    }

    return (
        <div className={styles.main}>
            <div className={styles.games}>
            <label htmlFor='order'>Listar por:</label>
            <select id='order' name='order' defaultValue='rating' onChange={e => {
                setOrder(e.target.value);
                callApi();
            }}>
                <option value='launchDate'>Data de lançamento</option>
                <option value='rating'>Avaliações</option>
                <option value='downloads'>Mais Baixados</option>
            </select>
                {
                    gameList.map(item => {
                        return <SearchedGame {...item} key={Math.random(1)}/>

                    })
                }
            </div>
            <fieldset>
                <legend>Filtros</legend>
                <div className={styles.sidebar}>
                    <form id='form' onChange={e => { handleFilter() }}>
                        <input type='checkbox' name='cat' value='Aventura' id='aventura'/><label htmlFor='aventura'>Aventura</label>
                        <input type='checkbox' name='cat' value='Ação' id='acao'/><label htmlFor='acao'>Ação</label>
                        <input type='checkbox' name='cat' value='FPS' id='fps'/><label htmlFor='fps'>FPS</label>
                        <input type='checkbox' name='cat' value='Simulação' id='simulacao'/><label htmlFor='simulacao'>Simulação</label>
                        <button 
                            onClick={e => {
                                e.preventDefault();
                                callApi();
                                }}>
                            Filtrar
                        </button>
                    </form>
                </div>
            </fieldset>
        </div>
    )
}

export default Search;