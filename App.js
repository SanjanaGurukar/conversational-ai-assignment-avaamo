import React, { Component } from 'react';
import './App.css';
import Results from './Results';

let newobj = [];
export default class App extends React.Component  {

    constructor(props) {
      super(props);

      this.state = {
        wordNoccData: null,
        showResults: false
      };
    }

    componentWillMount() {
        this.renderMyData();
    }

    renderMyData(){
        fetch('https://cors-anywhere.herokuapp.com/http://norvig.com/big.txt')
            .then((response) => response.text())
            .then((responseJson) => this.getTop10Words(responseJson.toLowerCase(),10))
            .then((result) => this.output(result))
            .catch((error) => {
              console.error(error);
            });
    }

    getTop10Words(string, maxNum) {
        var wordsArray = string.split(/\s/);
        var wordOccurrences = {}
        for (var i = 0; i < wordsArray.length; i++) {
            wordOccurrences['_'+wordsArray[i]] = ( wordOccurrences['_'+wordsArray[i]] || 0 ) + 1;
        }
        var result = Object.keys(wordOccurrences).reduce(function(acc, currKey) {
            for (var i = 0; i < maxNum; i++) {
                if (!acc[i] && currKey.length>1) {
                    acc[i] = { word: currKey.slice(1, currKey.length), occurences: wordOccurrences[currKey] };
                    break;
                } else if (acc[i].occurences < wordOccurrences[currKey] && currKey.length>1) {
                    acc.splice(i, 0, { word: currKey.slice(1, currKey.length), occurences: wordOccurrences[currKey] });
                    if (acc.length > maxNum)
                        acc.pop();
                    break;
                }
            }
            return acc;
        }, []);
        this.setState({wordNoccData: result})
        return result;
      }
      
      output(obj){
        
        for(let i=0; i<10; i++){
           fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=${obj[i].word}`)
          .then((resp) => resp.json()) // Transform the data into json
          .then(function(data) {
              
            if(data.def[0] && data.def[0].pos){
                newobj.push(data.def[0].pos)
            }
            else newobj.push("not found in the Dictionary");
          })
        }
        return newobj;
      }
    
      onClick() {
        this.setState({ showResults: true });
      }

    render(){
        return(
        <div className="App">
        <header className="App-header">
          <h1>Conversational AI Engineer</h1>
          <p>In the given <a href = "http://norvig.com/big.txt">document</a> below are the list of top 10 words <br></br> along with 
          its number of occurences and its dictionary details in JSON format</p>
          <button className="button" onClick={() => this.onClick()}>Click me to find out!</button>
          <br></br>
          { this.state.showResults ? <Results words={this.state.wordNoccData} pos={newobj}/> : null }
        </header>
        </div>

        );
    }
}