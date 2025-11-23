package org.uam.sdm.pixapi.integrations.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoDto;
import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoIntegrationResponse;
import org.uam.sdm.pixapi.domain.dto.analise.AnaliseApiIntegrationResponse;
import org.uam.sdm.pixapi.integrations.AnaliseIntegration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import reactor.core.publisher.Mono;

@Component
public class AnaliseIntegrationImpl implements AnaliseIntegration {

    private final WebClient webClient;

    @Value("${integration.analiseapi.url}")
    private String analiseApiUrl;

    public AnaliseIntegrationImpl(WebClient.Builder webClientBuilder) {
        ObjectMapper objectMapper = new ObjectMapper()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

        Jackson2JsonEncoder jsonEncoder = new Jackson2JsonEncoder(objectMapper);
        Jackson2JsonDecoder jsonDecoder = new Jackson2JsonDecoder(objectMapper);

        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer -> {
                    configurer.defaultCodecs().jackson2JsonEncoder(jsonEncoder);
                    configurer.defaultCodecs().jackson2JsonDecoder(jsonDecoder);
                })
                .build();

        this.webClient = webClientBuilder
                .baseUrl("http://localhost:7071/api")
                .exchangeStrategies(exchangeStrategies)
                .build();
    }

    @Override
    public Mono<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> analisarPix(
            AnalisarTransacaoDto analisarTransacaoDto) {

        ParameterizedTypeReference<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> typeRef = new ParameterizedTypeReference<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>>() {
        };

        Mono<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> resultado = webClient.post()
                .uri("/fazer_analise")
                .bodyValue(analisarTransacaoDto)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    return response.bodyToMono(AnaliseApiIntegrationResponse.class).flatMap(errorBody -> {
                        return Mono.error(new RuntimeException("Erro na análise: " + errorBody));
                    });
                })
                .bodyToMono(typeRef);

        return resultado;
    }
}
