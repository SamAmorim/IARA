package org.uam.sdm.pixapi.domain.dto.analise;

public record AnalisarTransacaoIntegrationResponse(
    Boolean isFraud,
    double fraudProbability,
    String fraudType,
    double fraudTypeConfidence,
    AnalisarTransacaoProbabilitiesIntegrationResponse fraudTypeProbabilities
) {
}
