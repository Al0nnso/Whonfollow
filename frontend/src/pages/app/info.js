import React, {Component} from 'react';

const Cookies=require('../../cookies')

export default class Info extends Component {

    constructor(state){
        super(state)

    }
    componentDidMount() {

    }

    render(){
        
        return(
            <div>
                <article>
                    <strong>Sobre</strong>
                    <p>Whonfollow BETA</p><p>Feito por @andres.alonnso</p>
                </article>
            </div>
        )
    }
}

