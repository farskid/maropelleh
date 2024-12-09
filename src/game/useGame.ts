import { useCallback, useRef, useSyncExternalStore } from "react";
import { Game, GameEvent } from "./Game";

export function useGame() {
  const gameRef = useRef(new Game());
  const state = useSyncExternalStore(
    gameRef.current.subscribe.bind(gameRef.current),
    gameRef.current.getSnapshot.bind(gameRef.current)
  );

  const stableSend = useCallback(
    (event: GameEvent) => gameRef.current.send(event),
    []
  );

  return {
    state,
    send: stableSend,
  };
}
