import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={`square ${props.winner}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    console.log(winner);
    return (
      <Square
        winner={winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const board = [];
    let count = 0;
    let winner = "";
    for (let i = 0; i < 3; i++) {
      const boardRow = [];
      for (let j = 0; j < 3; j++) {
        if (this.props.winner && this.props.winner.includes(count)) {
          winner = "winner";
          console.log(count);
          console.log(this.props.winner);
        } else {
          winner = "";
        }
        boardRow.push(this.renderSquare(count, winner));
        count++;
      }
      board.push(<div className="board-row">{boardRow}</div>);
    }
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), move: 0 }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
    };
    this.movesDict = {
      0: "(1, 1)",
      1: "(2, 1)",
      2: "(3, 1)",
      3: "(1, 2)",
      4: "(2, 2)",
      5: "(3, 2)",
      6: "(1, 3)",
      7: "(2, 3)",
      8: "(3, 3)",
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  mapHistory(history) {
    return history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " - " + this.movesDict[step.move]
        : "Go to game start";
      if (this.state.stepNumber === move) {
        return (
          <li key={move}>
            <button className="active" onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });
  }

  toggleOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = this.state.ascendingOrder
      ? this.mapHistory(history)
      : this.mapHistory(history).reverse();
    let status;
    if (winner.winner) {
      status = "Winner is: " + winner.winner;
    } else if (this.state.stepNumber !== 9) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "It's a draw";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner.line}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          <button onClick={() => this.toggleOrder()}>Toggle order</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }
  return { winner: null, line: null };
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
