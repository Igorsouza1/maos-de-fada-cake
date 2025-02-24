"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
}

const produtos: Produto[] = [
  { id: 1, nome: "Bolo de Chocolate", descricao: "Delicioso bolo de chocolate com cobertura cremosa", preco: 45.00, imagem: "/bolo-chocolate.jpeg" },
  { id: 2, nome: "Cupcake de Morango", descricao: "Cupcake fofinho com cobertura de morango", preco: 8.00, imagem: "/cupcake-morango.avif" },
  { id: 3, nome: "Torta de Limão", descricao: "Torta refrescante de limão com merengue", preco: 40.00, imagem: "/torta-limao.jpg" },
  { id: 4, nome: "Brigadeiro Gourmet", descricao: "Brigadeiro artesanal com chocolate belga", preco: 3.50, imagem: "/brigadeiro-gourmet.webp" },
]

export default function CardapioDigital() {
  const [carrinho, setCarrinho] = useState<Produto[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  useEffect(() => {
    // Força uma re-renderização quando o carrinho é atualizado
    if (carrinho.length > 0) {
      setCarrinhoAberto(true)
    }
  }, [carrinho])

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prevCarrinho => [...prevCarrinho, produto])
  }

  const removerDoCarrinho = (index: number) => {
    setCarrinho(prevCarrinho => prevCarrinho.filter((_, i) => i !== index))
  }

  const enviarPedido = () => {
    const numeroWhatsApp = "5567996184308"; // Altere para o número da boleira
    let mensagem = "Olá, gostaria de pedir:\n";
    carrinho.forEach(item => {
      mensagem += `- ${item.nome} (R$${item.preco.toFixed(2)})\n`;
    });
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    mensagem += `\nTotal: R$${total.toFixed(2)}`;
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  return (
      <div className="bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 min-h-screen p-4">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-pink-700 dark:text-pink-300 mb-2 font-serif">Cardapio</h1>

          <h1 className="text-4xl font-bold text-pink-700 dark:text-pink-300 mb-2 font-serif">Mãos de Fada Cake</h1>
          <p className="text-pink-600 dark:text-pink-400 italic">Delícias artesanais para adoçar seu dia</p>
        </header>

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
              <SheetDescription>
                Revise seus itens e faça seu pedido
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[70vh] mt-4">
              {carrinho.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-4 p-2 bg-pink-100 dark:bg-pink-800 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{item.nome}</h3>
                    <p className="text-sm text-pink-600 dark:text-pink-300">R${item.preco.toFixed(2)}</p>
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto) => (
            <Card key={produto.id} className="bg-white dark:bg-pink-950 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-pink-700 dark:text-pink-300">{produto.nome}</CardTitle>
                <CardDescription className="text-pink-500 dark:text-pink-4f00">{produto.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={produto.imagem || "/placeholder.svg"}
                  alt={produto.nome}
                  className="w-full h-48 object-cover rounded-md shadow-md hover:scale-105 transition-transform duration-300"
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xl font-semibold text-pink-600 dark:text-pink-300">
                  R${produto.preco.toFixed(2)}
                </span>
                <Button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Adicionar ao Carrinho
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}
