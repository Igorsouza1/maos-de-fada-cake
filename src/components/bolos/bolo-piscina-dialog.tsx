"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Pacifico, Sour_Gummy as Sour_Candy } from 'next/font/google'
import { format, addDays, isBefore } from "date-fns"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

interface Produto {
  id: number | string
  nome: string
  descricao?: string
  preco: number
  imagem?: string
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
}


interface BoloPiscinaDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloPiscinaDialog({ isOpen, onClose, onAddToCart }: BoloPiscinaDialogProps) {
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const dataMinima = addDays(new Date(), 4)

  const handleAddToCart = () => {
    const produto = {
      id: `bolo-piscina-${Date.now()}`,
      nome: "Bolo Piscina",
      tamanho: "Rende de 15 a 20 fatias",
      preco: 40.0,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
    }
    onAddToCart(produto)
    onClose()
    setDataEntrega(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-pink-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Bolo Piscina
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className={`${sour_candy.className} text-lg text-pink-600 text-center`}>
            Rende de 15 a 20 fatias
          </p>
          <p className={`${sour_candy.className} text-xl font-semibold text-pink-700 text-center`}>
            Preço: R$40,00
          </p>
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
            disabled={!dataEntrega}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
