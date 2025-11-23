package org.uam.sdm.pixapi.domain.dto.analise;

public record AnaliseApiIntegrationResponse<T>(
    Boolean success,
    String message,
    T details
) { }
