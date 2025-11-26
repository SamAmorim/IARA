import { Button, Link } from "@mui/material"
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
            <HeaderDetail height={350} />
            <Box className="flex flex-col h-full">
                <Box className="flex flex-1 flex-col p-6 gap-6 h-full overflow-auto">
                    <img
                        src="/images/icon-white.svg"
                        alt="IARA"
                        width={80}
                        className="self-center"
                    />
                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            color="primary.contrastText"
                            className="text-center mb-2"
                        >
                            Bem-vindo ao projeto IARA!
                        </Typography>
                        <Typography
                            variant="h2"
                            color="primary.contrastText"
                            className="text-center text-sm mb-8"
                        >
                            Inteligência Antifraude e Risco Automatizada
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                    >
                        O IARA é um sistema robusto e desacoplado capaz de detectar fraudes em transações Pix em tempo real utilizando uma arquitetura de Inteligência Artificial em cascata.
                    </Typography>
                    <Box>
                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            Saiba mais:
                        </Typography>
                        <Link variant="caption" href="https://samamorim.github.io/Fraud-Finder-Pix/" className="flex items-center flex-col">
                            <img
                                src="/images/code.png"
                                width={100}
                                alt="Código"
                                className="self-center"
                            />
                            https://samamorim.github.io/Fraud-Finder-Pix/
                        </Link>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className="self-baseline"
                        onClick={handleContinue}
                    >
                        Iniciar simulação
                    </Button>
                </Box>
            </Box>
        </>
    )
}