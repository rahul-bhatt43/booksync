import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateId(prefix: string = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const getId = <T extends { _id?: string; id?: string }>(
  value?: string | T | null
): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value._id ?? value.id;
};
