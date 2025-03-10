"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import dynamic from "next/dynamic"
import { ImageCarousel } from "@/components/image-carousel" // Import ImageCarousel
import { BoloAquarioDialog } from "@/components/bolos/bolo-aquario-dialog"
import { BoloMarmitaDialog } from "@/components/bolos/bolo-marmita-dialog"
import { DocinhosDialog } from "@/components/bolos/docinho-dialog"

const BoloRedondoDialog = dynamic(() =>
  import("@/components/bolos/bolo-redondo-dialog").then((mod) => mod.BoloRedondoDialog),
)
const BoloRetangularDialog = dynamic(() =>
  import("@/components/bolos/bolo-retangular-dialog").then((mod) => mod.BoloRetangularDialog),
)
const BoloMetroDialog = dynamic(() => import("@/components/bolos/bolo-metro-dialog").then((mod) => mod.BoloMetroDialog))
const BoloAndarDialog = dynamic(() => import("@/components/bolos/bolo-andar-dialog").then((mod) => mod.BoloAndarDialog))
const BoloAcetatoDialog = dynamic(() =>
  import("@/components/bolos/bolo-acetato-dialog").then((mod) => mod.BoloAcetatoDialog),
)
const BoloPiscinaDialog = dynamic(() =>
  import("@/components/bolos/bolo-piscina-dialog").then((mod) => mod.BoloPiscinaDialog),
)
const BoloVulcaoDialog = dynamic(() =>
  import("@/components/bolos/bolo-vulcao-dialog").then((mod) => mod.BoloVulcaoDialog),
)
const CupcakeDialog = dynamic(() => import("@/components/bolos/cupcake-dialog").then((mod) => mod.CupcakeDialog))

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

export const runtime = "edge"

interface Produto {
  id: string
  nome: string
  descricao?: string // Make descricao optional
  preco: number
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
  massa?: string
  tamanho?: string
  recheios?: string[]
  adicionais?: string[]
  dataEntrega?: string
  tipoEntrega?: "retirada" | "entrega"
  endereco?: {
    rua: string
    bairro: string
    numero: string
    complemento: string
  } | null
  observacao?: string
  quantidade?: number
  tipo?: string
  cobertura?: string // Add this for Bolo Piscina
  horario?: string // Add this line
}

