import { Alert, CircularProgress } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import HeaderDetail from "components/header-detail"
import { usePixContext } from "context/pix/pixContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import pixService from "services/pixService"
import { validateChavePix } from "utils/validations/index"

export default function PixChave() {

    const navigate = useNavigate()
    const { setContaDestino } = usePixContext()

    const [chavePix, setChavePix] = useState<string>("")
    const [isValid, setIsValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    async function handleContinue() {
        if (!isValid) return

        setErrorMessage("")
        setIsLoading(true)

        try {
            const response = await pixService.obterContaPorChavePix(chavePix)
            console.log("Resposta da conta Pix:", response)
            if (response && response.id) {
                setContaDestino(response)
                navigate("/pix/valor")
            }
            else {
                throw new Error("Conta não encontrada para a chave informada.")
            }
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro ao buscar a conta.")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (errorMessage)
            setErrorMessage("")

        const isValidChave = validateChavePix(chavePix)
        setIsValid(isValidChave)
    }, [chavePix])

    return (
        <>
            <HeaderDetail height={200} />
            <Box className="flex flex-col h-full">
                <Box className="flex flex-1 flex-col p-6 gap-6 h-full overflow-auto">
                    <Typography
                        variant="h1"
                        className="mb-12"
                        color="primary.contrastText"
                    >
                        Como você quer transferir?
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="E-mail, CPF ou telefone"
                        label="Digitar a chave Pix"
                        value={chavePix}
                        disabled={isLoading}
                        onChange={(e) => setChavePix(e.target.value)}
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
                        disabled={!isValid || isLoading || !!errorMessage}
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