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
import { ScrollArea } from "@/components/ui/scroll-area"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const tipos = [
  { id: "simples", nome: "Simples", preco: 3.5 },
  { id: "recheado", nome: "Recheado", preco: 4.0 },
]

const recheios = ["Doce de leite", "Leite Ninho", "Brigadeiro", "Morango ao Leite"]

interface Produto {
  id: string
  nome: string
  tipo: string
  recheio?: string
  preco: number
  quantidade: number
  dataEntrega: string
  imagens: { src: string; alt: string; description: string }[]
}

interface CupcakeDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function CupcakeDialog({ isOpen, onClose, onAddToCart }: CupcakeDialogProps) {
  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState<string>("")
  const [recheio, setRecheio] = useState<string>("")
  const [quantidade, setQuantidade] = useState<string>("10")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const dataMinima = addDays(new Date(), 4)

  const handleAddToCart = () => {
    const tipoSelecionado = tipos.find((t) => t.id === tipo)
    if (!tipoSelecionado) return

    const produto: Produto = {
      id: `cupcake-${Date.now()}`,
      nome: `Cupcake ${tipoSelecionado.nome}`,
      tipo: tipoSelecionado.nome,
      recheio: tipo === "recheado" ? recheio : undefined,
      preco: tipoSelecionado.preco * Number.parseInt(quantidade),
      quantidade: Number.parseInt(quantidade),
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      imagens: [{ src: "/cupcake.jpg", alt: "Cupcake", description: `Cupcake ${tipoSelecionado.nome}` }],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setTipo("")
    setRecheio("")
    setQuantidade("10")
    setDataEntrega(undefined)
  }

  const nextStep = () => {
    if (step === 1 && Number.parseInt(quantidade) < 10) {
      return
    }
    if (step === 1 && tipo === "simples") {
      setStep(3)
    } else if (step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    if (step === 1 && (!tipo || Number.parseInt(quantidade) < 10)) return true
    if (step === 2 && tipo === "recheado" && !recheio) return true
    if (step === 3 && !dataEntrega) return true
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Cupcakes
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {step === 1 && (
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
                <div className="space-y-2">
                  <Label htmlFor="quantidade" className={`${sour_candy.className} text-lg`}>
                    Quantidade (mínimo 10 unidades)
                  </Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => {
                      const value = e.target.value
                      setQuantidade(value === "" ? "" : Math.max(0, Number.parseInt(value) || 0).toString())
                    }}
                    className="w-full"
                  />
                  <p className={`${sour_candy.className} text-sm text-pink-600`}>
                    Aviso: A quantidade mínima para pedidos de cupcakes é de 10 unidades. Pedidos com menos de 10
                    unidades não serão aceitos.
                  </p>
                </div>
              </div>
            )}
            {step === 2 && tipo === "recheado" && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha o Recheio</h3>
                <RadioGroup value={recheio} onValueChange={setRecheio} className="flex flex-col space-y-2">
                  {recheios.map((r) => (
                    <div key={r} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value={r} id={r} />
                      <Label htmlFor={r} className={`${sour_candy.className} text-lg flex-grow`}>
                        <span className="font-semibold">{r}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            {step === 3 && (
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
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 bg-white border-t">
          <div className="flex justify-between w-full">
            {step > 1 && (
              <Button onClick={prevStep} variant="outline" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                Voltar
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
                disabled={isNextDisabled()}
              >
                Avançar
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
                disabled={!dataEntrega}
              >
                Adicionar ao Carrinho
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

