import { useSyncExternalStore } from "react";

type Listener = () => void;

let dark = false;
const listeners = new Set<Listener>();

export const roomLight = {
  isDark: () => dark,
  toggle: () => {
    dark = !dark;
    listeners.forEach((l) => l());
  },
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useRoomLight(): boolean {
  return useSyncExternalStore(roomLight.subscribe, roomLight.isDark, () => false);
}
