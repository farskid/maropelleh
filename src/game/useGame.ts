import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { Game, GameEvent } from "./Game";

export function useGame() {
  const gameRef = useRef(new Game());
  const state = useSyncExternalStore(
    gameRef.current.subscribe.bind(gameRef.current),
    gameRef.current.getSnapshot.bind(gameRef.current)
  );

  const memoState = useMemo(
    () =>
      ({
        ...state,
        winner: gameRef.current.getWinner(),
      } as const),
    [state]
  );

  const stableSend = useCallback(
    (event: GameEvent) => gameRef.current.send(event),
    []
  );

  return {
    state: memoState,
    send: stableSend,
  };
}
