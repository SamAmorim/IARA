import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Icon from "components/icon"
import { useMatches, useNavigate } from "react-router"
import type { RouteLoaderData, RouteMatch } from "typesrc/pages"

export default function Header() {

    const navigate = useNavigate()
    const matches = useMatches() as RouteMatch[]

    const activePage = matches.at(-1)
    const data = activePage?.loaderData

    const title = typeof activePage?.handle.title === "function"
        ? activePage?.handle?.title(data as RouteLoaderData)
        : activePage?.handle?.title || ""

    const showBackButton = activePage?.handle.showBackButton !== false

    return (
        <Box
            component="header"
            bgcolor="primary.main"
            className="flex w-full h-18 justify-between items-center p-4 gap-4"
        >
            <Box className="w-16">
                {showBackButton &&
                    <IconButton
                        onClick={() => navigate(-1)}
                    >
                        <Icon className="text-white">
                            chevron_left
                        </Icon>
                    </IconButton>
                }
            </Box>
            <Typography
                component="h1"
                color="primary.contrastText"
                variant="h4"
                className="w-full text-center"
            >
                {title}
            </Typography>
            <Box className="w-16">
            </Box>
        </Box>
    )
}