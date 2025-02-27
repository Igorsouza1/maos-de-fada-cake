"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import { format, addDays, isBefore } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const massas = ["Chocolate", "Cenoura", "Baunilha"]
const coberturas = ["Chocolate", "Leite Ninho", "Mousse de Maracujá"]

interface Produto {
  id: string
  nome: string
  tamanho: string
  massa: string
  cobertura: string
  preco: number
  dataEntrega: string
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
}

interface BoloPiscinaDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloPiscinaDialog({ isOpen, onClose, onAddToCart }: BoloPiscinaDialogProps) {
  const [step, setStep] = useState(1)
  const [massa, setMassa] = useState<string>("")
  const [cobertura, setCobertura] = useState<string>("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const dataMinima = addDays(new Date(), 4)

  const handleAddToCart = () => {
    const produto: Produto = {
      id: `bolo-piscina-${Date.now()}`,
      nome: "Bolo Piscina",
      tamanho: "Rende de 15 a 20 fatias",
      massa: massa,
      cobertura: cobertura,
      preco: 40.0,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      imagens: [
        {
          src: "/bolo-piscina.jpg",
          alt: "Bolo Piscina",
          description: "Bolo piscina para festas de verão",
          name: "Bolo Piscina",
          price: 40.0,
        },
      ],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setMassa("")
    setCobertura("")
    setDataEntrega(undefined)
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    if (step === 1 && !massa) return true
    if (step === 2 && !cobertura) return true
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Bolo Piscina
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha a Massa</h3>
                <RadioGroup value={massa} onValueChange={setMassa} className="flex flex-col space-y-2">
                  {massas.map((m) => (
                    <div key={m} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value={m} id={m} />
                      <Label htmlFor={m} className={`${sour_candy.className} text-lg flex-grow`}>
                        <span className="font-semibold">{m}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha a Cobertura</h3>
                <RadioGroup value={cobertura} onValueChange={setCobertura} className="flex flex-col space-y-2">
                  {coberturas.map((c) => (
                    <div key={c} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value={c} id={c} />
                      <Label htmlFor={c} className={`${sour_candy.className} text-lg flex-grow`}>
                        <span className="font-semibold">{c}</span>
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

