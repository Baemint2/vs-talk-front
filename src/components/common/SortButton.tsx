import React, {memo} from "react";
import { cn } from "@/lib/utils.ts"

type SortButtonProps = {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
};
export const SortButton = memo(({active, onClick, children}: SortButtonProps) => (
    <button
        role="radio"
        aria-checked={active}
        onClick={onClick}
        className={cn(
            "px-4 py-2 text-sm rounded-lg transition-colors",
            active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        )}
    >
        {children}
    </button>
));
