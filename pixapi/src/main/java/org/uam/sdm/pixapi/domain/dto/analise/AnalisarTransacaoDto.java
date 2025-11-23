package org.uam.sdm.pixapi.domain.dto.analise;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AnalisarTransacaoDto(
    BigDecimal valorTransacao,
    LocalDateTime dataTransacao,
    int tipoIniciacaoPixId,
    int finalidadePixId,
    BigDecimal pagadorSaldo,
    LocalDateTime pagadorContaAbertaEm,
    int pagadorTipoContaId,
    int pagadorNaturezaId,
    LocalDateTime pagadorDataNascimento,
    BigDecimal recebedorSaldo,
    LocalDateTime recebedorContaAbertaEm,
    int recebedorTipoContaId,
    int recebedorNaturezaId,
    LocalDateTime recebedorDataNascimento,
    int pagadorTxsUltimas24h,
    BigDecimal pagadorValorUltimas24h,
    int recebedorTxsUltima1h,
    BigDecimal recebedorValorUltima1h,
    int pagadorSegundosDesdeUltimaTx,
    int primeiraInteracao,
    int pagadorInteracoesComRecebedor,
    int recebedorNumPagadoresUnicos24h,
    int recebedorIdadeContaDias,
    int pagadorIdadeContaDias,
    BigDecimal valorVsMediaPagador30d,
    BigDecimal valorVsSaldoPagador
) {}
