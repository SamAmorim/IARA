package org.uam.sdm.pixapi.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.uam.sdm.pixapi.domain.dto.contas.ObterContaPorChavePixResponse;
import org.uam.sdm.pixapi.domain.dto.contas.ObterContaListResponse;
import org.uam.sdm.pixapi.domain.entities.Conta;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ContasMapper {

    @Mapping(target = "nomeCliente", source = "cliente.nome")
    @Mapping(target = "registroNacionalCliente", expression = "java(org.uam.sdm.pixapi.util.MaskUtils.maskRegistro(conta.getCliente()))")
    @Mapping(target = "ispbInstituicao", source = "instituicao.ispb")
    @Mapping(target = "nomeInstituicao", source = "instituicao.nome")
    ObterContaPorChavePixResponse contaToObterContaPorChavePixResponse(Conta conta);

    @Mapping(target = "nomeCliente", source = "cliente.nome")
    @Mapping(target = "registroNacionalCliente", expression = "java(org.uam.sdm.pixapi.util.MaskUtils.maskRegistro(conta.getCliente()))")
    @Mapping(target = "nomeInstituicao", source = "instituicao.nome")
    ObterContaListResponse contaToObterContaListResponse(Conta conta);
}
