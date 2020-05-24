import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import './styles.css'

export default class Main extends Component{
    render(){
        //const { products } = this.state
        const br = `\n`;
        return(
            <div className="block">
                <article id="logo"></article>
                <article id="menu"><Link to="/app"><button id="bt-start">Start</button></Link></article>
                <article id="l1">
                    <strong>RELATÓRIOS {br}DE PERFIL</strong>
                    <p>Relátorios de crescimento{br} do perfil diários</p>
                </article>
                <article id="l2">
                    <strong>INFORMAÇÃO DO PERFIL</strong>
                    <p>Saiba quem parou de te seguir e quem não te segue de volta</p>
                </article>
                <article id="l3">
                    <strong>GERADOR DE #HASHTAGS</strong>
                    <p>Use as melhores hashtags para o alcance de sua postagens</p>
                </article>
                <article id="l4">
                    <strong>SORTEIOS</strong>
                    <p>Faça e gerencie sorteios de comentários, likes, seguidores em seu perfil</p>
                </article>
                <article id="bottom">
                    WHONFOLLOW BETA™ V01-05-20
                </article>
            </div>
        );
    }
}