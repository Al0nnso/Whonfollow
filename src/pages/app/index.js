import React, {Component} from 'react'
import api from '../../services/api'
import {Link} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'

//import '../../cookies.js'
import './styles.css'
import Header from '../../components/Header'
import Home from './home/'
import Blocks from './blocks'
const Cookies=require('../../cookies')

export default class Main extends Component{


    componentDidMount(){
        /*let search = window.location.search;
        let params = new URLSearchParams(search);*/
       
        console.log(document.cookie)

    }
    render(){
        
        
        const br = `\n`;

        return(
            <div id="appArea">
                <div id="homeArea">
                    <Home/>
                </div>
                <div id="blocksArea">
                    <div className="block">
                        <Header/>
                        <Blocks/>
                        <article id="bottom">
                            WHONFOLLOW BETA™ V01-05-20
                        </article>
                    </div>
                </div>
                
            </div>
        );
    }
}