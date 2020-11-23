import React from 'react';
import Link  from 'next/link';
import styles from '../css/boxgame.module.css';

function SearchedGame(props) {
    return (
        <Link href={`/games?name=${props.name}`}>
            <div className={styles.searchedGame} onClick={localStorage.setItem('game', JSON.stringify(props))}>
                <img src={props.images[0]}/>
                <p> {props.name} </p>
                <p> {props.rating} </p>
                <p> {props.launchDate.slice(0, 10)} </p>
            </div>
        </Link>
    )
    
}

function CarrouselGame(props) {
    return (
        <Link href={`/games?name=${props.name}`}>
            <div className={styles.gameCarrousel} onClick={localStorage.setItem('game', JSON.stringify(props))}>
                <img src={props.images[0]}/>
            </div>
        </Link>
    )
}

function HomeMainGame(props) {
    return (
        <Link href={`/games?name=${props.name}`}>
            <div className={styles.boxGame} onClick={localStorage.setItem('game', JSON.stringify(props))}>
                <img src={props.images[0]}/>
                <p> {props.name} </p>
            </div>
        </Link>
    )

}

export {    
    CarrouselGame,
    SearchedGame,
    HomeMainGame
}