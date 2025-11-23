import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#e1173f",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#b81570",
            contrastText: "#ffffff"
        },
        background: {
            default: "#ffffff",
            paper: "#f0f1f5"
        },
        text: {
            primary: "#535353",
            secondary: "#47484c"
        },
        info: {
            main: "#ffffff",
            contrastText: "#b81570"
        }
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        h1: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h2: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h3: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h4: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1.25rem",
            fontWeight: 600,
        },
        h5: {
            fontSize: "1.2rem",
            fontFamily: 'Ubuntu, sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontSize: "1rem",
            fontFamily: 'Ubuntu, sans-serif',
            fontWeight: 600,
        },
        body1: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1rem",
        },
        button: {
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: 600,
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "100px",
                },
            }
        },
        MuiCircularProgress: {
            defaultProps: {
                size: "1.5rem",
            },
        },
    }
})

export default theme