import React, {Component} from 'react';

//import MyChart from './mychart-react.js'
//import '../../cookies.js'
import api from '../../services/api'
import Chart from './charts.js'
import Generator from "./generator/"
const Cookies=require('../../cookies')




class Loader{
}

export default class Hashtags extends Component {
    state={
        hashtags:[],
        generated:[]
    }
    constructor(state){
        super(state)

    }
    componentDidMount() {

    }

    render(){
        //<article><p>Upload your picture...</p></article>
        
        return(
            <div className="block">
                <article>
                    <strong>#Hashtags</strong>
                    <p>O objetivo das hashtags são de direcionar o usuário para uma página de mesmo assunto.</p>
                </article>
                <article>
                    <strong>Gerar</strong>
                    <p>Insira uma palavra chave do seu perfil:</p>
                    <Generator query=""/>
                </article>
                <article>
                    <strong>Mais populares</strong>
                    <p id="hashtags">
                        #love #instagood #photooftheday #fashion #beautiful #happy #cute #tbt #like4like #followme #picoftheday #follow #me #selfie #summer #art #instadaily #friends #repostv#nature
                    </p>
                </article>
            </div>
        )
    }
}

