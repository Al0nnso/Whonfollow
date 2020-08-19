import React, {Component} from 'react'
import api from '../../services/api'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css'; 
import {Link} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'

//import '../../cookies.js'
import './styles.css'
import Header from '../../components/Header'
//import Home,{Load} from './home/'
//import Blocks from './blocks'
import Chart from './charts.js'
import Hashtags from './hashtags'
import Configs from './configs'
import Info from './info'

//const Load=require('./home/loader')

const Cookies=require('../../cookies')

var UserData={user:{},media:{}}

class Profile{
    constructor(self){}
    load(){
        this.user=UserData.user
        this.posts=UserData.media
        const blocks=[
            this.info(),
            this.engajament_graphic(),
            this.follow_graphic(),
            this.tags_graphic(),
        ]
        return blocks
    }

    info(){
        const user = this.user
        return(
        <article id="profile-info">
            <view id="user-info">
                <strong>{user.full_name}</strong>
                <b>{user.followers} - {user.following}</b>
                <p>{user.username}</p>
            </view>
            <view id="user-picture">
                <img id="img-picture"src={user.picture_hd}/>
            </view>
        </article>
        )
    }
    follow_graphic(){
        const user = this.user
        return(
            <article className="chart">
            <strong>Seguidores</strong>
            <div className="chart-render">
                <p>Você possui {parseInt(user.following*100/user.followers)}% mais de seguidores em relação aos que segue</p>
                <Chart title="Follow Info" type="bar" labels={["Followers","Following"]} data={[user.followers,user.following]}/>
            </div>
            </article>
        )
    }
    tags_graphic(){
        const user = this.user
        const posts = this.posts
        return(
            <article className="chart">
                <strong>Tipos de fotos</strong>
                <p> ( {posts.tags.total} analizadas )</p>
                <div className="chart-render">
                    <Chart title={posts.count+" Posts"} type="pie" labels={["Espelho","Céu","Fora de casa"]} data={[posts.tags.mirror,posts.tags.sky,posts.tags.outdoor]}/>
                    <Chart title={posts.count+" Posts"} type="pie" labels={["Pessoa","+1 Pessoas"]} data={[posts.tags.person,posts.tags.persons]}/>
                </div>
            </article>
        )
    }
    engajament_graphic(){
        const user = this.user
        const posts = this.posts.posts
        var all_likes=0
        for(var i=0;i<posts.length&&i<5;i++){
            all_likes+=posts[i].likes
        }
        console.log(all_likes)
        var media_likes=(all_likes/5)
        var engajamento=(media_likes/user.followers)*100
        var nota

        if(engajamento<=1){nota="Ruim"}else if(engajamento>=3){nota="Ótimo"}
        else if(engajamento>=2){nota="Bom"}else{nota="Médio"}

        return(
            <article id="display-info">
                <strong>Engajamento: </strong>
                <div>
                    <strong>Bom - {parseFloat(engajamento.toFixed(2))}%</strong>
                    <p> Média de {media_likes} likes (últimas 5 fotos analizadas)</p>
                </div>
            </article>
        )
    }
}
const userProfile=new Profile()
export default class Main extends Component{
    
    state={main:'',loaded:<p>Loading...</p>}

    componentDidMount(){
        /*let search = window.location.search;
        let params = new URLSearchParams(search);*/
        console.log(document.cookie)
        if(Cookies.get('token')==null || Cookies.get('userid')==null){
            console.log("No token")
            //alert(document.cookie)
            //const userid='17841404110779404'
            //const token='IGQVJXZAmZApU1Nxak5nOG9pS3BzemVlRnI5MmhRVTd4NXBHam5IOGJnLXgyVmkyc0xOWnlNV2FGcFBJTVNJaWRWdi0wTFFjTGh2Y0NKaHV0LWlBejU4YnlFRFpXdWRGdkFPS1U3emFB'
            //this.loadProducts(token,userid)
            window.location.href = '/login'; 
        }
        this.load()
    }
    async load(){
        await this.login(Cookies.get('token'),Cookies.get('userid'))
    }
    async login(token,userid){
        var block=[<p>loading...</p>]
        const response= await api.get('/load/info/'+userid+'/?token='+token)
        .then(async response => { 
            console.log(response)
            document.cookie='userid='+userid
            document.cookie='token='+token
            UserData.user=response.data
            //console.log(Blocks.state)
            //await this.media()
        })
        .catch(error => {
            console.log(error)
            //alert(error)
            console.log("Fail token")
            //alert(document.cookie)
            window.location.href = '/login'; 
        });
        const media_response= await api.get('/load/media/'+userid+'/?token='+token)
        .then(async response => { 
            console.log(response)
            document.cookie='userid='+userid
            document.cookie='token='+token
            UserData.media=response.data
            //console.log(Blocks.state)
            //_MEDIA=response.data
        })
        .catch(error => {
            console.log(error)
            //alert(error)
            console.log("Fail media")
            //alert(document.cookie)
            window.location.href = '/login'; 
        });
        //this.setState({loaded:userProfile.load()})
    }

    render(){
        
        const br = `\n`;

        return(
            <div id="appArea">
            <div id="homeArea">
                <SideNav
                onSelect={(selected) => {
                    switch(selected){
                        case "home":
                            this.setState({loaded:userProfile.load()})
                            break;
                        case "hashtags":
                            this.setState({loaded:<Hashtags/>})
                            break;
                        case "config/profile":
                            this.setState({loaded:<Configs/>})
                            break;
                        case "config/about":
                            this.setState({loaded:<Info/>})
                            break;
                        default:
                            this.setState({loaded:userProfile.load()})
                    }
                    console.log(this.state)
                }}
            >
            <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                    <NavItem eventKey="home">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="hashtags">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Hashtags
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="config">
                        <NavIcon>
                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Configurações
                        </NavText>
                        <NavItem eventKey="config/profile">
                            <NavText>
                                Perfil
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="config/about">
                            <NavText>
                                Sobre
                            </NavText>
                        </NavItem>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            </div>
            <div id="blocksArea">
                <div className="block">
                    <Header/>
                    {this.state.loaded}
                    <article id="bottom">
                        WHONFOLLOW BETA™ V01-05-20
                    </article>
                </div>
            </div>
            
        </div>
        );
    }
}