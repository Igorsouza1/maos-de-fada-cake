"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import { format, addDays, isBefore } from "date-fns"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const tamanhos = [
  { id: "tradicional", nome: "Tradicional", descricao: "Rende de 15 a 20 fatias", preco: 45 },
  { id: "gigante", nome: "Gigante", descricao: "Rende de 20 a 25 fatias", preco: 80 },
]

interface Produto {
  id: string
  nome: string
  tamanho: string
  preco: number
  dataEntrega: string
  imagens: { src: string; alt: string; description: string }[]
}

interface BoloVulcaoDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloVulcaoDialog({ isOpen, onClose, onAddToCart }: BoloVulcaoDialogProps) {
  const [tamanho, setTamanho] = useState<string>("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const dataMinima = addDays(new Date(), 4)

  const handleAddToCart = () => {
    const tamanhoSelecionado = tamanhos.find((t) => t.id === tamanho)
    if (!tamanhoSelecionado) return

    const produto: Produto = {
      id: `bolo-vulcao-${Date.now()}`,
      nome: `Bolo Vulcão ${tamanhoSelecionado.nome}`,
      tamanho: tamanhoSelecionado.descricao,
      preco: tamanhoSelecionado.preco,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      imagens: [{ src: "/bolo-vulcao.jpg", alt: "Bolo Vulcão", description: `Bolo Vulcão ${tamanhoSelecionado.nome}` }],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setTamanho("")
    setDataEntrega(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-pink-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Bolo Vulcão
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha o Tamanho</h3>
            <RadioGroup value={tamanho} onValueChange={setTamanho} className="flex flex-col space-y-2">
              {tamanhos.map((t) => (
                <div key={t.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <RadioGroupItem value={t.id} id={t.id} />
                  <Label htmlFor={t.id} className={`${sour_candy.className} text-lg flex-grow`}>
                    <span className="font-semibold">{t.nome}</span>
                    <br />
                    <span className="text-sm text-gray-600">{t.descricao}</span>
                  </Label>
                  <span className="text-pink-600 font-semibold">R${t.preco.toFixed(2)}</span>
                </div>
              ))}
            </RadioGroup>
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
            disabled={!tamanho || !dataEntrega}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

