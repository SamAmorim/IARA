import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"
import Radio from "@mui/material/Radio"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import type { ObterContaListResponse } from "typesrc/services/pixService/ObterContaListResponse"
import { usePixContext } from "../../context/pix/pixContext"
import pixService from "../../services/pixService"
import HeaderDetail from "components/header-detail"
import { Button } from "@mui/material"
import { useNavigate } from "react-router"
import { formatMoney } from "utils/formatters/money"

export default function PixConta() {

    const navigate = useNavigate()

    const [contas, setContas] = useState<ObterContaListResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { contaOrigemSelecionada, setContaOrigemSelecionada } = usePixContext()

    useEffect(() => {
        carregarContas()
    }, [])

    async function carregarContas() {
        try {
            const data = await pixService.listarContas()
            setContas(data.content)
            setErrorMessage(null)
        } catch (err) {
            setErrorMessage('Erro ao carregar lista de contas.')
        } finally {
            setIsLoading(false)
        }
    }

    function handleSelecionarConta(conta: ObterContaListResponse) {
        setContaOrigemSelecionada({
            id: conta.id,
            nomeCliente: conta.nomeCliente,
            registroNacionalCliente: conta.registroNacionalCliente,
            saldo: conta.saldo,
        })
    }

    function handleContinue() {
        if (!contaOrigemSelecionada) return
        navigate("/pix/chave")
    }

    return (
        <>
            <HeaderDetail height={230} />
            <Box className="flex flex-col h-full">
                <Box className="flex flex-1 flex-col p-6 gap-6 h-full overflow-auto">
                    <Typography
                        variant="h1"
                        className="mb-12"
                        color="primary.contrastText"
                    >
                        De qual conta você quer transferir?
                    </Typography>

                    {errorMessage && (
                        <Alert severity="error" className="mb-4">
                            {errorMessage}
                        </Alert>
                    )}

                    {isLoading ? (
                        <Box className="flex justify-center items-center h-64">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box className="flex flex-col gap-4">
                            {contas.map((conta) => (
                                <Card
                                    key={conta.id}
                                    variant={contaOrigemSelecionada?.id === conta.id ? "outlined" : "elevation"}
                                    sx={{ cursor: "pointer", borderColor: contaOrigemSelecionada?.id === conta.id ? "primary.main" : undefined }}
                                    onClick={() => handleSelecionarConta(conta)}
                                >
                                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                                        <Radio
                                            checked={contaOrigemSelecionada?.id === conta.id}
                                            value={conta.id}
                                            color="primary"
                                            sx={{ mr: 2 }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {conta.nomeCliente}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Registro:</strong> {conta.registroNacionalCliente}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Instituição:</strong> {conta.nomeInstituicao}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Saldo:</strong> {formatMoney(conta.saldo)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
                <Box className="p-4">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className="self-baseline"
                        disabled={!contaOrigemSelecionada || isLoading || !!errorMessage}
                        onClick={handleContinue}
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