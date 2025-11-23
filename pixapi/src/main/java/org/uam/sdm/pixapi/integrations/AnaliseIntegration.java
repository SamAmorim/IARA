package org.uam.sdm.pixapi.integrations;

import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoDto;
import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoIntegrationResponse;
import org.uam.sdm.pixapi.domain.dto.analise.AnaliseApiIntegrationResponse;

import reactor.core.publisher.Mono;

public interface AnaliseIntegration {
    Mono<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> analisarPix(AnalisarTransacaoDto analisarTransacaoDto);
}
