package org.uam.sdm.pixapi.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.uam.sdm.pixapi.exceptions.RecursoNaoEncontradoException;
import org.uam.sdm.pixapi.exceptions.TransacaoBloqueadaException;

@ControllerAdvice
public class ExcecoesGlobalHandler {
    
    public record ErroResponse(
        String mensagem,
        Object detalhes
    ) {
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErroResponse handleGenericException(Exception ex) {
        return new ErroResponse("Ocorreu um erro inesperado.", ex.getMessage());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErroResponse handleRecursoNaoEncontradoException(RecursoNaoEncontradoException ex) {
        return new ErroResponse(ex.getMessage(), ex.getDetalhes());
    }

    @ExceptionHandler(TransacaoBloqueadaException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErroResponse handleTransacaoBloqueadaException(TransacaoBloqueadaException ex) {
        return new ErroResponse(ex.getMessage(), ex.getDetalhes());
    }
}
