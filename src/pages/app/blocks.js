import React, {Component} from 'react';

//import MyChart from './mychart-react.js'
//import '../../cookies.js'
import api from '../../services/api'
import Chart from './charts.js'
const Cookies=require('../../cookies')


class Profile{
    constructor(token,userid) {
        this.user=this.props.data.user
        this.posts=this.props.data.media
        return this.user
    }
    load(){
        const blocks=[
            this.info(),
            this.engajament_graphic,
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
                <div id="center">
                <strong>Bom - {parseFloat(engajamento.toFixed(2))}%</strong>
                <p> Média de {media_likes} likes ( últimas 5 fotos analizadas )</p>
                </div>
            </article>
        )
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

        this.loadBlocks();
    }
    loadBlocks= async()=>{
        const sProfile=new Profile()
        const blocks=await sProfile.load().then(response=>{
            console.log(response)
            this.setState({
                blocks:response
            })
            console.log(this.state)
            alert(this.state)
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

