import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string = ""): string {
  return name
    .trim()
    .split(/\s+/)
    .map((value) => value[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
] as const;

export function getAvatarColor(seed: string = "default"): string {
  const index =
    seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getColorBrightness(color: string): number {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
  }

  return 128;
}

export function isLightColor(color: string): boolean {
  return getColorBrightness(color) > 128;
}

export const DEFAULT_BOARD_BACKGROUND =
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
