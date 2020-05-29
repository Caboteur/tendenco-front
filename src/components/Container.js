import React, { Component } from 'react';
import ButtonTrend from './ButtonTrend.js'
import styles from './Container.module.css';
import Viewer from './Viewer.js'
import wiki from 'wikijs'
import countries from './Api/countries.js'
import Preloader from './Preloader.js'

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reponse:[],
      id:"",
      wiki:"",
      value:"FR",
      display:"none",
      displaytrad:"none",
      displayButton:"inherit",
      loading:"inherit",
      trad:false,
      googleSearch:"tendances",
      twitterSearch:"tendances",
      youtubeSearch:"tendances",
      country:countries()
    }
  }

  componentDidMount(){
    this.fastResponse();
    this.Server();
}
 async fastResponse(){
    const response= await fetch('https://tedenco-topics.herokuapp.com/first-trend');
    const body = await response.json();
      this.setState({ data: body})
      this.News();
  }
  async Server(){
    const response= await fetch('https://tedenco-topics.herokuapp.com/news-trend');
    const body = await response.json();

    this.setState({ data: body })
  }
  async News(){

await  this.setState({ loading:"inherit" })
await this.setState({ reponse: [] })

   await this.state.data.map((tab)=>{

      if (tab.country  === this.state.value){
        this.setState({ loading:"none" })
        this.setState({ reponse: [...this.state.reponse, tab] })
      }
    })
  }



  handleChange (event){
    this.setState({value: event.target.value}, ()=>{
      this.News();
      if(this.state.value === "FR"){
          this.setState({displaytrad: "none"})

      }else{
        this.setState({displaytrad: "inherit"})

      }
    })


  }

  handleClick(e){
     const targt = "button" + e.target.id;

    document.getElementById(targt).style.display="inherit";
    this.setState({displayButton:"none"})
    const elem = e.target.getAttribute('name')
    const id = e.target.id;
    this.setState({id:id});
    this.wiki(elem)
    this.googleSearch(elem);
    this.twitterSearch(elem);
    this.youtubeSearch(elem);
    const element = document.getElementById("button" + id)
    element.className=styles.articleContainerFull
  }

  handleClickoff(e){
    this.setState({displayButton:"inherit"})
  const element = document.getElementById("button" + this.state.id)
  this.setState({display:"none"});
  element.style.display="none";

  }

   wiki(data){
     {
       const wikiSearchReturnValues = []

         var url = "https://fr.wikipedia.org/w/api.php";
         var params = {
           action: 'query',
           list: 'search',
           srsearch: data,
           format: 'json'
         };

         url = url + '?origin=*';
         Object.keys(params).forEach((key) => {
           url += "&" + key + "=" + params[key];
         });

         fetch(url)
           .then(
             (response) =>{
               return response.json();
             }
           )
           .then(
             (response) =>{
               for (var key in response.query.search) {
                wikiSearchReturnValues.push({
                   queryResultPageTitle: response.query.search[key].title,
                 });
               }
             }
           )

           .then(
             (response)=> {

                if (wikiSearchReturnValues[0] !== undefined){
                 let title = wikiSearchReturnValues[0].queryResultPageTitle;

                  this.setState({wiki:title}, ()=>console.log(title));
                  wiki({ apiUrl: 'https://fr.wikipedia.org/w/api.php' })
                    .find(title)
                      .then(page => this.setState({wikiurl:page.raw.fullurl}), ()=>console.log(this.state.wikiurl))
               }else {
                 console.log("nowiki")
               }
             }
           )

       }
   }

  googleSearch(data){
    const search = 'https://www.google.com/search?q='+data;
    this.setState({googleSearch:search})
  }

  twitterSearch(data){
    const search = 'https://twitter.com/search?q='+data+'&src=typed_query'
    this.setState({twitterSearch:search})
  }

  youtubeSearch(data){
    const search = 'https://www.youtube.com/results?search_query='+data;
    this.setState({youtubeSearch:search})
  }

  translate(){
    if(this.state.trad === false){
        this.setState({trad:true})
    }else{
      this.setState({trad:false})
    }

  }

  render(props) {

    return (
      <div className={styles.Container}>
        <div className={styles.selectContainer}>
          <select  className={styles.selector} onChange={this.handleChange.bind(this)} value={this.state.value}>

            {this.state.country.map((country, index)=>
              <option key={index} className={styles.options} value={country.id}>{country.name}</option>
            )}
          </select>

        </div>
        <div >
          {
            this.state.reponse.map((trend, index) =>

            <div id={"container" + index} className={styles.articleContainer}>

              <ButtonTrend id={index} display={this.state.displayButton} trad={this.state.trad} value={trend.topic.title.query} click={this.handleClick.bind(this)} key={index} title={trend.topic.title.query}/>

              <Viewer
                id={"button" + index}
                key={"button" + index}
                click={this.handleClickoff.bind(this)}
                topics={trend.topic.title.query}
                wikiurl={this.state.wikiurl}
                wikititle={this.state.wiki}
                googleSearch={this.state.googleSearch}
                twitterSearch={this.state.twitterSearch}
                youtubeSearch={this.state.youtubeSearch}
                display={this.state.display}
                source={trend.topic.articles[0].source}
                title={trend.topic.articles[0].title}
                url={trend.topic.articles[0].url}
                />

            </div>

          )}

          <Preloader display={this.state.loading} />

          <button className={styles.selector} style={{display:this.state.displaytrad}} onClick={this.translate.bind(this)}>Traduire</button>

        </div>



      </div>
    );
  }
}

export default Container;
