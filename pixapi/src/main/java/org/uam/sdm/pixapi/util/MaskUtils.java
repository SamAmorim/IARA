package org.uam.sdm.pixapi.util;

import org.uam.sdm.pixapi.domain.entities.Cliente;
import org.uam.sdm.pixapi.domain.enums.NaturezaJuridica;

/**
 * Utility methods for masking and formatting sensitive fields.
 */
public final class MaskUtils {

    private MaskUtils() {}

    /**
     * Returns the registroNacional masked with '*' leaving only the first 2 and last 2
     * characters visible when the cliente's natureza indicates a Pessoa Física.
     * If not a Pessoa Física, returns the original registro.
     */
    public static String maskRegistro(Cliente cliente) {
        if (cliente == null) return null;
        var registro = cliente.getRegistroNacional();
        if (registro == null) return null;

        var naturezaEntity = cliente.getNatureza();
        if (naturezaEntity != null) {
            Integer naturezaId = naturezaEntity.getId();
            String naturezaNome = naturezaEntity.getNome();

            if (naturezaNome != null && naturezaNome.equalsIgnoreCase(NaturezaJuridica.PESSOAFISICA.name())) {
                return maskString(registro);
            }

            int ord = NaturezaJuridica.PESSOAFISICA.ordinal();
            if (naturezaId != null && (naturezaId == ord || naturezaId == ord + 1)) {
                return maskString(registro);
            }
        }

        return registro;
    }

    private static String maskString(String s) {
        if (s == null) return null;
        s = s.trim();
        int len = s.length();
        if (len <= 4) {
            return s;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(s, 0, 2);
        for (int i = 0; i < len - 4; i++) sb.append('*');
        sb.append(s, len - 2, len);
        return sb.toString();
    }
}
