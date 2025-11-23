export interface EnviarPixRequest {
    valor: number
    idContaOrigem: string
    idContaDestino: string
    idFinalidadePix: number
    idTipoIniciacaoPix: number
    saldoContaOrigem: number
    mensagem?: string
}
