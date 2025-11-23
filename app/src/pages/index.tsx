import { Button } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import HeaderDetail from "components/header-detail"
import { useNavigate } from "react-router"

export default function Inicio() {

    const navigate = useNavigate()

    function handleContinue() {
        navigate("/pix")
    }

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
                        Bem-vindo à Simulação Pix!
                    </Typography>
                    <Box className="flex justify-center">
                        <img
                            src="/phone.png"
                            width={300}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className="self-baseline"
                        onClick={handleContinue}
                    >
                        Fazer Pix
                    </Button>
                </Box>
            </Box>
        </>
    )
}