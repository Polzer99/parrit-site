import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Planifier un entretien",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-10 px-6 overflow-hidden",
                "bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-700",
                "text-white font-medium",
                "transition-all duration-300",
                "hover:scale-105 hover:shadow-lg hover:shadow-amber-700/25",
                "active:scale-95",
                className
            )}
            {...props}
        >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-700 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
                {label}
            </span>
        </Button>
    );
}
