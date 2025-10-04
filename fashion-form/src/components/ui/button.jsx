import React from "react"
import { cn } from "@/lib/utils"

export function Button({ className, variant = "outline", size = "icon", ...props }) {
    const base = "inline-flex items-center justify-center rounded-md border transition"
    const variants = {
        outline: "bg-transparent border-white/30 text-white hover:border-white/60",
        solid: "bg-white text-black border-transparent hover:opacity-90",
    }
    const sizes = { icon: "h-8 w-8 p-0", md: "h-10 px-4" }
    return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
