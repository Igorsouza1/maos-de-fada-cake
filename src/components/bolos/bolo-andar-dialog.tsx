"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Pacifico, Sour_Gummy as Sour_Candy } from "next/font/google"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { format, addDays, isBefore } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const massas = ["Amanteigada", "Chocolate"]

const tamanhos = [
  {
    id: "2-andares",
    nome: "2 Andares (65 a 70 fatias)",
    descricao: "3 cm em cima, 27 cm embaixo",
    preco: 450,
  },
  {
    id: "3-andares",
    nome: "3 Andares (100 fatias)",
    descricao: "17 cm em cima, 23 cm no meio, 30 cm base",
    preco: 750,
  },
]

const recheiosSimples = ["4 Leites", "Brigadeiro", "Leite Ninho", "Chocolate", "Morango ao Leite", "Maracujá ao Leite"]

const recheiosGourmet = [
  { nome: "4 Leites com Abacaxi", adicional: 20 },
  { nome: "Brigadeiro Tradicional com Morango Fresco", adicional: 25 },
  { nome: "Leite Ninho com Morango Fresco", adicional: 25 },
  { nome: "Doce de Leite com Ameixa", adicional: 30 },
  { nome: "Prestígio", adicional: 20 },
  { nome: "Leite Ninho com Nutella", adicional: 25 },
  { nome: "Nozes", adicional: 25 },
  { nome: "Recheio de Bombom", adicional: 30 },
  { nome: "Recheio de Ganache Meio Amargo", adicional: 30 },
  { nome: "Recheio Ferrero Rocher", adicional: 30 },
  { nome: "Ganache", adicional: 30 },
  { nome: "Recheio Ouro Branco", adicional: 25 },
]

const adicionais = [
  { nome: "Pérolas", preco: 10 },
  { nome: "Brigadeiros", preco: 20 },
  { nome: "Morangos", preco: 20 },
  { nome: "Glitter", preco: 20 },
  { nome: "Brilho", preco: 20 },
]

// Set the delivery fee to R$20
const taxaEntrega = 20 // R$20 for delivery

const horariosEntrega = ["09:00 - 12:00", "14:00 - 17:00", "18:00 - 21:00"]

interface Produto {
  id: string
  nome: string
  descricao?: string // Make descricao optional
  preco: number
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
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
  quantidade?: number
  tipo?: string
  cobertura?: string // Add this for Bolo Piscina
  horarioEntrega?: string
}

