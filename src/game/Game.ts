import { Board } from "./Board";

interface GameState {
  p1Pos: number;
  p2Pos: number;
  turnPlayer: 1 | 2;
  status: "waitingForRoll" | "finished";
  rolledDice: number;
  board: Board;
}

export type GameEvent = {
  type: "rollDice";
};

type Listener = () => void;

export class Game {
  private state: GameState = {
    p1Pos: -1, // -1 means not started
    p2Pos: -1, // -1 means not started
    turnPlayer: 1,
    status: "waitingForRoll",
    rolledDice: 0,
    board: new Board(),
  };
  private listeners: Listener[] = [];

  getWinner() {
    if (this.state.p1Pos === 100) {
      return 1;
    }
    if (this.state.p2Pos === 100) {
      return 2;
    }
    return null;
  }

  private rollAndMove() {
    // this.state.status = "rolling";
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const playerPosKey = this.state.turnPlayer === 1 ? "p1Pos" : "p2Pos";
    const isOut = this.state[playerPosKey] === -1;
    const nextTurnPlayer = playerPosKey === "p1Pos" ? 2 : 1;

    const stateUpdates = {
      ...this.state,
      rolledDice: diceValue,
    };

    if (isOut) {
      if (diceValue === 6) {
        stateUpdates[playerPosKey] = 1;
      } else {
        stateUpdates.turnPlayer = nextTurnPlayer;
      }
    } else {
      // TODO: handle when game is over
      let nextPos = this.state[playerPosKey] + diceValue;
      const sitsOnALadder = this.state.board.ladders.find(
        (ladder) => ladder.from === nextPos
      );
      if (sitsOnALadder) {
        nextPos = sitsOnALadder.to;
      }
      const isOnSnake = this.state.board.snakes.find(
        (snake) => snake.from === nextPos
      );
      if (isOnSnake) {
        nextPos = isOnSnake.to;
      }

      if (nextPos === 100) {
        stateUpdates.status = "finished";
      }
      if (nextPos <= 100) {
        stateUpdates[playerPosKey] = nextPos;
      }

      if (diceValue < 6) {
        stateUpdates.turnPlayer = nextTurnPlayer;
      }
    }

    // this.state.status = "waitingForRoll";
    this.state = stateUpdates; // Must re-assign state for useSyncExternalStore to trigger
  }

  send(event: GameEvent) {
    switch (event.type) {
      case "rollDice": {
        this.rollAndMove();
        break;
      }
    }

    this.emitChange();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  getSnapshot() {
    return this.state;
  }
}