const produtos: Produto[] = [
  {
    id: "1",
    nome: "Bolo Redondo",
    descricao: "Varios tipos de bolos redondos, monte o seu",
    preco: 110.0,
    imagens: [
      {
        src: "/redondo-17.jpeg",
        alt: "Bolo redondo 17cm",
        description: "Bolo redondo 17cm",
        name: "Bolo Redondo 17cm",
        price: 110.0,
      },
      {
        src: "/redondo-23.jpeg",
        alt: "Bolo redondo 23cm",
        description: "Bolo redondo 23cm",
        name: "Bolo Redondo 23cm",
        price: 180.0,
      },
      {
        src: "/redondo-28.jpeg",
        alt: "Bolo redondo 28cm",
        description: "Bolo redondo 28cm",
        name: "Bolo Redondo 28cm",
        price: 270.0,
      },
    ],
  },
  {
    id: "2",
    nome: "Bolo Retangular",
    descricao: "Bolo retangular personalizado",
    preco: 200.0,
    imagens: [
      {
        src: "/retangular-25.jpeg",
        alt: "Bolo Retangular 25cm",
        description: "Bolo Retangular 25cm",
        name: "Bolo Retangular 25cm",
        price: 200.0,
      },
      {
        src: "/retangular-33.jpeg",
        alt: "Bolo Retangular 33cm",
        description: "Bolo Retangular 33cm",
        name: "Bolo Retangular 33cm",
        price: 270.0,
      },
      {
        src: "/retangular-40.jpeg",
        alt: "Bolo Retangular 40cm",
        description: "Bolo Retangular 40cm",
        name: "Bolo Retangular 40cm",
        price: 650.0,
      },
    ],
  },
  {
    id: "3",
    nome: "Bolo de Metro",
    descricao: "Meio metro e 1 metro de bolo personalizado",
    preco: 600.0,
    imagens: [
      {
        src: "/meio-metro.jpeg",
        alt: "Bolo meio metro",
        description: "Bolo meio metro",
        name: "Bolo Meio Metro",
        price: 600.0,
      },
      {
        src: "/um-metro.jpeg",
        alt: "Bolo um metro",
        description: "Bolo um metro",
        name: "Bolo Um Metro",
        price: 900.0,
      },
    ],
  },
  {
    id: "4",
    nome: "Bolo de Andar",
    descricao: "Bolo de 2 andares render 65 a 70 fatias, de 3 andares rende 100 a 110 fatias",
    preco: 450.0,
    imagens: [
      {
        src: "/bolo-andar1.jpeg",
        alt: "Bolo 2 Andares",
        description: "Bolo de andar para casamentos e festas",
        name: "Bolo 2 Andares",
        price: 450.0,
      },
      {
        src: "/bolo-andar-1.jpeg",
        alt: "Bolo 3 Andares",
        description: "Bolo de andar para casamentos e festas",
        name: "Bolo 3 Andares",
        price: 750.0,
      },
    ],
  },
  {
    id: "5",
    nome: "Bolo no Acetato",
    descricao: "Bolo decorado em acetato para ocasiões especiais",
    preco: 120.0,
    imagens: [
      {
        src: "/bolo-acetato.jpeg",
        alt: "Bolo no Acetato",
        description: "Bolo no Acetato decorado",
        name: "Bolo no Acetato",
        price: 120.0,
      },
    ],
  },
  {
    id: "6",
    nome: "Bolo Piscina",
    descricao: "Bolo decorado",
    preco: 40.0,
    imagens: [
      {
        src: "/bolo-piscina.jpeg",
        alt: "Bolo Piscina",
        description: "Bolo piscina para festas de verão",
        name: "Bolo Piscina",
        price: 40.0,
      },
    ],
  },
  {
    id: "7",
    nome: "Bolo Vulcão",
    descricao: "Bolo com cobertura derretida simulando um vulcão",
    preco: 45.0,
    imagens: [
      {
        src: "/bolo-vulcao-1.jpeg",
        alt: "Bolo Vulcão Tradicional",
        description: "Bolo vulcão tradicional",
        name: "Bolo Vulcão Tradicional",
        price: 45.0,
      },
      {
        src: "/bolo-vulcao-2.jpeg",
        alt: "Bolo Vulcão Gigante",
        description: "Bolo vulcão gigante",
        name: "Bolo Vulcão Gigante",
        price: 80.0,
      },
    ],
  },
  {
    id: "8",
    nome: "Cupcakes",
    descricao: "Minibolos decorados individualmente",
    preco: 3.5,
    imagens: [
      {
        src: "/cupcake.jpeg",
        alt: "Cupcake Simples",
        description: "Cupcake simples",
        name: "Cupcake",
        price: 3.5,
      },
    ],
  },
  {
    id: "9",
    nome: "Bolo Aquário",
    descricao: "Bolo decorado e efeito de aquário",
    preco: 750.0,
    imagens: [
      {
        src: "/bolo-aquario-1.jpeg",
        alt: "Bolo Aquário",
        description: "Bolo decorado",
        name: "Bolo Aquário",
        price: 750.0,
      },
      {
        src: "/bolo-aquario-2.jpeg",
        alt: "Bolo Aquário Personalizado",
        description: "Bolo aquário com decorações personalizadas",
        name: "Bolo Aquário",
        price: 750.0,
      },
    ],
  },
  {
    id: "10",
    nome: "Bolo na Marmita",
    descricao: "Bolos individuais em marmita, mínimo 10 unidades",
    preco: 8.0,
    imagens: [
      {
        src: "/bolo-marmita.jpeg",
        alt: "Bolo na Marmita",
        description: "Bolo individual em marmita",
        name: "Bolo na Marmita",
        price: 8.0,
      },
    ],
  },
  {
    id: "11",
    nome: "Docinhos",
    descricao: "Brigadeiros, beijinhos e sabores especiais",
    preco: 70.0,
    imagens: [
      {
        src: "/docinho-1.jpeg",
        alt: "Docinhos Variados",
        description: "Seleção de docinhos variados",
        name: "Docinhos",
        price: 70.0,
      },
      {
        src: "/docinho-2.jpeg",
        alt: "Docinhos Variados",
        description: "Seleção de docinhos variados",
        name: "Docinhos",
        price: 70.0,
      },
      {
        src: "/docinho-3.jpeg",
        alt: "Docinhos Variados",
        description: "Seleção de docinhos variados",
        name: "Docinhos",
        price: 70.0,
      },
    ],
  },
]

