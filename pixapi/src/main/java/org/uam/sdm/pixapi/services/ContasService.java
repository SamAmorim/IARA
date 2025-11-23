package org.uam.sdm.pixapi.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.uam.sdm.pixapi.domain.dto.contas.ObterContaPorChavePixResponse;
import org.uam.sdm.pixapi.domain.dto.contas.ObterContaListResponse;

public interface ContasService {
    ObterContaPorChavePixResponse obterPorChavePix(String chavePix);

    Page<ObterContaListResponse> listar(Pageable pageable);
}
