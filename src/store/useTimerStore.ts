import { create } from "zustand";

export type TimerId = "A" | "B" | "C";

interface Timer {
  duration: number;
  remainingTime: number;
  playing: boolean;
  intervalId: NodeJS.Timeout | null;
}

interface TimerState {
  timers: Record<TimerId, Timer>;
  start: (id: TimerId) => void;
  stop: (id: TimerId) => void;
  reset: (id: TimerId) => void;
  updateDuration: (id: TimerId, minutes: number) => void;
  tick: (id: TimerId) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timers: {
    A: {
      duration: 25 * 60,
      remainingTime: 25 * 60,
      playing: false,
      intervalId: null,
    },
    B: {
      duration: 15 * 60,
      remainingTime: 15 * 60,
      playing: false,
      intervalId: null,
    },
    C: {
      duration: 5 * 60,
      remainingTime: 5 * 60,
      playing: false,
      intervalId: null,
    },
  },

  start: (id) => {
    const { timers, tick } = get();
    const timer = timers[id];

    if (timer.playing || timer.remainingTime <= 0) return;

    const intervalId = setInterval(() => tick(id), 1000);

    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...timer, playing: true, intervalId },
      },
    }));
  },

  stop: (id) => {
    const { timers } = get();
    const timer = timers[id];

    if (timer.intervalId) clearInterval(timer.intervalId);

    set((state) => ({
      timers: {
        ...state.timers,
        [id]: { ...timer, playing: false, intervalId: null },
      },
    }));
  },

  reset: (id) => {
    const { timers } = get();
    const timer = timers[id];

    if (timer.intervalId) clearInterval(timer.intervalId);

    set((state) => ({
      timers: {
        ...state.timers,
        [id]: {
          ...timer,
          playing: false,
          intervalId: null,
          remainingTime: timer.duration,
        },
      },
    }));
  },

  updateDuration: (id, minutes) => {
    const { timers } = get();
    const newDuration = minutes * 60;

    set((state) => ({
      timers: {
        ...state.timers,
        [id]: {
          ...timers[id],
          duration: newDuration,
          remainingTime: newDuration,
          playing: false,
          intervalId: null,
        },
      },
    }));
  },

  tick: (id) => {
    const { timers, stop } = get();
    const timer = timers[id];

    if (timer.remainingTime <= 1) {
      stop(id);
      set((state) => ({
        timers: {
          ...state.timers,
          [id]: { ...timer, remainingTime: 0 },
        },
      }));
    } else {
      set((state) => ({
        timers: {
          ...state.timers,
          [id]: { ...timer, remainingTime: timer.remainingTime - 1 },
        },
      }));
    }
  },
}));
