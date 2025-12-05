import { PixContext } from "context/pix/pixContext"
import { useState } from "react"
import type { IPixContext } from "typesrc/context/pix/pixContext"

export default function PixContextProvider({
    children
}: {
    children: React.ReactNode
}) {

    const [contaDestino, setContaDestino] = useState<IPixContext["contaDestino"]>({
        id: "teste",
        nomeCliente: "João da Silva",
        registroNacionalCliente: "123.456.789-00",
        nomeInstituicao: "Banco Exemplo",
        ispbInstituicao: "12345678",
    })
    const [contaOrigemSelecionada, setContaOrigemSelecionada] = useState<IPixContext["contaOrigemSelecionada"]>(undefined)
    const [resumo, setResumo] = useState<IPixContext["resumo"]>(undefined
        // {
        // isFraud: true,
        // fraudType: "triangulacaoContaLaranja",
        // fraudProbability: 0.4,
        // fraudTypeConfidence: 0.7,
        // fraudTypeProbabilities: {
        //     consolidacaoFundos: 0.4,
        //     engenhariaSocial: 0.2,
        //     : 0.05,
        //     valorAtipico: 0.006
        // }
        // isFraud: false,
        // id: "hd8237hd3-d324-d234-f43f34t5",
        // data: new Date(),
        // idFinalidadePix: 1,
        // idTipoIniciacaoPix: 1,
        // nomeClienteContaDestino: "Roberto de Souza",
        // nomeFinalidadePix: "Pix",
        // nomeInstituicaoContaDestino: "Santander",
        // nomeTipoIniciacaoPix: "Manual",
        // registroNacionalClienteContaDestino: "32********12",
        // valor: 3265.22,
        // mensagem: "Pix enviado"
        // }
    )

    return (
        <PixContext.Provider
            value={{
                contaDestino,
                setContaDestino,
                contaOrigemSelecionada,
                setContaOrigemSelecionada,
                resumo,
                setResumo,
            }}
        >
            {children}
        </PixContext.Provider>
    )
}
