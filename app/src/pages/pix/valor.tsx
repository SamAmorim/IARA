import { Alert, CircularProgress, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import CurrencyField from "components/currency-field"
import HeaderDetail from "components/header-detail"
import Icon from "components/icon"
import { usePixContext } from "context/pix/pixContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import pixService from "services/pixService"
import type { EnviarPixRequest } from "typesrc/services/pixService/EnviarPixRequest"
import { formatMoney } from "utils/formatters/money"

export default function PixValor() {

    const navigate = useNavigate()
    const { contaOrigemSelecionada, contaDestino, setResumo } = usePixContext()

    const [isValid, setIsValid] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pixRequest, setPixRequest] = useState<EnviarPixRequest>({
        idContaDestino: contaDestino?.id || "",
        idContaOrigem: contaOrigemSelecionada?.id || "",
        idFinalidadePix: 0,
        idTipoIniciacaoPix: 5,
        saldoContaOrigem: contaOrigemSelecionada?.saldo || 0,
        valor: 0,
    })

    async function handleContinue() {
        if (!isValid) return

        setErrorMessage("")
        setIsLoading(true)

        try {
            const data = await pixService.enviarPix(pixRequest)
            setResumo(data)
            navigate("/pix/resumo")
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro ao processar o Pix.")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (errorMessage)
            setErrorMessage("")

        setIsValid(
            pixRequest.valor > 0 &&
            pixRequest.valor <= (contaOrigemSelecionada?.saldo || 0) &&
            pixRequest.idFinalidadePix > 0 &&
            pixRequest.idTipoIniciacaoPix > 0
        )
    }, [pixRequest])

    return (
        <>
            <HeaderDetail />
            <Box className="flex flex-col h-full">
                <Box className="flex flex-col p-4 gap-6 h-full overflow-y-auto">
                    <Link color="primary.contrastText">
                        <Icon className="text-[length:inherit]!">info</Icon> Horários, limites e outras informações.
                    </Link>
                    <Card className="flex overflow-visible">
                        <CardMedia className="flex items-center p-4">
                            <Avatar className="bg-green-100">
                                <Icon className="text-green-500">
                                    attach_money
                                </Icon>
                            </Avatar>
                        </CardMedia>
                        <CardContent className="flex flex-col">
                            <Typography>
                                Pix para: <span className="font-semibold">{contaDestino?.nomeCliente}</span>
                            </Typography>
                            <Typography>
                                CPF/CNPJ: <span className="font-semibold">{contaDestino?.registroNacionalCliente}</span>
                            </Typography>
                            <Typography>
                                Instituição: <span className="font-semibold">{contaDestino?.nomeInstituicao}</span>
                            </Typography>
                        </CardContent>
                    </Card>
                    <Typography variant="h4">
                        Escolha o valor
                    </Typography>
                    <CurrencyField
                        fullWidth
                        placeholder="Valor em R$"
                        label="Valor"
                        value={pixRequest.valor}
                        onChange={(value) => {
                            console.log(value)
                            setPixRequest({
                                ...pixRequest,
                                valor: value
                            })
                        }}
                    />
                    <Typography>
                        Saldo disponível: <span className="font-semibold"> {formatMoney(contaOrigemSelecionada?.saldo || 0)} </span>
                    </Typography>
                    <Typography variant="h5">
                        Finalidade
                    </Typography>
                    <Box className="flex flex-col gap-4">
                        <RadioGroup
                            value={pixRequest.idFinalidadePix}
                            onChange={(e) => setPixRequest({
                                ...pixRequest,
                                idFinalidadePix: Number(e.target.value)
                            })}
                        >
                            <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label="Pix"
                            />
                            <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="Pix Saque"
                            />
                            <FormControlLabel
                                value={4}
                                control={<Radio />}
                                label="Pix Troco"
                            />
                        </RadioGroup>
                    </Box>
                    <Typography variant="h5">
                        Descrição
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Descrição"
                        label="Adicionar descrição (opcional)"
                        rows={4}
                        multiline
                    />
                    {errorMessage &&
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    }
                </Box>
                <Box className="p-4">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className="self-baseline"
                        onClick={handleContinue}
                        disabled={!isValid || isLoading || !!errorMessage}
                    >
                        {isLoading ?
                            <CircularProgress />
                            :
                            "Continuar"
                        }
                    </Button>
                </Box>
            </Box>
        </>
    )
}