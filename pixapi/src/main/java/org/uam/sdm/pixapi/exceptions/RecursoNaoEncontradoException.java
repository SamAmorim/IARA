package org.uam.sdm.pixapi.exceptions;

public class RecursoNaoEncontradoException extends RuntimeException {

    // Campo para detalhes da exceção
    private final Object detalhes;

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
        this.detalhes = null;
    }

    public RecursoNaoEncontradoException(String mensagem, Object detalhes) {
        super(mensagem);
        this.detalhes = detalhes;
    }

    public Object getDetalhes() {
        return detalhes;
    }
}
