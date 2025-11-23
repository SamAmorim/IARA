import { Button } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import HeaderDetail from "components/header-detail"
import { usePixContext } from "context/pix/pixContext"
import { Navigate, useNavigate } from "react-router"
import PixResumoErro from "./resumo/erro"
import PixResumoSucesso from "./resumo/sucesso"

export default function PixResumo() {

    const navigate = useNavigate()
    const { resumo } = usePixContext()

    function handleContinue() {
        navigate("/")
    }

    if (!resumo)
        return <Navigate to="/" />

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
                        Resumo da transferência
                    </Typography>
                    {resumo?.isFraud ?
                        <PixResumoErro resumo={resumo} />
                        :
                        <PixResumoSucesso resumo={resumo!} />
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
                    >
                        Voltar ao Início
                    </Button>
                </Box>
            </Box>
        </>
    )
}