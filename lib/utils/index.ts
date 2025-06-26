import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getAvatarOrFallback(
  name?: string | null,
  avatar?: string | null
): string {
  if (avatar) return avatar
  if (name) return name.charAt(0).toUpperCase()
  return "U"
}

export function checkIsActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/")
}
