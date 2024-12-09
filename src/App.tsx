import { useEffect, useLayoutEffect } from "react";
import "./App.css";
import { useGame } from "./game/useGame";
import { getDistanceBetweenRects } from "./utils";
import { Dice } from "./Dice";

function App() {
  const { state, send } = useGame();

  console.log(state);

  useLayoutEffect(() => {
    const positionLadders = () => {
      state.board.ladders.forEach((ladder, i) => {
        const from = document.querySelector(`[data-cell-id="${ladder.from}"]`);
        const to = document.querySelector(`[data-cell-id="${ladder.to}"]`);
        const ladderId = document.querySelector(
          `[data-ladder-id="${i}"]`
        ) as HTMLDivElement;

        if (from && to && ladderId) {
          const fromRect = from.getBoundingClientRect();
          const toRect = to.getBoundingClientRect();

          const { distance, angleDegrees } = getDistanceBetweenRects(
            fromRect,
            toRect
          );

          const LADDER_HEIGHT = 40;

          ladderId.style.height = `${LADDER_HEIGHT}px`;
          ladderId.style.width = `${distance}px`;
          ladderId.style.transform = `rotate(${angleDegrees}deg)`;
          ladderId.style.left = `${fromRect.left + fromRect.width / 2}px`;
          ladderId.style.top = `${
            fromRect.top + fromRect.height / 2 - LADDER_HEIGHT / 2
          }px`;
        }
      });
    };

    const positionSnakes = () => {
      state.board.snakes.forEach((snake, i) => {
        const from = document.querySelector(`[data-cell-id="${snake.from}"]`);
        const to = document.querySelector(`[data-cell-id="${snake.to}"]`);
        const snakeId = document.querySelector(
          `[data-snake-id="${i}"]`
        ) as HTMLDivElement;

        if (from && to && snakeId) {
          const fromRect = from.getBoundingClientRect();
          const toRect = to.getBoundingClientRect();

          const { distance, angleDegrees } = getDistanceBetweenRects(
            fromRect,
            toRect
          );

          snakeId.style.width = `${distance}px`;
          snakeId.style.transform = `rotate(${angleDegrees}deg)`;
          snakeId.style.left = `${fromRect.left + fromRect.width / 2}px`;
          snakeId.style.top = `${fromRect.top + fromRect.height / 2}px`;
          const triangle = to.querySelector(".cell-triangle") as HTMLDivElement;
          if (triangle) {
            triangle.style.transform = `rotate(${90 + angleDegrees}deg)`;
          }
        }
      });
    };

    const positionBoardArtifacts = () => {
      positionLadders();
      positionSnakes();
    };

    positionBoardArtifacts();

    window.addEventListener("resize", positionBoardArtifacts);
    return () => {
      window.removeEventListener("resize", positionBoardArtifacts);
    };
  }, [state]);

  useEffect(() => {
    // p1 pos
    const checker1 = document.querySelector(
      `.checker.onboard[data-player-id="1"]`
    ) as HTMLDivElement;
    if (state.p1Pos > -1) {
      const cell = document.querySelector(
        `[data-cell-id="${state.p1Pos}"]`
      ) as HTMLDivElement;
      const cellRect = cell.getBoundingClientRect();
      const center = {
        top: cellRect.top + cellRect.height / 2,
        left: cellRect.left + cellRect.width / 2,
      };
      checker1.style.top = `${center.top}px`;
      checker1.style.left = `${center.left}px`;
    }

    // p2 pos
    const checker2 = document.querySelector(
      `.checker.onboard[data-player-id="2"]`
    ) as HTMLDivElement;
    if (state.p2Pos > -1) {
      const cell = document.querySelector(
        `[data-cell-id="${state.p2Pos}"]`
      ) as HTMLDivElement;
      const cellRect = cell.getBoundingClientRect();
      const center = {
        top: cellRect.top + cellRect.height / 2,
        left: cellRect.left + cellRect.width / 2,
      };
      checker2.style.top = `${center.top}px`;
      checker2.style.left = `${center.left}px`;
    }
  }, [state]);

  return (
    <div className="game">
      <div className="game-info">
        <div className="player-turns">
          <div data-player-id={1} data-active={state.turnPlayer === 1}>
            Player 1
          </div>
          <div data-player-id={2} data-active={state.turnPlayer === 2}>
            Player 2
          </div>
        </div>
        <div className="player-positions">
          <div>
            {state.p1Pos === -1 && (
              <div className="checker" data-player-id={1} />
            )}
          </div>
          <div>
            {state.p2Pos === -1 && (
              <div className="checker" data-player-id={2} />
            )}
          </div>
        </div>
        <div className="game-actions">
          {state.status === "waitingForRoll" && (
            <button onClick={() => send({ type: "rollDice" })}>Roll</button>
          )}
          {state.rolledDice > 0 && <Dice value={state.rolledDice} />}
        </div>
        {state.status}
      </div>
      <div className="board">
        <div className="snakes">
          {state.board.snakes.map((snake, i) => (
            <div
              className="snake"
              data-snake-id={i}
              data-from={snake.from}
              data-to={snake.to}
              key={i}
            />
          ))}
        </div>
        <div className="ladders">
          {state.board.ladders.map((ladder, i) => (
            <div
              data-ladder-id={i}
              data-from={ladder.from}
              data-to={ladder.to}
              key={i}
              className="ladder"
            />
          ))}
        </div>
        <div className="cells">
          {state.board.cells.map((cell, i) => (
            <div
              className="cell"
              data-cell-id={cell}
              key={i}
              data-connects-ladder={state.board.ladders.some(
                (ladder) => ladder.from === cell || ladder.to === cell
              )}
              // data-snake-is-end={game.board.snakes.some(
              //   (snake) => snake.to === cell
              // )}
            >
              {state.board.snakes.some((snake) => snake.to === cell) && (
                <span className="cell-triangle" />
              )}
              <span className="cell-value" data-value={cell}>
                {cell}
              </span>
            </div>
          ))}
        </div>
        {state.p1Pos > -1 && (
          <div className="checker onboard" data-player-id={1} />
        )}
        {state.p2Pos > -1 && (
          <div className="checker onboard" data-player-id={2} />
        )}
      </div>
    </div>
  );
}

export default App;
