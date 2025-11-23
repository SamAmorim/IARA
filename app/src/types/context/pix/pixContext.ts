import type { EnviarPixResponse } from "typesrc/services/pixService/EnviarPixResponse"

export interface IPixConta {
    id: string
    nomeCliente: string
    registroNacionalCliente: string
    ispbInstituicao?: string
    nomeInstituicao?: string
    saldo?: number
}

export interface IPixContext {
    contaDestino?: IPixConta
    setContaDestino: (conta?: IPixConta) => void
    contaOrigemSelecionada?: IPixConta
    setContaOrigemSelecionada: (conta?: IPixConta) => void
    resumo?: EnviarPixResponse
    setResumo: (resumo?: EnviarPixResponse) => void
}