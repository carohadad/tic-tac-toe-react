import React from 'react';
import './Game.css';

export class Square extends React.Component {
  render() {
    return (
      <button className="square" id={this.props.index} onClick={() => this.props.onClick()}>
        { this.props.value }
      </button>
    );
  }
}

export class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.handleClick(i)} index={i}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super();
    this.state = {
      numberOfRounds: 0,
      xWonCount: 0,
      oWonCount: 0,
      whoMoves: "X",
      squares: props.squares,
      errorMessage: null,
      winner: null
    };
  }

  handleClick(i) {
    if (this.state.winner) {
      this.setState({errorMessage: "Game finished"});
      return
    }

    if (this.state.squares[i] != null ) {
      this.setState({errorMessage: "Position taken"});
      return
    }

    var newSquares = this.state.squares.slice();
    var currentPlayer = this.state.whoMoves;
    newSquares[i] = currentPlayer;
    var nextPlayer = (currentPlayer === "X") ? "O" : "X";

    var winner = this.calculateWinner(newSquares);

    if (this.state.winner !== winner && winner !== null) {
      this.roundFinished(winner);
    }

    if (newSquares.every((e) => e !== null)) {
      this.roundFinished("tie");
    }
    this.setState({squares: newSquares, errorMessage: null, whoMoves: nextPlayer});
  }


  roundFinished(winner) {

    var newXWonCount = this.state.xWonCount;
    var newOWonCount = this.state.oWonCount;

    if (winner === "X") {
      newXWonCount +=1;
    }

    if (winner === "O"){
      newOWonCount +=1;
    }

    var nextRound = this.state.numberOfRounds+1;

    this.setState({
      numberOfRounds: nextRound,
      xWonCount: newXWonCount,
      oWonCount: newOWonCount,
      whoMoves: (nextRound % 2 === 0) ? "X" : "O",
      winner: winner
    })
  }

  nextRound() {
    this.setState({
      squares: Array(9).fill(null),
      errorMessage: null,
      winner: null
    })
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  render() {

    let {numberOfRounds, xWonCount, oWonCount, whoMoves, squares, errorMessage, winner} = this.state

    return (
      <div className="game">
        <div className="round">
          <div className="messages">
            <div className="winner">Winner: {winner}</div>
            <div className="nextPlayer">Next player: {whoMoves}</div>
          </div>
          <div className="game-board">
            <Board squares={squares} handleClick={(i)=> this.handleClick(i)}/>
          </div>
          <div className="errorMessage">{errorMessage}</div>
        </div>

        <div className="game-info">
          <div className="games-played">Games played so far: {numberOfRounds}</div>
          <ul>
            <li className="x-won-count">X Won Count: {xWonCount}</li>
            <li className="o-won-count">O Won Count: {oWonCount}</li>
          </ul>
          <button id="next-round" onClick={()=> this.nextRound()}>
            Play Another Round
          </button>
        </div>
      </div>
    );
  }
}
Game.defaultProps = { squares: Array(9).fill(null) };


export default Game;
