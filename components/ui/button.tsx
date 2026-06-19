import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary" | "secondary" | "ghost" }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => <button ref={ref} className={cn("inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt disabled:pointer-events-none disabled:opacity-50", variant === "primary" && "bg-ink text-white hover:bg-black/80", variant === "secondary" && "border border-black/10 bg-white text-ink hover:bg-black/[.03]", variant === "ghost" && "text-ink hover:bg-black/5", className)} {...props} />);
Button.displayName = "Button";
