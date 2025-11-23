import { createContext, useContext } from "react"
import type { IPixContext } from "typesrc/context/pix/pixContext"

export const PixContext = createContext<IPixContext>({
    contaDestino: undefined,
    setContaDestino: () => { },
    contaOrigemSelecionada: undefined,
    setContaOrigemSelecionada: () => { },
    resumo: undefined,
    setResumo: () => { },
})

export const usePixContext = () => useContext(PixContext)
