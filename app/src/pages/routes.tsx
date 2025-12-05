import DefaultLayout from "components/layout/default"
import { createBrowserRouter } from "react-router"
import type { RouteHandle } from "typesrc/pages"
import PixConta from "./pix/conta"
import PixChave from "./pix/chave"
import PixResumo from "./pix/resumo"
import PixValor from "./pix/valor"
import Inicio from "."

const routes = createBrowserRouter([
    {
        Component: DefaultLayout,
        children: [
            {
                index: true,
                Component: Inicio,
                handle: {
                    title: "IARA",
                    showBackButton: false,
                } as RouteHandle,
                path: "/",
            },
            {
                path: "/pix",
                children: [
                    {
                        index: true,
                        Component: PixConta,
                        handle: {
                            title: "Pix"
                        } as RouteHandle,
                        path: "/pix",
                    },
                    {
                        Component: PixChave,
                        handle: {
                            title: "Pix"
                        } as RouteHandle,
                        path: "/pix/chave",
                    },
                    {
                        Component: PixValor,
                        handle: {
                            title: "Pix"
                        } as RouteHandle,
                        path: "/pix/valor",
                    },
                    {
                        Component: PixResumo,
                        handle: {
                            title: "Pix"
                        } as RouteHandle,
                        path: "/pix/resumo",
                    },
                ]
            },
        ]
    }
])

export default routes