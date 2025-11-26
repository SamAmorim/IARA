package org.uam.sdm.pixapi.integrations.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
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
    private final String analiseApiKey;

    public AnaliseIntegrationImpl(
        WebClient.Builder webClientBuilder,
        @Value("${integration.analiseapi.url}") String analiseApiUrl,
        @Value("${integration.analiseapi.key}") String analiseApiKey
    ) {
        this.analiseApiKey = analiseApiKey;

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
                .baseUrl(analiseApiUrl)
                .exchangeStrategies(exchangeStrategies)
                .build();
    }

    @Override
    public Mono<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> analisarPix(
            AnalisarTransacaoDto analisarTransacaoDto) {

        ParameterizedTypeReference<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> typeRef = new ParameterizedTypeReference<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>>() {
        };

        Mono<AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse>> resultado = webClient.post()
                .uri("/analisar")
                .header("x-functions-key", analiseApiKey)
                .bodyValue(analisarTransacaoDto)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    return response.bodyToMono(String.class).flatMap(errorBody -> {
                        System.err.println("Erro na integração com o serviço de análise:  " + errorBody);
                        return Mono.error(new RuntimeException("Erro na análise: " + errorBody));
                    });
                })
                .bodyToMono(typeRef);

        return resultado;
    }
}
