import { Alert, Box, Typography } from "@mui/material"
import type { PixResumoSucessoProps } from "typesrc/pages/pix/resumo/sucesso"
import { formatMoney } from "utils/formatters/money"

export default function PixResumoSucesso({
    resumo
}: PixResumoSucessoProps) {

    return (
        <>
            <Alert
                severity="success"
            >
                Transferência realizada com sucesso!
            </Alert>
            <Box className="flex flex-col gap-2">
                <Typography variant="h5">
                    ID da transferência
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.id}
                </Typography>
                <Typography variant="h5">
                    Valor
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatMoney(resumo.valor)}
                </Typography>
                <Typography variant="h5">
                    Nome do recebedor
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.nomeClienteContaDestino}
                </Typography>
                <Typography variant="h5">
                    CPF/CPNJ do recebedor
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.registroNacionalClienteContaDestino}
                </Typography>
                <Typography variant="h5">
                    Banco do recebedor
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.nomeInstituicaoContaDestino}
                </Typography>
                <Typography variant="h5">
                    Data
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.data}
                </Typography>
                <Typography variant="h5">
                    Mensagem
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.mensagem}
                </Typography>
                <Typography variant="h5">
                    Finalidade
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.nomeFinalidadePix}
                </Typography>
                <Typography variant="h5">
                    Iniciação
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {resumo.nomeTipoIniciacaoPix}
                </Typography>
            </Box>
        </>
    )
}