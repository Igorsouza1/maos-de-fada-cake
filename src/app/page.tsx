"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

export const runtime = "edge"

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
}

const produtos: Produto[] = [
  {
    id: 1,
    nome: "Bolo de Chocolate",
    descricao: "Delicioso bolo de chocolate com cobertura cremosa",
    preco: 45.0,
    imagem: "/bolo-chocolate.jpeg",
  },
  {
    id: 2,
    nome: "Cupcake de Morango",
    descricao: "Cupcake fofinho com cobertura de morango",
    preco: 8.0,
    imagem: "/cupcake-morango.avif",
  },
  {
    id: 3,
    nome: "Torta de Limão",
    descricao: "Torta refrescante de limão com merengue",
    preco: 40.0,
    imagem: "/torta-limao.jpg",
  },
  {
    id: 4,
    nome: "Brigadeiro Gourmet",
    descricao: "Brigadeiro artesanal com chocolate belga",
    preco: 3.5,
    imagem: "/brigadeiro-gourmet.webp",
  },
]

export default function CardapioDigital() {
  const [carrinho, setCarrinho] = useState<Produto[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula o processo de login
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Força uma re-renderização quando o carrinho é atualizado
    if (carrinho.length > 0) {
      setCarrinhoAberto(true)
    }
  }, [carrinho])

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, produto])
  }

  const removerDoCarrinho = (index: number) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index))
  }

  const enviarPedido = () => {
    const numeroWhatsApp = "5567996184308" // Altere para o número da boleira
    let mensagem = "Olá, gostaria de pedir:\n"
    carrinho.forEach((item) => {
      mensagem += `- ${item.nome} (R$${item.preco.toFixed(2)})\n`
    })
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0)
    mensagem += `\nTotal: R$${total.toFixed(2)}`
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-repeat"
        style={{ backgroundImage: "url('/background.PNG')" }}
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
      <div className="relative w-auto h-72 bg-repeat" style={{ backgroundImage: "url('/background.PNG')" }}>
        <div className="absolute inset-0 bg-black/10" /> {/* Overlay para melhorar legibilidade */}
        <div className="relative pt-12 pb-8 text-center">
          <h1 className={`${pacifico.className} text-5xl font-bold text-white mb-2 drop-shadow-lg`}>
            Mãos de Fada Cake
          </h1>
          <p className={`${sour_candy.className} text-white italic text-lg drop-shadow-md`}>
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
                    <div key={index} className="flex justify-between items-center mb-4 p-2 bg-pink-100 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{item.nome}</h3>
                        <p className="text-sm text-pink-600">R${item.preco.toFixed(2)}</p>
                      </div>
                      <Button variant="ghost" onClick={() => removerDoCarrinho(index)}>
                        <X className="h-4 w-4" />
                      </Button>
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
                className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={produto.imagem || "/placeholder.svg"}
                      alt={produto.nome}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className={`${pacifico.className} text-2xl font-bold text-pink-700 mb-2`}>
                    {produto.nome}
                  </CardTitle>
                  <CardDescription className={`${sour_candy.className} text-pink-500 mb-4`}>
                    {produto.descricao}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className={`${sour_candy.className} text-2xl font-semibold text-pink-600`}>
                      R${produto.preco.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => adicionarAoCarrinho(produto)}
                      className="bg-pink-500 hover:bg-pink-600 text-white transition-colors duration-300 rounded-full px-6 py-2"
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

