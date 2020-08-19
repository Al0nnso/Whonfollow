import React, {Component} from 'react';

import "./styles.css"
import axios from 'axios'


export default class Generator extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '',generated:''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      //alert('Um nome foi enviado: ' + this.state.value);
      this.Generate()
      event.preventDefault();
    }
    async Generate(){
      var genHashtags=""
      const selected=(this.state.value).toLowerCase();
      const search_url="https://www.instagram.com/web/search/topsearch/?context=blended&query=%23"+selected+"&rank_token=0.2551643800607182&include_reel=true"
      const HashtagApi = axios.create({ baseURL: search_url})
      const response= await HashtagApi.get()
      .then(async response => { 
          console.log(response)
          const hashtag_data=response.data.hashtags
          for(var i=0;i<hashtag_data.length;i++){
            genHashtags+="#"+hashtag_data[i].hashtag.name+" "
          }

      })
      .catch(error => {
          genHashtags=["error on load"]
      });
      //const generated=
      this.setState({generated:genHashtags})
      //console.log(generated)
    }
    copyText = (e) => {
      this.textArea.select();
      document.execCommand('copy');
      // This is just personal preference.
      // I prefer to not show the the whole text area selected.
      e.target.focus();
      //this.setState({ copySuccess: 'Copied!' });
    };
    makeHashtag(str) {
        let wordArray = str.split(' ').filter(char => char !== "");
        let result = "#";
        
        if (wordArray.length === 0) {
          return false;
        };
        
        result = result + wordArray.map(word => {
          let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
          return capitalizedWord;
        }).join('');
        
        if(result.length > 140) {
          return false;
        } else{
          return result;
        };
    };
  
    render() {
      return (
        <div>
            <form onSubmit={this.handleSubmit}>
            <label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <button id="bt-hashtag-1" type="submit">#</button>
            </form>
            <div className="generated-hashtags"><textarea ref={(textarea) => this.textArea = textarea} className="generate-input" spellcheck="false" cols="40" rows="5" value={this.state.generated}></textarea><button className="bt-mini" onClick={this.copyText}>copy</button></div>
        </div>
      );
    }
  }