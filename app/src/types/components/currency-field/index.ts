import type { TextFieldProps } from "@mui/material"

export interface CurrencyFieldProps extends Omit<TextFieldProps, "onChange" | "value"> {
    value: number,
    onChange: (value: number) => void
}