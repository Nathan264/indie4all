import React, { useState, useEffect } from 'react';
import styles from '../css/gameModal.module.css'
import api from '../services/api';

function GameModal(props) {
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

    const [game, setGame] = useState({...props});
    const [preview, setPreview] = useState([]);

    const sendGameData = () => {
        if(!process.browser) {
            return
        }
        let i;
        const gameData = {
            dev: JSON.parse(localStorage.userInfoIndie4All)._id,
            name: game.name,
            categories: game.categories,
            sinopse: game.sinopse,
            reqMin: game.reqMin,
            reqRec: game.reqRec,
        }
        const formData = new FormData();
        for(i=0; i<game.images.length; i++) {
            formData.append('imgs', game.images[i]);
        }
        formData.append('gameFile', game.file[0]);
        formData.append('gameData', JSON.stringify(gameData));
        api.post('/addGame', formData).then(response => {
            alert(response.data.message)
        })
    }

    const altGameData = async () => {
        if(!process.browser) {
            return
        }
        const gameData = {
            name: game.name,
            categories: game.categories,
            sinopse: game.sinopse,
            reqMin: game.reqMin,
            reqRec: game.reqRec,
        }
        let i;
        const formData = new FormData();
        for(i=0; i<game.images.length; i++) {
            formData.append('imgs', game.images[i]);
        }
        game.file? formData.append('gameFile', game.file[0]): '';
        formData.append('gameData', JSON.stringify(gameData));
        await api.put('/altInfoGame', formData, {
            params: {
                _id: game._id
            }
        }).then(response => { 
            console.log(response);
        })
    }

    const removeImg = async (img) => {
        await api.delete('/removeImg', {
            params: {
                img,
                id: game._id
            }
        }).then(response => {
            alert(response.data.message)
        });
    }

    useEffect(()=> {
        if(!props.newGame) {
            setGame(props);
            setPreview(props.images)
        }else {
            setGame(emptyProps);
        }
    }, [props]);

    return (
        <div className={styles.modal} id='modal'>
                <div className={styles.modalContent}>
                    <span onClick={e=> {
                        const modal = document.getElementById('modal');
                        modal.style.height= '0%';
                        modal.style.paddingTop = '0px'
                    }}>X</span>

                    <div className={styles.generalInfo}>
                        <label htmlFor='name'>Nome: </label>
                        <input 
                            type='text'
                            name='gameName' 
                            value={game.name} 
                            onChange={e => setGame({...game, name: e.target.value})}
                            id='name'
                        />
                        <label htmlFor='gameArchive'>Arquivo: </label> 
                        <input 
                            type='file' 
                            name='game' 
                            id='gameArchive'
                            onChange={e => setGame({...game, file: e.target.files})}
                        />
                        <label htmlFor='gameImgs'>Imagens: </label>
                        <input 
                            type='file' 
                            name='gameImgs' 
                            id='gameImgs' 
                            onChange={e => {
                                setGame({...game, images: e.target.files});
                            }}
                            multiple
                            accept='image/*'
                        />
                        {
                            preview.length>0 ? (
                                <div className={styles.galleryWrap}>
                                    <ul id='gallery'>
                                    {
                                        preview.map(item => {
                                            return (
                                                <li key={Math.random(1)}>
                                                    <label>
                                                        <img 
                                                            onClick={e => {
                                                                const confirmation = confirm('Deseja excluir essa imagem?');
                                                                if(!confirmation) {
                                                                    return
                                                                }
                                                                const newArray = preview.filter(item2 => {
                                                                    if(item === item2) {
                                                                        return
                                                                    }else {
                                                                        return item2
                                                                    }
                                                                });
                                                                setPreview(newArray);
                                                                removeImg(item);
                                                            }} 
                                                            src='/images/excluir.png'
                                                        />
                                                    </label>
                                                    <img className='imgJogo' src={`http://localhost:3333/static/images/${item}`}/>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </div>
                            ): false
                        }
                        <label htmlFor='cat' >Categorias: </label>
                        <input 
                            type ='text' 
                            placeholder='Dividir categorias com ,' 
                            name='categories' 
                            value={game.categories}
                            onChange={e => setGame({...game, categories: e.target.value})}
                            id='cat'
                        />
                        <label htmlFor='sinopse'>Sinopse: </label>
                        <textarea 
                            name='sinopse' 
                            id='sinopse'
                            value={game.sinopse}
                            onChange={e => setGame({...game, sinopse: e.target.value})}
                        />
                    </div>                    
                    
                    <fieldset className={styles.req}>
                        <legend>Requisitos Minimos</legend>
                        <label htmlFor='cpuMin'>Processador: </label>
                        <input 
                            type='text' 
                            name='cpuMin' 
                            value={game.reqMin.cpu}
                            onChange={e => setGame({...game, reqMin: { ...game.reqMin, cpu: e.target.value }})}
                            id='cpuMin'
                            required
                        />
                        <label htmlFor='gpuMin'>Placa de Video: </label>
                        <input 
                            type='text' 
                            name='gpuMin' 
                            value={game.reqMin.gpu}
                            onChange={e => setGame({...game, reqMin: { ...game.reqMin, gpu: e.target.value }})}
                            id='gpuMin'
                        />
                        <label htmlFor='ramMin'>Memória RAM: </label>
                        <input 
                            type='text' 
                            name='ramMin' 
                            value={game.reqMin.ram}
                            onChange={e => setGame({...game, reqMin: { ...game.reqMin, ram: e.target.value }})}
                            id='ramMin'
                        />
                        <label htmlFor='soMin'>SO: </label>
                        <input 
                            type='text' 
                            name='soMin' 
                            value={game.reqMin.so}
                            onChange={e => setGame({...game, reqMin: { ...game.reqMin, so: e.target.value }})}
                            id='soMin' 
                        />
                        <label htmlFor='strMin'>Armazenamento: </label>
                        <input 
                            type='text' 
                            name='strMin' 
                            value={game.reqMin.storage}
                            onChange={e => setGame({...game, reqMin: { ...game.reqMin, storage: e.target.value }})}
                            id='strMin'
                        />
                    </fieldset>


                    <fieldset className={styles.req}>
                        <legend>Requisitos Recomendados</legend>
                        <label htmlFor='cpuRec'>Processador: </label>
                        <input 
                            type='text' 
                            name='cpuRec' 
                            value={game.reqRec.cpu}
                            onChange={e => setGame({...game, reqRec: { ...game.reqRec, cpu: e.target.value }})}
                            id='cpuRec'
                        />
                        <label htmlFor='gpuRec'>Placa de Video: </label>
                        <input 
                            type='text' 
                            name='gpuRec' 
                            value={game.reqRec.gpu}
                            onChange={e => setGame({...game, reqRec: { ...game.reqRec, gpu: e.target.value }})}
                            id='gpuRec'
                        />
                        <label htmlFor='ramRec'>Memória RAM: </label>
                        <input 
                            type='text' 
                            name='ramRec' 
                            value={game.reqRec.ram}
                            onChange={e => setGame({...game, reqRec: { ...game.reqRec, ram: e.target.value }})}
                            id='ramRec'
                        />
                        <label htmlFor='soRec'>SO: </label>
                        <input 
                            type='text' 
                            name='soRec' 
                            value={game.reqRec.so}
                            onChange={e => setGame({...game, reqRec: { ...game.reqRec, so: e.target.value }})}
                            id='soRec' 
                        />
                        <label htmlFor='strRec'>Armazenamento: </label>
                        <input 
                            type='text' 
                            name='strRec' 
                            value={game.reqRec.storage}
                            onChange={e => setGame({...game, reqRec: { ...game.reqRec, storage: e.target.value }})}
                            id='strRec'
                        />
                    </fieldset>    
                    { 
                        props.newGame? 
                            <button onClick={e => sendGameData()}>Cadastrar jogo</button>             
                        :
                            <button onClick={e => altGameData()}>Alterar Informações</button>
                    }
                </div>
            </div>
    )
}

export default GameModal;