'use client';

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type TimerId = "A" | "B" | "C";

const TIMER_LABELS: Record<TimerId, string> = {
  A: "Pomodoro",
  B: "Long break",
  C: "Short break",
};

interface TimerSwitcherProps {
  visibleTimer: TimerId;
  setVisibleTimer: (id: TimerId) => void;
  color: string;
  font: string;
}

export default function TimerSwitcher({
  visibleTimer,
  setVisibleTimer,
  color,
  font,
}: TimerSwitcherProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  useEffect(() => {
    const index = ["A", "B", "C"].indexOf(visibleTimer);
    const targetButton = buttonRefs.current[index];

    if (targetButton) {
      const { offsetLeft, offsetWidth } = targetButton;
      setIndicatorLeft(offsetLeft);
      setIndicatorWidth(offsetWidth);
    }
  }, [visibleTimer]);

  return (
    <div className="relative flex space-x-4 bg-c_b90 p-4 rounded-[46px] inset-shadow-2xs inset-shadow-indigo-500 ">
      {/* Sliding Background */}
      <div
        className="absolute top-0 h-[80%] rounded-4xl transition-all duration-300 mt-2"
        style={{
          left: indicatorLeft,
          width: indicatorWidth,
          backgroundColor: color,
        }}
      />

      {/* Timer Buttons */}
      {(["A", "B", "C"] as TimerId[]).map((id, index) => (
        <button
          key={id}
          ref={(el) => { buttonRefs.current[index] = el; }}
          onClick={() => setVisibleTimer(id)}
          className={clsx(
            `rounded-4xl px-5 py-2 font-bold nm-${font}-14 relative z-10 transition-colors duration-300`,
            visibleTimer === id ? "text-[#1E213F]" : "text-[#636984]"
          )}
        >
          {TIMER_LABELS[id]}
        </button>
      ))}
    </div>
  );
}
