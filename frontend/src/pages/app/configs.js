import React, {Component} from 'react';

const Cookies=require('../../cookies')

class Loader{
}

export default class Configs extends Component {
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
        
        return(
            <div>
                <article>
                    <strong>Configurações</strong>
                    <p>Configurações do seu perfil</p>
                </article>
            </div>
        )
    }
}

