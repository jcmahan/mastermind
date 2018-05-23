import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';
import GamePage from '../GamePage/GamePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import ScoresPage from '../ScoresPage/ScoresPage';

let colorTable = [
  {name: 'Easy', colors: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD']},
  {name: 'Moderate', colors: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968']},
  {name: 'Difficult', colors: ['#7CCCE5', '#FDE47F', '#E04644', '#B576AD', '#B7D968', '#555E7B']}
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {difficultyLevel: 0, colors: colorTable[0].colors, scores: []},
      this.getInitialState()
    );
  }

  /*---------- Helper Methods ----------*/

  getInitialState() {
    let colorIdx = (this.state && this.state.difficultyLevel) || 0;
    return {
      code: this.genCode(colorTable[colorIdx].colors.length),
      selColorIdx: 0,
      guesses: [this.getNewGuess()],
      elapsedTime: 0,
      finalTime: 0,
    };
  }

  getNewGuess() {
    return {
      code: [null, null, null, null],
      score: {
        perfect: 0,
        almost: 0
      }
    };
  }

  genCode(size) {
    return new Array(4).fill().map(dummy => Math.floor(Math.random() * size));
  }

  setDifficulty = (level) => {
    this.setState({
      difficultyLevel: level,
      colors: colorTable[level].colors
    });
  }

  /*---------- Callback Methods ----------*/

  handleColorSelection = (colorIdx) => {
    this.setState({selColorIdx: colorIdx});
  }

  handleNewGameClick = () => {
    this.setState(this.getInitialState());
  }

  handlePegClick = (pegIdx) => {
    let currentGuessIdx = this.state.guesses.length - 1;

    // Always replace objects/arrays with NEW versions
    let guessesCopy = [...this.state.guesses];
    let codeArrCopy = [...guessesCopy[currentGuessIdx].code];

    // Update the NEW array
    codeArrCopy[pegIdx] = this.state.selColorIdx;

    // Update the NEW guesses array
    guessesCopy[currentGuessIdx].code = codeArrCopy;

    // Update state with the NEW guesses array
    this.setState({
      guesses: guessesCopy
    });
  }

  handleScoreClick = () => {
    
    let currentGuessIdx = this.state.guesses.length - 1;

    // Computing the score will modify the guessed code and the
    // secret code, therefore create copies of the originals
    let guessCodeCopy = [...this.state.guesses[currentGuessIdx].code];
    let secretCodeCopy = [...this.state.code];

    let perfect = 0, almost = 0;

    // First pass computes number of "perfect"
    guessCodeCopy.forEach((code, idx) => {
      if (secretCodeCopy[idx] === code) {
        perfect++;
        // ensure does not match again
        guessCodeCopy[idx] = secretCodeCopy[idx] = null;
      }
    });

    // Second pass computes number of "almost"
    guessCodeCopy.forEach((code, idx) => {
      if (code === null) return;
      let foundIdx = secretCodeCopy.indexOf(code);
      if (foundIdx > -1) {
        almost++;
        secretCodeCopy[foundIdx] = null;
      }
    });

    // State must only be updated with NEW objects/arrays
    let guessesCopy = [...this.state.guesses];

    // Set scores
    guessesCopy[currentGuessIdx].score.perfect = perfect;
    guessesCopy[currentGuessIdx].score.almost = almost;

    // Add a new guess if not a winner
    if (perfect !== 4) guessesCopy.push(this.getNewGuess());

    // Finally, update the state with the NEW guesses array
    this.setState(prevState => ({
      guesses: guessesCopy,
      finalTime: (perfect === 4) ? prevState.elapsedTime : 0
    }));

    if (this.state.guesses[this.state.guesses.length - 1].score.perfect === 4) {
      let initials = window.prompt("Congrats, Winner! What are your Initials?")
      let sortedScores = this.state.scores.sort(function(score1, score2) {
      return score2.numGuesses - score1.numGuesses
    })
      let lowestScore = sortedScores.slice(0,10)[0]
          if (this.state.guesses.length < lowestScore.numGuesses && this.state.elapsedTime < lowestScore.seconds){
          (this.state.guesses.length)
            fetch('/api/scores/new', {
              method: 'POST',
              body: JSON.stringify({
                initials: initials, 
                numGuesses: this.state.guesses.length,
                seconds: this.state.elapsedTime
              }), 
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(data => data.json())
            .then(res => {
              console.log("test")
              this.props.history.push('/scores');
              console.log(this.props.history)
          })
          }
          };
        }



      //check if current score belongs in high score list
      //if yes, add score to database
      //if no, do nada

  handleTick = () => {
    this.setState((prevState) => ({
      elapsedTime: ++prevState.elapsedTime
    }));
  }
  
  //Lifecycle Methods//
  componentDidMount() {
    fetch("/api/scores")
      .then(res => res.json())
      .then(scores => this.setState({scores}));
  }

  render() {
    return (
      <div>
        <header className='header-footer'>R E A C T &nbsp;&nbsp; M A S T E R M I N D</header>
            <Switch>
              <Route exact path='/' render={() =>
                <GamePage
                  colors={this.state.colors}
                  selColorIdx={this.state.selColorIdx}
                  guesses={this.state.guesses}
                  handleColorSelection={this.handleColorSelection}
                  handleNewGameClick={this.handleNewGameClick}
                  handlePegClick={this.handlePegClick}
                  handleScoreClick={this.handleScoreClick}
                  elapsedTime={this.state.elapsedTime}
                  handleTick={this.handleTick}
                  isTiming={!this.state.finalTime}
                />
              }/>
              <Route exact path='/settings' render={() => 
                <SettingsPage
                  colorTable={colorTable}
                  difficultyLevel={this.state.difficultyLevel}
                  handleDifficultyChange={this.setDifficulty}
                  handleNewGame={this.handleNewGameClick}
                />
              }/>
              <Route path='/scores' render={() =>
                <ScoresPage
                    scores={this.state.scores}
                  />
              }/>
            </Switch>
      </div>
    );
  }
}

export default App;