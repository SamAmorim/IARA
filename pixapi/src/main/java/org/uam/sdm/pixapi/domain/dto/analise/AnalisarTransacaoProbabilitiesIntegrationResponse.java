package org.uam.sdm.pixapi.domain.dto.analise;

public record AnalisarTransacaoProbabilitiesIntegrationResponse(
    double consolidacaoFundos,
    double engenhariaSocial,
    double triangulacaoContaLaranja,
    double valorAtipico
) { }
