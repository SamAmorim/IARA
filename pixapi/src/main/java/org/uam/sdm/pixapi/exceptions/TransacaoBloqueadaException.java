package org.uam.sdm.pixapi.exceptions;

public class TransacaoBloqueadaException extends RuntimeException {

    private final Object detalhes;

    public TransacaoBloqueadaException(String mensagem) {
        super(mensagem);
        this.detalhes = null;
    }

    public TransacaoBloqueadaException(String mensagem, Object detalhes) {
        super(mensagem);
        this.detalhes = detalhes;
    }

    public Object getDetalhes() {
        return detalhes;
    }
}
