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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const tipos = [
  { id: "simples", nome: "Simples", preco: 3.5 },
  { id: "recheado", nome: "Recheado", preco: 4.0 },
]

const recheios = ["Doce de leite", "Leite Ninho", "Brigadeiro", "Morango ao Leite"]

// Add these constants for pickup and delivery times
const horariosRetirada = ["11:00", "12:00", "15:00", "18:00", "19:00"]
const horariosEntrega = ["13:30", "17:30", "18:00", "19:00"]

interface Produto {
  id: string
  nome: string
  tipo: string
  recheio?: string
  preco: number
  quantidade: number
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
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("")
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", numero: "", complemento: "" })

  const dataMinima = addDays(new Date(), 0)

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
      tipoEntrega: tipoEntrega,
      horario: horarioSelecionado,
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/cupcake.jpg",
          alt: "Cupcake",
          description: `Cupcake ${tipoSelecionado.nome}`,
          name: `Cupcake ${tipoSelecionado.nome}`,
          price: tipoSelecionado.preco,
        },
      ],
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
    setTipoEntrega("retirada")
    setHorarioSelecionado("")
    setEndereco({ rua: "", bairro: "", numero: "", complemento: "" })
  }

  const nextStep = () => {
    if (step === 1 && Number.parseInt(quantidade) < 10) {
      return
    }
    if (step === 1 && tipo === "simples") {
      setStep(3)
    } else if (step < 4) {
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

  const isFormValid = () => {
    if (!tipo || Number.parseInt(quantidade) < 10 || !dataEntrega || !horarioSelecionado) return false
    if (tipo === "recheado" && !recheio) return false
    if (tipoEntrega === "entrega" && (!endereco.rua || !endereco.bairro || !endereco.numero || !endereco.complemento))
      return false
    return true
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
            {step === 4 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Entrega ou Retirada</h3>
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
                      Entrega
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
            {step < 4 ? (
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
                disabled={!isFormValid()}
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

