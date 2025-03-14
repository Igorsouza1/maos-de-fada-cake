"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { format, addDays, isBefore } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const sabores = [
  { id: "brigadeiro", nome: "Brigadeiro" },
  { id: "beijinho", nome: "Beijinho" },
  { id: "2amores", nome: "2 Amores" },
  { id: "ninhonutella", nome: "Ninho com Nutella", preco: 20 },
]

const quantidades = [
  { id: "50", nome: "50 docinhos", preco: 70 },
  { id: "120", nome: "120 docinhos", preco: 168 },
  { id: "150", nome: "150 docinhos", preco: 210 },
]

// Add these constants for pickup and delivery times
const horariosRetirada = ["11:00", "12:00", "15:00", "18:00", "19:00"]
const horariosEntrega = ["13:30", "17:30", "18:00", "19:00"]

// Add a delivery fee constant after the horariosEntrega array
const taxaEntrega = 20 // R$15 for delivery

interface Produto {
  id: string
  nome: string
  sabores: string[]
  quantidade: number
  preco: number
  dataEntrega: string
  tipoEntrega: "retirada" | "entrega"
  horario: string
  endereco: { rua: string; bairro: string; numero: string; complemento: string } | null
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
}

interface DocinhosDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function DocinhosDialog({ isOpen, onClose, onAddToCart }: DocinhosDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [saboresSelecionados, setSaboresSelecionados] = useState<string[]>([])
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<string>("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("")
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", numero: "", complemento: "" })

  const avancarEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const dataMinima = addDays(new Date(), 4)

  const isFormValid = () => {
    if (etapa === 1 && saboresSelecionados.length === 0) return false
    if (etapa === 2 && !quantidadeSelecionada) return false
    if (etapa === 3 && !dataEntrega) return false
    if (etapa === 4 && !horarioSelecionado) return false

    // Only validate address fields if delivery is selected and we're on step 4
    if (etapa === 4 && tipoEntrega === "entrega") {
      // Check address fields (making complemento optional)
      if (!endereco.rua) return false
      if (!endereco.bairro) return false
      if (!endereco.numero) return false
      // Note: complemento is now optional
    }

    return true
  }

  // Update the handleAddToCart function to include the delivery fee
  const handleAddToCart = () => {
    const quantidadeObj = quantidades.find((q) => q.id === quantidadeSelecionada)
    if (!quantidadeObj) return

    const adicionalNinhoNutella = saboresSelecionados.includes("ninhonutella") ? 20 : 0
    const precoBase = quantidadeObj.preco + adicionalNinhoNutella
    const precoTotal = precoBase + (tipoEntrega === "entrega" ? taxaEntrega : 0)

    const produto: Produto = {
      id: `docinhos-${Date.now()}`,
      nome: "Docinhos",
      sabores: saboresSelecionados,
      quantidade: Number.parseInt(quantidadeObj.id),
      preco: precoTotal,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      tipoEntrega,
      horario: horarioSelecionado,
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/docinhos.jpg",
          alt: "Docinhos",
          description: "Docinhos variados",
          name: "Docinhos",
          price: precoTotal,
        },
      ],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setEtapa(1)
    setSaboresSelecionados([])
    setQuantidadeSelecionada("")
    setDataEntrega(undefined)
    setTipoEntrega("retirada")
    setHorarioSelecionado("")
    setEndereco({ rua: "", bairro: "", numero: "", complemento: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Pedido de Docinhos
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {etapa === 1 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha os Sabores</h3>
                <div className="grid grid-cols-1 gap-2">
                  {sabores.map((sabor) => (
                    <div key={sabor.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <Checkbox
                        id={sabor.id}
                        checked={saboresSelecionados.includes(sabor.id)}
                        onCheckedChange={(checked) => {
                          setSaboresSelecionados((prev) =>
                            checked ? [...prev, sabor.id] : prev.filter((s) => s !== sabor.id),
                          )
                        }}
                      />
                      <label
                        htmlFor={sabor.id}
                        className={`${sour_candy.className} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow`}
                      >
                        {sabor.nome}
                        {sabor.preco && <span className="ml-2 text-pink-600">(+R${sabor.preco.toFixed(2)})</span>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etapa === 2 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha a Quantidade</h3>
                <RadioGroup
                  value={quantidadeSelecionada}
                  onValueChange={setQuantidadeSelecionada}
                  className="flex flex-col space-y-2"
                >
                  {quantidades.map((quantidade) => (
                    <div key={quantidade.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <RadioGroupItem value={quantidade.id} id={quantidade.id} />
                      <Label htmlFor={quantidade.id} className={`${sour_candy.className} text-lg flex-grow`}>
                        {quantidade.nome}
                      </Label>
                      <span className="text-pink-600 font-semibold">R${quantidade.preco.toFixed(2)}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {etapa === 3 && (
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

            {etapa === 4 && (
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
        <DialogFooter className="flex justify-between items-center bg-white p-4 border-t">
          {etapa > 1 && (
            <Button onClick={voltarEtapa} variant="outline" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
              Voltar
            </Button>
          )}
          {etapa < 4 ? (
            <Button
              onClick={avancarEtapa}
              className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
              disabled={!isFormValid()}
            >
              Avançar
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="bg-pink-500 hover:bg-pink-600 text-white ml-auto"
              disabled={!isFormValid()}
            >
              Adicionar ao Carrinho (R$
              {(quantidades.find((q) => q.id === quantidadeSelecionada)?.preco || 0) +
                (saboresSelecionados.includes("ninhonutella") ? 20 : 0) +
                (tipoEntrega === "entrega" ? taxaEntrega : 0)}
              .00)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

