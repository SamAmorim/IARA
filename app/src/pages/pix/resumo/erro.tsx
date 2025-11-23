import { Alert, Box, Typography } from "@mui/material"
import Icon from "components/icon"
import type { PixResumoErroProps } from "typesrc/pages/pix/resumo/erro"
import { getFraudTypeName } from "utils/formatters/fraudType"
import { formatToPercentageString } from "utils/formatters/numbers"

export default function PixResumoErro({
    resumo
}: PixResumoErroProps) {

    return (
        <>
            <Alert
                icon={<Icon>dangerous</Icon>}
                severity="error"
            >
                Transferência bloqueada pela análise de fraude.
            </Alert>
            <Box className="flex flex-col gap-2">
                <Typography variant="h5">
                    Tipo de fraude
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {getFraudTypeName(resumo.fraudType)}
                </Typography>
                <Typography variant="h5">
                    Probabilidade de fraude
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudProbability)}
                </Typography>
                <Typography variant="h5">
                    Confiança
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudTypeConfidence)}
                </Typography>
                <Typography variant="h5">
                    Probabilidades
                </Typography>
                <Typography variant="h6">
                    Consolidação de fundos
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudTypeProbabilities.consolidacaoFundos)}
                </Typography>
                <Typography variant="h6">
                    Engenharia social
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudTypeProbabilities.engenhariaSocial)}
                </Typography>
                <Typography variant="h6">
                    Triangulação de conta laranja
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudTypeProbabilities.triangulacaoContaLaranja)}
                </Typography>
                <Typography variant="h6">
                    Valor atípico
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatToPercentageString(resumo.fraudTypeProbabilities.valorAtipico)}
                </Typography>
            </Box>
        </>
    )
}