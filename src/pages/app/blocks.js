import React, {Component} from 'react';

//import MyChart from './mychart-react.js'
//import '../../cookies.js'
import api from '../../services/api'
import Chart from './charts.js'
const Cookies=require('../../cookies')


class Profile{
    constructor(token,userid) {
        this.token=token
        this.userid=userid
        return this.user
    }
    async login(){
            var block=[<p>loading...</p>]
            const response= await api.get('/load/info/'+this.userid+'/?token='+this.token)
            .then(async response => { 
                console.log(response)
                document.cookie='userid='+this.userid
                document.cookie='token='+this.token
                this.user=response.data
                //console.log(Blocks.state)
                await this.media()
                block=
                [
                    this.info(),
                    this.follow_graphic(),
                    this.tags_graphic(),
                    
                ]

            })
            .catch(error => {
                console.log(error)
                alert(error)
                console.log("Fail token")
                //alert(document.cookie)
                //window.location.href = '/login'; 
            });
            return(block)
    
    }
    info(){
        const user = this.user
        return(
        <article id="profile-info">
            <view id="user-info">
                <strong>{user.full_name}</strong>
                <p>{user.username}</p>
                <p>{user.followers} - {user.following}</p>
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
                    <Chart title={posts.count+" Posts"} type="pie" labels={["Espelho","Céu","Fora de casa","Pessoa","+1 Pessoas"]} data={[posts.tags.mirror,posts.tags.sky,posts.tags.outdoor,posts.tags.person,posts.tags.persons]}/>
                </div>
            </article>
        )
    }
    async media(){
        var _MEDIA;
        const user = this.user
        const response= await api.get('/load/media/'+this.userid+'/?token='+this.token)
        .then(async response => { 
            console.log(response)
            document.cookie='userid='+this.userid
            document.cookie='token='+this.token
            this.posts=response.data
            //console.log(Blocks.state)
            //_MEDIA=response.data

        })
        .catch(error => {
            console.log(error)
            alert(error)
            console.log("Fail media")
            //alert(document.cookie)
            //window.location.href = '/login'; 
        });
        return;
    }
}

export default class Blocks extends Component {
    state={
        blocks:[]
    }
    constructor(state){
    super(state)

    }
    componentDidMount() {
        if(Cookies.get('token')==null || Cookies.get('userid')==null){
            console.log("No token")
            //alert(document.cookie)
            //const userid='17841404110779404'
            //const token='IGQVJXZAmZApU1Nxak5nOG9pS3BzemVlRnI5MmhRVTd4NXBHam5IOGJnLXgyVmkyc0xOWnlNV2FGcFBJTVNJaWRWdi0wTFFjTGh2Y0NKaHV0LWlBejU4YnlFRFpXdWRGdkFPS1U3emFB'
            //this.loadProducts(token,userid)
            window.location.href = '/login'; 
        }
        this.loadBlocks();
    }
    loadBlocks= async()=>{
        const sProfile=new Profile(Cookies.get('token'),Cookies.get('userid'))
        const blocks=await sProfile.login().then(response=>{
            console.log(response)
            this.setState({
                blocks:response
            })
            console.log(this.state)
            //alert(this.state)
        })

    }


    render(){
        //const user = Blocks.state
        //const {graphic} = this.state
        //alert(Cookies.get('token'))
        
        
        return(
            <div className="chart">
                {this.state.blocks}
                
            </div>
        )
    }
}

