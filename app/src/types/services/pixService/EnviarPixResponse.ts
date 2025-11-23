import type { FraudType } from "typesrc/enums/FraudTypes"

export interface EnviarPixSucessoResponse {
    isFraud: false
    id: string
    valor: number
    nomeClienteContaDestino: string
    registroNacionalClienteContaDestino: string
    nomeInstituicaoContaDestino: string
    idFinalidadePix: number
    nomeFinalidadePix: string
    idTipoIniciacaoPix: number
    nomeTipoIniciacaoPix: string
    data: Date
    mensagem: string
}

export interface EnviarPixErroProbabilidadesResponse {
    consolidacaoFundos: number
    engenhariaSocial: number
    triangulacaoContaLaranja: number
    valorAtipico: number
}

export interface EnviarPixErroResponse {
    isFraud: true
    fraudProbability: number
    fraudType: FraudType
    fraudTypeConfidence: number
    fraudTypeProbabilities: EnviarPixErroProbabilidadesResponse
}

export type EnviarPixResponse = EnviarPixSucessoResponse | EnviarPixErroResponse