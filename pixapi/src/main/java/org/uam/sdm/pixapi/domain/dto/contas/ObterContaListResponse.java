package org.uam.sdm.pixapi.domain.dto.contas;

import java.math.BigDecimal;
import java.util.UUID;

public record ObterContaListResponse(
    UUID id,
    String nomeCliente,
    String registroNacionalCliente,
    String nomeInstituicao,
    BigDecimal saldo
) { }
