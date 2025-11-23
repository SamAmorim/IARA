import { InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import type { CurrencyFieldProps } from "typesrc/components/currency-field"

const intl = new Intl.NumberFormat("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

export default function CurrencyField({
    value,
    onChange,
    ...props
}: CurrencyFieldProps) {

    const [text, setText] = useState<string>("")

    function handleChange(val: string) {
        val = val.replace(/[^\d]/g, '')
        var number = Number(val) / 100
        if (isNaN(number) || val === "")
            number = 0
        onChange(number)
    }

    useEffect(() => {
        setText(intl.format(value))
    }, [value])

    return (
        <TextField
            {...props}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            slotProps={{
                input: {
                    startAdornment:
                        <InputAdornment position="start">
                            <Typography>
                                R$
                            </Typography>
                        </InputAdornment>
                }
            }}
        />
    )
}