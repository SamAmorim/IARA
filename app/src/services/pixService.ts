import type { AxiosError } from "axios"
import type { PageResponse } from "typesrc/services/PageResponse"
import type { EnviarPixRequest } from "typesrc/services/pixService/EnviarPixRequest"
import type { EnviarPixResponse } from "typesrc/services/pixService/EnviarPixResponse"
import type { ObterContaListResponse } from "typesrc/services/pixService/ObterContaListResponse"
import type { ObterContaPorChavePixResponse } from "typesrc/services/pixService/ObterContaPorChavePixResponse"
import API from "./api"

function isFraudResponse(error: unknown): error is AxiosError & { response: { data: { detalhes?: { isFraud: boolean } } } } {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as any).isAxiosError === true &&
        'response' in error &&
        (error as any).response?.data?.detalhes?.isFraud === true
    )
}

function isAxiosErrorWithResponse(error: unknown): error is AxiosError & { response: { data: { mensagem?: string } } } {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as any).isAxiosError === true &&
        'response' in error
    )
}

async function enviarPix(request: EnviarPixRequest): Promise<EnviarPixResponse> {
    try {
        const { data } = await API.pixApi.post<EnviarPixResponse>('/transacoes/pix', request)
        return data
    }
    catch (error: unknown) {
        console.error("Erro ao enviar Pix:", error)

        if (isFraudResponse(error)) {
            return error.response.data.detalhes as EnviarPixResponse
        }

        if (isAxiosErrorWithResponse(error) && error.response.data?.mensagem) {
            throw new Error(error.response.data.mensagem)
        }

        throw new Error('Erro ao enviar Pix. Por favor, tente novamente.')
    }
}

async function obterContaPorChavePix(chavePix: string): Promise<ObterContaPorChavePixResponse> {
    try {
        const { data } = await API.pixApi.get<ObterContaPorChavePixResponse>(`/contas/chavePix/${encodeURIComponent(chavePix)}`)
        return data
    }
    catch (error: unknown) {
        if (isAxiosErrorWithResponse(error)) {
            if (error.response.status === 404) {
                throw new Error('Conta não encontrada para a chave informada.')
            }

            if (error.response.data?.mensagem) {
                throw new Error(error.response.data.mensagem)
            }
        }

        throw new Error('Erro ao obter conta por chave Pix.')
    }
}

async function listarContas(): Promise<PageResponse<ObterContaListResponse>> {
    try {
        const { data } = await API.pixApi.get<PageResponse<ObterContaListResponse>>('/contas')
        return data
    }
    catch (error: unknown) {
        console.error("Erro ao listar contas:", error)

        if (isAxiosErrorWithResponse(error) && error.response.data?.mensagem) {
            throw new Error(error.response.data.mensagem)
        }

        throw new Error('Erro ao obter lista de contas.')
    }
}

export default {
    enviarPix,
    obterContaPorChavePix,
    listarContas,
}