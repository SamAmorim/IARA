import type { IconProps } from "typesrc/components/icon"

export default function Icon({
    className = "",
    children
}: IconProps) {

    return (
        <span className={`material-symbols-outlined ${className}`}>
            {children}
        </span>
    )
}