interface BoloAndarDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloAndarDialog({ isOpen, onClose, onAddToCart }: BoloAndarDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [tamanho, setTamanho] = useState<string>("")
  const [massaSelecionada, setMassaSelecionada] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([])
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [endereco, setEndereco] = useState({ rua: "", numero: "", bairro: "", complemento: "" })
  const [horarioEntrega, setHorarioEntrega] = useState<string>("")
  // Change the default tipoEntrega to "retirada" instead of "entrega"
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")

  const avancarEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  // Update the calcularPrecoTotal function to include the delivery fee when delivery is selected
  const calcularPrecoTotal = () => {
    const precoBase = tamanhos.find((t) => t.id === tamanho)?.preco || 0
    const precoRecheiosGourmet = recheiosSelecionados
      .map((r) => recheiosGourmet.find((rg) => rg.nome === r)?.adicional || 0)
      .reduce((a, b) => a + b, 0)
    const precoAdicionais = adicionaisSelecionados
      .map((a) => adicionais.find((ad) => ad.nome === a)?.preco || 0)
      .reduce((a, b) => a + b, 0)
    const taxaEntregaTotal = tipoEntrega === "entrega" ? taxaEntrega : 0
    return precoBase + precoRecheiosGourmet + precoAdicionais + (quantidadeRecheios === 2 ? 10 : 0) + taxaEntregaTotal
  }

  const dataMinima = addDays(new Date(), 4)

  // Update the handleAddToCart function to use the selected tipoEntrega
  const handleAddToCart = () => {
    const produto: Produto = {
      id: `bolo-andar-${Date.now()}`,
      nome: "Bolo de Andar",
      tamanho: tamanhos.find((t) => t.id === tamanho)?.nome,
      massa: massaSelecionada,
      recheios: recheiosSelecionados,
      adicionais: adicionaisSelecionados,
      preco: calcularPrecoTotal(),
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/bolo-de-andar.jpg",
          alt: "Bolo de Andar",
          description: "Bolo de Andar Personalizado",
          name: "Bolo de Andar",
          price: calcularPrecoTotal(),
        },
      ],
      horarioEntrega: horarioEntrega,
      tipoEntrega: tipoEntrega, // Use the selected delivery type
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  // Update the resetForm function to reset tipoEntrega to "retirada"
  const resetForm = () => {
    setEtapa(1)
    setTamanho("")
    setMassaSelecionada("")
    setQuantidadeRecheios(1)
    setRecheiosSelecionados([])
    setAdicionaisSelecionados([])
    setDataEntrega(undefined)
    setEndereco({ rua: "", numero: "", bairro: "", complemento: "" })
    setHorarioEntrega("")
    setTipoEntrega("retirada") // Reset to default pickup
  }

  // Update the isFormValid function to check for delivery address only when delivery is selected
  const isFormValid = () => {
    // Basic validations for steps 1-6
    if (etapa === 1 && !tamanho) return false
    if (etapa === 2 && !massaSelecionada) return false
    if (etapa === 3 && quantidadeRecheios === 0) return false
    if (etapa === 4 && recheiosSelecionados.length === 0) return false
    if (etapa === 6 && !dataEntrega) return false

    // Special validation for step 7 (delivery options)
    if (etapa === 7) {
      // For pickup option
      if (tipoEntrega === "retirada") {
        return !!horarioEntrega // Only require time selection
      }

      // For delivery option - check each field individually
      if (tipoEntrega === "entrega") {
        // Check time selection
        if (!horarioEntrega) return false

        // Check address fields (making complemento optional)
        if (!endereco.rua) return false
        if (!endereco.numero) return false
        if (!endereco.bairro) return false

        // If we get here, all required fields are filled
        return true
      }
    }

    // Default case - if we're not in any of the above cases, validation passes
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Bolo de Andar
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {etapa === 1 && (
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
                {/* Remove the text about free delivery in etapa 1 */}
                <p className={`${sour_candy.className} text-sm text-center text-pink-500 mt-4`}>
                  Obs: Topper grátis para o Bolo de Andar.
                </p>
              </div>
            )}

            {etapa === 2 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha a Massa</h3>
                <RadioGroup
                  value={massaSelecionada}
                  onValueChange={setMassaSelecionada}
                  className="flex flex-col space-y-2"
                >
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

            {etapa === 3 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Quantidade de Recheios</h3>
                <RadioGroup
                  value={quantidadeRecheios.toString()}
                  onValueChange={(value) => setQuantidadeRecheios(Number(value))}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value="1" id="r1" />
                    <Label htmlFor="r1" className={`${sour_candy.className} text-lg flex-grow`}>
                      1 Recheio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value="2" id="r2" />
                    <Label htmlFor="r2" className={`${sour_candy.className} text-lg flex-grow`}>
                      2 Recheios (+R$10,00)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {etapa === 4 && (
              <div className="space-y-6">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha os Recheios</h3>
                <div className="space-y-4">
                  <h4 className={`${sour_candy.className} text-xl text-pink-500 font-semibold`}>Recheios Simples</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {recheiosSimples.map((recheio) => (
                      <div key={recheio} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                        <Checkbox
                          id={recheio}
                          checked={recheiosSelecionados.includes(recheio)}
                          onCheckedChange={(checked) => {
                            setRecheiosSelecionados((prev) =>
                              checked
                                ? [...prev, recheio].slice(0, quantidadeRecheios)
                                : prev.filter((r) => r !== recheio),
                            )
                          }}
                        />
                        <label
                          htmlFor={recheio}
                          className={`${sour_candy.className} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow`}
                        >
                          {recheio}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h4 className={`${sour_candy.className} text-xl text-pink-500 font-semibold`}>
                    Recheios Gourmet (Com adicional)
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {recheiosGourmet.map((recheio) => (
                      <div key={recheio.nome} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                        <Checkbox
                          id={recheio.nome}
                          checked={recheiosSelecionados.includes(recheio.nome)}
                          onCheckedChange={(checked) => {
                            setRecheiosSelecionados((prev) =>
                              checked
                                ? [...prev, recheio.nome].slice(0, quantidadeRecheios)
                                : prev.filter((r) => r !== recheio.nome),
                            )
                          }}
                        />
                        <label
                          htmlFor={recheio.nome}
                          className={`${sour_candy.className} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow`}
                        >
                          {recheio.nome}
                        </label>
                        <span className="text-pink-600 font-semibold">+R${recheio.adicional.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {etapa === 5 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Adicionais</h3>
                <div className="grid grid-cols-1 gap-2">
                  {adicionais.map((adicional) => (
                    <div key={adicional.nome} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                      <Checkbox
                        id={adicional.nome}
                        checked={adicionaisSelecionados.includes(adicional.nome)}
                        onCheckedChange={(checked) => {
                          setAdicionaisSelecionados((prev) =>
                            checked ? [...prev, adicional.nome] : prev.filter((a) => a !== adicional.nome),
                          )
                        }}
                      />
                      <label
                        htmlFor={adicional.nome}
                        className={`${sour_candy.className} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow`}
                      >
                        {adicional.nome}
                      </label>
                      <span className="text-pink-600 font-semibold">+R${adicional.preco.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etapa === 6 && (
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

            {/* Replace etapa 7 with a new implementation that includes pickup option */}
            {etapa === 7 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Entrega ou Retirada</h3>
                <RadioGroup
                  value={tipoEntrega}
                  onValueChange={(value: "retirada" | "entrega") => {
                    setTipoEntrega(value)
                    setHorarioEntrega("")
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
                  <Label htmlFor="horario-entrega" className={`${sour_candy.className} text-sm font-medium`}>
                    {tipoEntrega === "retirada" ? "Horário de Retirada" : "Horário de Entrega"}
                  </Label>
                  <Select value={horarioEntrega} onValueChange={setHorarioEntrega}>
                    <SelectTrigger id="horario-entrega" className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosEntrega.map((horario) => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {tipoEntrega === "entrega" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rua" className={`${sour_candy.className} text-sm font-medium`}>
                        Rua
                      </Label>
                      <Input
                        id="rua"
                        placeholder="Rua"
                        value={endereco.rua}
                        onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero" className={`${sour_candy.className} text-sm font-medium`}>
                        Número
                      </Label>
                      <Input
                        id="numero"
                        placeholder="Número"
                        value={endereco.numero}
                        onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro" className={`${sour_candy.className} text-sm font-medium`}>
                        Bairro
                      </Label>
                      <Input
                        id="bairro"
                        placeholder="Bairro"
                        value={endereco.bairro}
                        onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento" className={`${sour_candy.className} text-sm font-medium`}>
                        Complemento
                      </Label>
                      <Input
                        id="complemento"
                        placeholder="Complemento"
                        value={endereco.complemento}
                        onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 bg-white border-t">
          <div className="flex justify-between w-full">
            {etapa > 1 && (
              <Button onClick={voltarEtapa} variant="outline" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                Voltar
              </Button>
            )}
            {etapa < 7 ? (
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
                Adicionar ao Carrinho (R${calcularPrecoTotal().toFixed(2)})
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

