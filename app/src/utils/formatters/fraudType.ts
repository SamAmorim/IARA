import type { FraudType } from "typesrc/enums/FraudTypes"

export const fraudTypeNames: Record<FraudType, string> = {
    consolidacaoFundos: "Consolidação de fundos",
    engenhariaSocial: "Engenharia social",
    triangulacaoContaLaranja: "Triangulação de conta laranja",
    valorAtipico: "Valor atípico",
}

export function getFraudTypeName(type: FraudType): string {
    return fraudTypeNames[type]
}
