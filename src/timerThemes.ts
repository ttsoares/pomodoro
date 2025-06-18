export type TimerThemeId = "blue" | "red" | "purple";

export const timerThemes: Record<
  TimerThemeId,
  {
    background: string;
    text: string;
    hoverText: string;
    progressColor: string;
    trailColor: string;
  }
> = {
  blue: {
    background: "bg-[#70F3F8]",
    text: "text-[#70F3F8]",
    hoverText: "hover:text-[#70F3F8]",
    progressColor: "#70F3F8",
    trailColor: "#0E1323",
  },
  red: {
    background: "bg-[#F87070]",
    text: "text-[#F87070]",
    hoverText: "hover:text-[#F87070]",
    progressColor: "#F87070",
    trailColor: "#0E1323",
  },
  purple: {
    background: "bg-[#D881F8]",
    text: "text-[#D881F8]",
    hoverText: "hover:text-[#D881F8]",
    progressColor: "#D881F8",
    trailColor: "#0E1323",
  },
};