export default function CardapioDigital() {
  const [carrinho, setCarrinho] = useState<Produto[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [boloRedondoDialogOpen, setBoloRedondoDialogOpen] = useState(false)
  const [boloRetangularDialogOpen, setBoloRetangularDialogOpen] = useState(false)
  const [boloMetroDialogOpen, setBoloMetroDialogOpen] = useState(false)
  const [boloAndarDialogOpen, setBoloAndarDialogOpen] = useState(false)
  const [boloAcetatoDialogOpen, setBoloAcetatoDialogOpen] = useState(false)
  const [boloPiscinaDialogOpen, setBoloPiscinaDialogOpen] = useState(false)
  const [boloVulcaoDialogOpen, setBoloVulcaoDialogOpen] = useState(false)
  const [cupcakeDialogOpen, setCupcakeDialogOpen] = useState(false)
  const [boloAquarioDialogOpen, setboloAquarioDialogOpen] = useState(false)
  const [boloMarmitaDialogOpen, setBoloMarmitaDialogOpen] = useState(false)
  const [produtoInfo, setProdutoInfo] = useState<{
    [key: string]: { name: string; price: number; description: string }
  }>({})
  const [docinhosDialogOpen, setDocinhosDialogOpen] = useState(false)

  useEffect(() => {
    // Simula o processo de login
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Força uma re-renderização quando o carrinho é atualizado
    if (carrinho.length > 0) {
      setCarrinhoAberto(true)
    }
  }, [carrinho])

  const adicionarAoCarrinho = (produto: Produto) => {
    if (produto.id === "1") {
      setBoloRedondoDialogOpen(true)
    } else if (produto.id === "2") {
      setBoloRetangularDialogOpen(true)
    } else if (produto.id === "3") {
      setBoloMetroDialogOpen(true)
    } else if (produto.id === "4") {
      setBoloAndarDialogOpen(true)
    } else if (produto.id === "5") {
      setBoloAcetatoDialogOpen(true)
    } else if (produto.id === "6") {
      setBoloPiscinaDialogOpen(true)
    } else if (produto.id === "7") {
      setBoloVulcaoDialogOpen(true)
    } else if (produto.id === "8") {
      setCupcakeDialogOpen(true)
    } else if (produto.id === "9") {
      setboloAquarioDialogOpen(true)
    } else if (produto.id === "10") {
      setBoloMarmitaDialogOpen(true)
    } else if (produto.id === "11") {
      setDocinhosDialogOpen(true)
    } else {
      setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
    }
  }

  const removerDoCarrinho = (index: number) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index))
  }

  const enviarPedido = () => {
    const numeroWhatsApp = "5567996184308" // Altere para o número da boleira
    let mensagem = "Olá, gostaria de fazer o seguinte pedido:\n\n"

    carrinho.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.nome}\n`
      mensagem += `   Preço: R$${item.preco.toFixed(2)}\n`

      if (item.massa) {
        mensagem += `   Massa: ${item.massa}\n`
      }

      if (item.tamanho) {
        mensagem += `   Tamanho: ${item.tamanho}\n`
      }

      if (item.recheios && item.recheios.length > 0) {
        mensagem += `   Recheios: ${item.recheios.join(", ")}\n`
      }

      if (item.adicionais && item.adicionais.length > 0) {
        mensagem += `   Adicionais: ${item.adicionais.join(", ")}\n`
      }

      if (item.dataEntrega) {
        mensagem += `   Data de Entrega: ${item.dataEntrega}\n`
      }

      if (item.tipoEntrega) {
        mensagem += `   Tipo de Entrega: ${item.tipoEntrega}\n`
      }

      if (item.horario) {
        mensagem += `   Horário: ${item.horario}\n`
      }

      if (item.endereco) {
        mensagem += `   Endereço de Entrega: ${item.endereco.rua}, ${item.endereco.numero}, ${item.endereco.bairro}, ${item.endereco.complemento}\n`
      }

      if (item.observacao) {
        mensagem += `   Observação: ${item.observacao}\n`
      }

      mensagem += "\n"
    })

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0)
    mensagem += `Total do Pedido: R$${total.toFixed(2)}`

    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-repeat"
        style={{ backgroundImage: "url('/backgrund.jpg')" }}
      >
        <div className="text-center">
          <h1 className={`${pacifico.className} text-4xl text-pink-900 mb-4 drop-shadow-md`}>Mãos de Fada Cake</h1>
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-pink-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background pattern section */}
      <div className="relative h-72 bg-repeat" style={{ backgroundImage: "url('/backgrund.jpg')" }}>
        {/* Camada de preto bem leve sem afetar as letras */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent" />

        <div className="relative pt-12 pb-8 text-center">
          <h1 className={`${pacifico.className} text-5xl font-bold text-white mb-2 drop-shadow-lg text-shadow-sm`}>
            Mãos de Fada Cake
          </h1>
          <p
            className={`${sour_candy.className} text-white italic text-lg bg-white bg-opacity-20 inline-block px-4 py-2 rounded-full`}
          >
            Delícias artesanais para adoçar seu dia
          </p>
        </div>
      </div>

      {/* Content section that overlaps with the background */}
      <div className="relative -mt-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Sheet open={carrinhoAberto} onOpenChange={setCarrinhoAberto}>
              <SheetTrigger asChild>
                <Button
                  className="fixed bottom-4 right-4 z-50 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg"
                  onClick={() => setCarrinhoAberto(true)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Carrinho ({carrinho.length})
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Seu Pedido</SheetTitle>
                  <SheetDescription>Revise seus itens e faça seu pedido</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[70vh] mt-4">
                  {carrinho.map((item, index) => (
                    <div key={index} className="mb-4 p-4 bg-pink-100 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.nome}</h3>
                          <p className="text-sm text-pink-600">R${item.preco.toFixed(2)}</p>
                        </div>
                        <Button variant="ghost" onClick={() => removerDoCarrinho(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.massa && <p className="text-sm mt-2">Massa: {item.massa}</p>}
                      {item.tamanho && <p className="text-sm mt-2">Tamanho: {item.tamanho}</p>}
                      {item.recheios && item.recheios.length > 0 && (
                        <p className="text-sm mt-1">Recheios: {item.recheios.join(", ")}</p>
                      )}
                      {item.adicionais && item.adicionais.length > 0 && (
                        <p className="text-sm mt-1">Adicionais: {item.adicionais.join(", ")}</p>
                      )}
                      {item.dataEntrega && <p className="text-sm mt-1">Data de Entrega: {item.dataEntrega}</p>}
                      {item.tipoEntrega && <p className="text-sm mt-1">Tipo de Entrega: {item.tipoEntrega}</p>}
                      {item.horario && <p className="text-sm mt-1">Horário: {item.horario}</p>}
                      {item.endereco && (
                        <p className="text-sm mt-1">
                          Endereço: {item.endereco.rua}, {item.endereco.numero}, {item.endereco.bairro},{" "}
                          {item.endereco.complemento}
                        </p>
                      )}
                      {item.observacao && <p className="text-sm mt-1">Observação: {item.observacao}</p>}
                    </div>
                  ))}
                </ScrollArea>
                <div className="mt-4">
                  <p className="font-bold text-lg mb-2">
                    Total: R${carrinho.reduce((sum, item) => sum + item.preco, 0).toFixed(2)}
                  </p>
                  <Button onClick={enviarPedido} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Fazer Pedido via WhatsApp
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {produtos.map((produto) => (
              <Card
                key={produto.id}
                className="bg-gradient-to-b from-white to-pink-50 mb-9 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden border border-pink-100"
              >
                <CardHeader className="p-0">
                  <ImageCarousel
                    images={produto.imagens}
                    onImageChange={(info) => setProdutoInfo({ ...produtoInfo, [produto.id]: info })}
                  />
                </CardHeader>
                <CardContent className="p-6 pt-8">
                  <CardTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 mb-3 emboss`}>
                    {produtoInfo[produto.id]?.name || produto.nome}
                  </CardTitle>
                  <CardDescription className={`${sour_candy.className} text-pink-500 mb-4`}>
                    {produto.descricao}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className={`${sour_candy.className} text-2xl font-semibold text-pink-600`}>
                      R${(produtoInfo[produto.id]?.price || produto.preco).toFixed(2)}
                    </span>
                    <Button
                      onClick={() => adicionarAoCarrinho(produto)}
                      className="bg-pink-500 hover:bg-pink-600 text-white transition-colors duration-300 rounded-full px-6 py-2"
                    >
                      Personalizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BoloRedondoDialog
        isOpen={boloRedondoDialogOpen}
        onClose={() => setBoloRedondoDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloRedondoDialogOpen(false)
        }}
      />
      <BoloRetangularDialog
        isOpen={boloRetangularDialogOpen}
        onClose={() => setBoloRetangularDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloRetangularDialogOpen(false)
        }}
      />
      <BoloMetroDialog
        isOpen={boloMetroDialogOpen}
        onClose={() => setBoloMetroDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloMetroDialogOpen(false)
        }}
      />
      <BoloAndarDialog
        isOpen={boloAndarDialogOpen}
        onClose={() => setBoloAndarDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloAndarDialogOpen(false)
        }}
      />
      <BoloAcetatoDialog
        isOpen={boloAcetatoDialogOpen}
        onClose={() => setBoloAcetatoDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloAcetatoDialogOpen(false)
        }}
      />
      <BoloPiscinaDialog
        isOpen={boloPiscinaDialogOpen}
        onClose={() => setBoloPiscinaDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto as Produto])
          setBoloPiscinaDialogOpen(false)
        }}
      />
      <BoloVulcaoDialog
        isOpen={boloVulcaoDialogOpen}
        onClose={() => setBoloVulcaoDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto as Produto])
          setBoloVulcaoDialogOpen(false)
        }}
      />
      <CupcakeDialog
        isOpen={cupcakeDialogOpen}
        onClose={() => setCupcakeDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto as Produto])
          setCupcakeDialogOpen(false)
        }}
      />
      <BoloAquarioDialog
        isOpen={boloAquarioDialogOpen}
        onClose={() => setboloAquarioDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setboloAquarioDialogOpen(false)
        }}
      />
      <BoloMarmitaDialog
        isOpen={boloMarmitaDialogOpen}
        onClose={() => setBoloMarmitaDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setBoloMarmitaDialogOpen(false)
        }}
      />
      <DocinhosDialog
        isOpen={docinhosDialogOpen}
        onClose={() => setDocinhosDialogOpen(false)}
        onAddToCart={(produto) => {
          setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
          setDocinhosDialogOpen(false)
        }}
      />
    </div>
  )
}

