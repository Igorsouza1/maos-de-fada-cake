"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import { format, addDays, isBefore } from "date-fns"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const tipos = [
  { id: "simples", nome: "Simples", preco: 3.5 },
  { id: "recheado", nome: "Recheado", preco: 4.0 },
]

interface Produto {
  id: string
  nome: string
  tipo: string
  preco: number
  quantidade: number
  dataEntrega: string
  imagens: { src: string; alt: string; description: string }[]
}

interface NakedCakeDialog {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function NakedCakeDialog({ isOpen, onClose, onAddToCart }: NakedCakeDialog) {
  const [tipo, setTipo] = useState<string>("")
  const [quantidade, setQuantidade] = useState<number>(1)
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const dataMinima = addDays(new Date(), 4)

  const handleAddToCart = () => {
    const tipoSelecionado = tipos.find((t) => t.id === tipo)
    if (!tipoSelecionado) return

    const produto: Produto = {
      id: `cupcake-${Date.now()}`,
      nome: `Cupcake ${tipoSelecionado.nome}`,
      tipo: tipoSelecionado.nome,
      preco: tipoSelecionado.preco * quantidade,
      quantidade: quantidade,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      imagens: [{ src: "/cupcake.jpg", alt: "Cupcake", description: `Cupcake ${tipoSelecionado.nome}` }],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setTipo("")
    setQuantidade(1)
    setDataEntrega(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-pink-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Cupcakes
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha o Tipo</h3>
            <RadioGroup value={tipo} onValueChange={setTipo} className="flex flex-col space-y-2">
              {tipos.map((t) => (
                <div key={t.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <RadioGroupItem value={t.id} id={t.id} />
                  <Label htmlFor={t.id} className={`${sour_candy.className} text-lg flex-grow`}>
                    <span className="font-semibold">{t.nome}</span>
                  </Label>
                  <span className="text-pink-600 font-semibold">R${t.preco.toFixed(2)}</span>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantidade" className={`${sour_candy.className} text-lg`}>
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Data de Entrega</h3>
            <p className={`${sour_candy.className} text-sm text-center text-pink-500`}>
              Selecione uma data com pelo menos 4 dias de antecedência
            </p>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={dataEntrega}
                onSelect={setDataEntrega}
                disabled={(date) => isBefore(date, dataMinima)}
                className="rounded-md border shadow"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center bg-white p-4 border-t">
          <Button
            onClick={handleAddToCart}
            className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
            disabled={!tipo || !dataEntrega}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

