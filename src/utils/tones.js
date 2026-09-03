import { C } from "../constants/theme";

export const toneMap = {
  green: { bg: C.greenSoft, fg: C.green },
  amber: { bg: C.amberSoft, fg: C.amber },
  red: { bg: C.redSoft, fg: C.red },
  blue: { bg: C.blueSoft, fg: C.blue },
  gold: { bg: C.goldSoft, fg: C.gold },
  gray: { bg: C.track, fg: C.muted },
};

export function healthTone(h) {
  if (h === "Good" || h === "Green") return "green";
  if (h === "Watch" || h === "Amber") return "amber";
  if (h === "At Risk" || h === "Red") return "red";
  return "gray";
}

export function riskTone(r) {
  if (r === "Low") return "green";
  if (r === "Medium") return "amber";
  if (r === "High" || r === "Urgent") return "red";
  return "gray";
}
