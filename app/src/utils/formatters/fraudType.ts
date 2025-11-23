import type { FraudType } from "typesrc/enums/FraudTypes"

export const fraudTypeNames: Record<FraudType, string> = {
    consolidacao_fundos: "Consolidação de fundos",
    engenharia_social: "Engenharia social",
    triangulacao_conta_laranja: "Triangulação de conta laranja",
    valor_atipico: "Valor atípico",
}

export function getFraudTypeName(type: FraudType): string {
    return fraudTypeNames[type]
}
