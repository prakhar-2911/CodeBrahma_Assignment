import React, {Component} from 'react';
import classes from './Main.module.css';
import axios from 'axios';

class Main extends Component {

state = {
    para : null,
    correct: true,
    time: 60,
    gameOver: null,
    keyCount: 0,
    startTime: null,
    wpm: 0 
}

componentDidMount(){
    axios.get('http://www.randomtext.me/api/').then(response => {     
    let formattedString = this.processData(response.data.text_out);
    this.setState({para : formattedString});
    });
}

startTimer = () => {
    this.setState({startTime: new Date()});
    setInterval(() => {
        this.setState(state => ({
            time : state.time - 1 
        }));

        if(this.checkIfZero()){
            this.setState({gameOver: true});
        }
        
    },1000);
}


checkIfZero = () => {
    if(this.state.time===0)
    return true;
    else
    return false; 
}

processData = (dataToSplit) => {
 let formattedString = dataToSplit.replace(new RegExp("<p>",'g'),"").replace(new RegExp("</p>",'g'),"");
 return formattedString;
} 

calcTime = () => {   
 let endTime = new Date();
 let timeDiff = (endTime - this.state.startTime);
 timeDiff/= 1000;
 timeDiff/= 60;
 //let seconds = Math.round(timeDiff);
 let wpm = ((this.state.keyCount/5)/timeDiff);
 wpm = Math.round(wpm);
 this.setState({wpm: wpm});
 

 
}

matchText = (event) => {
    if(event.target.value !== this.state.para.slice(0, event.target.value.length)){
        this.setState(state => ({
            correct: false
        }));
    }
    else{
    this.setState(state => (
        {correct: true,
        keyCount : state.keyCount+1
        }
    ));
    };

    this.calcTime();
}

render(){

    let warning = null;

    var display;

    if(!this.state.correct){
        warning = "Your Typing needs a correction";
    }

    if(this.state.gameOver){
        display = <div> 
          <h2> Game Over ...</h2>  
          <h3> Words Per Minute : </h3>
          {this.state.wpm}  
        </div>
    }
    else{
        display = <React.Fragment>
        <h1>
            Time : {this.state.time}
            
        </h1>

        <h2>Words Per Minute : {this.state.wpm}</h2>
        <h1>Type the words as you see in the paragraph</h1>
        <button onClick={this.startTimer}>START</button><br/>
        <input type="text" name="userInput" onKeyUp={event => this.matchText(event)}/>
        <h2>{warning}</h2>
        <p id="textPara">{this.state.para}</p>
    </React.Fragment> 
    }

    

    return (
        display
    );
}

}

export default Main;