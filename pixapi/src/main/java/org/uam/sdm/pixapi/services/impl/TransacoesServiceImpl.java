package org.uam.sdm.pixapi.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoDto;
import org.uam.sdm.pixapi.domain.dto.analise.AnalisarTransacaoIntegrationResponse;
import org.uam.sdm.pixapi.domain.dto.analise.AnaliseApiIntegrationResponse;
import org.uam.sdm.pixapi.domain.dto.transacoes.EnviarPixRequestDto;
import org.uam.sdm.pixapi.domain.dto.transacoes.EnviarPixResponseDto;
import org.uam.sdm.pixapi.domain.entities.Transacao;
import org.uam.sdm.pixapi.exceptions.RecursoNaoEncontradoException;
import org.uam.sdm.pixapi.exceptions.TransacaoBloqueadaException;
import org.uam.sdm.pixapi.integrations.AnaliseIntegration;
import org.uam.sdm.pixapi.mappers.TransacoesMapper;
import org.uam.sdm.pixapi.repository.ContasRepository;
import org.uam.sdm.pixapi.repository.FinalidadesPixRepository;
import org.uam.sdm.pixapi.repository.TiposIniciacaoPixRepository;
import org.uam.sdm.pixapi.repository.TransacoesRepository;
import org.uam.sdm.pixapi.services.TransacoesService;

@Service
public class TransacoesServiceImpl implements TransacoesService {

	private final AnaliseIntegration analiseIntegration;
	private final ContasRepository contasRepository;
	private final FinalidadesPixRepository finalidadesPixRepository;
	private final TiposIniciacaoPixRepository tiposIniciacaoPixRepository;
	private final TransacoesRepository transacoesRepository;
	private final TransacoesMapper transacoesMapper;

	public TransacoesServiceImpl(
		AnaliseIntegration analiseIntegration,
		ContasRepository contasRepository,
		FinalidadesPixRepository finalidadesPixRepository,
		TiposIniciacaoPixRepository tiposIniciacaoPixRepository,
		TransacoesRepository transacoesRepository,
		TransacoesMapper transacoesMapper
	) {
		this.analiseIntegration = analiseIntegration;
		this.contasRepository = contasRepository;
		this.finalidadesPixRepository = finalidadesPixRepository;
		this.tiposIniciacaoPixRepository = tiposIniciacaoPixRepository;
		this.transacoesRepository = transacoesRepository;
		this.transacoesMapper = transacoesMapper;
	}

	@Override
	public EnviarPixResponseDto enviarPix(EnviarPixRequestDto requestDto) {
		var transacao = transacoesMapper.enviarPixRequestDtoToTransacao(requestDto);

		buscarRelacionamentosTransacao(
			transacao,
			requestDto.idContaOrigem(),
			requestDto.idContaDestino(),
			requestDto.idFinalidadePix(),
			requestDto.idTipoIniciacaoPix()
		);

		analisarTransacao(requestDto);
		
		transacao = transacoesRepository.save(transacao);
		var resposta = transacoesMapper.transacaoToEnviarPixResponseDto(transacao);
		return resposta;
	}

	private void analisarTransacao(EnviarPixRequestDto requestDto) {
		var analisarTransacaoDto = new AnalisarTransacaoDto(
			requestDto.valor(),
			LocalDateTime.now(),
			requestDto.idTipoIniciacaoPix(),
			requestDto.idFinalidadePix(),
			requestDto.saldoContaOrigem(),
			LocalDateTime.parse("2020-05-10T10:15:30"),
			1,
			1,
			LocalDateTime.parse("1985-01-15T00:00:00"),
			BigDecimal.valueOf(20.00),
			LocalDateTime.parse("2019-11-20T14:30:00"),
			1,
			1,
			LocalDateTime.parse("1990-03-22T00:00:00"),
			2,
			BigDecimal.valueOf(20.00),
			0,
			BigDecimal.valueOf(20.00),
			10,
			0,
			200,
			10,
			1,
			1,
			BigDecimal.valueOf(20.00),
			BigDecimal.valueOf(20.00)
		);

		AnaliseApiIntegrationResponse<AnalisarTransacaoIntegrationResponse> resposta;
		try {
			resposta = analiseIntegration.analisarPix(analisarTransacaoDto).block();
			if (resposta == null) {
				throw new TransacaoBloqueadaException("Erro ao comunicar com o serviço de análise de fraude");
			}
		}
		catch (Exception e) {
			throw new TransacaoBloqueadaException("Erro ao comunicar com o serviço de análise de fraude", e.getMessage());
		}
		
		if (resposta.details() != null && resposta.details().isFraud()) {
			throw new TransacaoBloqueadaException("Transação bloqueada pela análise de fraude", resposta.details());
		}
	}

	private void buscarRelacionamentosTransacao(
		Transacao transacao,
		UUID idContaOrigem,
		UUID idContaDestino,
		Integer idFinalidadePix,
		Integer idTipoIniciacaoPix
	) {

		var contaOrigem = contasRepository
				.findById(idContaOrigem)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Conta de origem não encontrada"));

		transacao.setContaOrigem(contaOrigem);

		var contaDestino = contasRepository
				.findById(idContaDestino)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Conta de destino não encontrada"));

		transacao.setContaDestino(contaDestino);

		var finalidadePix = finalidadesPixRepository
				.getReferenceById(idFinalidadePix);

		transacao.setFinalidadePix(finalidadePix);

		var tipoIniciacaoPix = tiposIniciacaoPixRepository
				.getReferenceById(idTipoIniciacaoPix);

		transacao.setTipoIniciacaoPix(tipoIniciacaoPix);
	}
}
