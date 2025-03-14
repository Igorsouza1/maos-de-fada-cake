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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const tamanhos = [
  { id: "tradicional", nome: "Tradicional", descricao: "Rende de 15 a 20 fatias", preco: 45 },
  { id: "gigante", nome: "Gigante", descricao: "Rende de 20 a 25 fatias", preco: 80 },
]

const recheios = ["Leite Ninho", "Brigadeiro"]

const massas = ["Baunilha", "Cenoura", "Chocolate"]

// Add these constants for pickup and delivery times
const horariosRetirada = ["11:00", "12:00", "15:00", "18:00", "19:00"]
const horariosEntrega = ["13:30", "17:30", "18:00", "19:00"]

// Add a delivery fee constant after the horariosEntrega array
const taxaEntrega = 20 // R$15 for delivery

interface Produto {
  id: string
  nome: string
  tamanho: string
  recheio: string
  massa: string
  preco: number
  dataEntrega: string
  tipoEntrega: "retirada" | "entrega"
  horario: string
  endereco?: {
    rua: string
    bairro: string
    numero: string
    complemento: string
  } | null
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
}

interface BoloVulcaoDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloVulcaoDialog({ isOpen, onClose, onAddToCart }: BoloVulcaoDialogProps) {
  const [step, setStep] = useState(1)
  const [tamanho, setTamanho] = useState<string>("")
  const [recheio, setRecheio] = useState<string>("")
  const [massa, setMassa] = useState<string>("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("")
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", numero: "", complemento: "" })

  const dataMinima = addDays(new Date(), 4)

  // Update the handleAddToCart function to include the delivery fee
  const handleAddToCart = () => {
    const tamanhoSelecionado = tamanhos.find((t) => t.id === tamanho)
    if (!tamanhoSelecionado) return

    const precoTotal = tamanhoSelecionado.preco + (tipoEntrega === "entrega" ? taxaEntrega : 0)

    const produto: Produto = {
      id: `bolo-vulcao-${Date.now()}`,
      nome: `Bolo Vulcão ${tamanhoSelecionado.nome}`,
      tamanho: tamanhoSelecionado.descricao,
      recheio: recheio,
      massa: massa,
      preco: precoTotal,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      tipoEntrega: tipoEntrega,
      horario: horarioSelecionado,
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/bolo-vulcao.jpg",
          alt: "Bolo Vulcão",
          description: `Bolo Vulcão ${tamanhoSelecionado.nome}`,
          name: `Bolo Vulcão ${tamanhoSelecionado.nome}`,
          price: precoTotal,
        },
      ],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setTamanho("")
    setRecheio("")
    setMassa("")
    setDataEntrega(undefined)
    setTipoEntrega("retirada")
    setHorarioSelecionado("")
    setEndereco({ rua: "", bairro: "", numero: "", complemento: "" })
  }

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isNextDisabled = () => {
    if (step === 1 && !tamanho) return true
    if (step === 2 && !recheio) return true
    if (step === 3 && !massa) return true
    if (step === 4 && !dataEntrega) return true
    return false
  }

  const isFormValid = () => {
    if (!tamanho || !recheio || !massa || !dataEntrega || !horarioSelecionado) return false

    // Only validate address fields if delivery is selected
    if (tipoEntrega === "entrega") {
      // Check address fields (making complemento optional)
      if (!endereco.rua) return false
      if (!endereco.bairro) return false
      if (!endereco.numero) return false
      // Note: complemento is now optional
    }

    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Bolo Vulcão
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {step === 1 && (
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
            )}
            {step === 2 && (
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
            {step === 4 && (
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
            {step === 5 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Entrega ou Retirada</h3>
                {/* Update the RadioGroup for delivery type to show the delivery fee */}
                <RadioGroup
                  value={tipoEntrega}
                  onValueChange={(value: "retirada" | "entrega") => {
                    setTipoEntrega(value)
                    setHorarioSelecionado("")
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value="retirada" id="retirada" />
                    <Label htmlFor="retirada" className={`${sour_candy.className} text-lg flex-grow`}>
                      Retirar no local
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value="entrega" id="entrega" />
                    <Label htmlFor="entrega" className={`${sour_candy.className} text-lg flex-grow`}>
                      Entrega (+R${taxaEntrega.toFixed(2)})
                    </Label>
                  </div>
                </RadioGroup>
                <div className="space-y-2">
                  <Label htmlFor="horario" className={`${sour_candy.className} text-sm font-medium`}>
                    {tipoEntrega === "retirada" ? "Horário de Retirada" : "Horário de Entrega"}
                  </Label>
                  <Select value={horarioSelecionado} onValueChange={setHorarioSelecionado}>
                    <SelectTrigger id="horario" className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {(tipoEntrega === "retirada" ? horariosRetirada : horariosEntrega).map((horario) => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {tipoEntrega === "entrega" && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Rua"
                      value={endereco.rua}
                      onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                      className="w-full"
                    />
                    <Input
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                      className="w-full"
                    />
                    <Input
                      placeholder="Número"
                      value={endereco.numero}
                      onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                      className="w-full"
                    />
                    <Input
                      placeholder="Complemento"
                      value={endereco.complemento}
                      onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                      className="w-full"
                    />
                  </div>
                )}
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
            {step < 5 ? (
              <Button
                onClick={nextStep}
                className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
                disabled={isNextDisabled()}
              >
                Avançar
              </Button>
            ) : (
              // Update the Button to show the total price including delivery fee
              <Button
                onClick={handleAddToCart}
                className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
                disabled={!isFormValid()}
              >
                Adicionar ao Carrinho (R$
                {(tamanhos.find((t) => t.id === tamanho)?.preco || 0) + (tipoEntrega === "entrega" ? taxaEntrega : 0)}
                .00)
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

