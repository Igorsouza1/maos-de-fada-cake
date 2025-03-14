"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, isBefore } from "date-fns"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const massas = ["Amanteigada", "Chocolate", "Pão de Ló"]

const tamanhos = [
  { id: "20x30", nome: "25x20 cm (20 a 25 fatias)", preco: 200 },
  { id: "25x35", nome: "33x25 cm (30 a 35 fatias)", preco: 300 },
  { id: "30x40", nome: "40x25 cm (40 a 45 fatias)", preco: 350 },
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

// Adicione os horários de entrega disponíveis
const horariosEntrega = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
]

// Modifique a constante tiposBolo para topperOpcoes
const topperOpcoes = [
  { id: "simples", nome: "Simples", precos: { "20x30": 15, "25x35": 20, "30x40": 25 } },
  { id: "3d", nome: "3D", precos: { "20x30": 25, "25x35": 30, "30x40": 40 } },
]

// Add a delivery fee constant after the topperOpcoes array
const taxaEntrega = 20 // R$15 for delivery

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
  horarioEntrega?: string // Adicione o horário de entrega
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
  topper?: string | null // Adicione esta propriedade
}

interface BoloRetangularDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloRetangularDialog({ isOpen, onClose, onAddToCart }: BoloRetangularDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [massaSelecionada, setMassaSelecionada] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [tamanho, setTamanho] = useState<string>("")
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([])
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", numero: "", complemento: "" })
  // Substitua o estado tipoBolo por estes dois estados
  const [querTopper, setQuerTopper] = useState<boolean | null>(null)
  const [topperTipo, setTopperTipo] = useState<string>("")
  const [horarioEntrega, setHorarioEntrega] = useState<string>("") // Adicione o estado para o horário de entrega

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

    // Adicione o preço do topper apenas se querTopper for true
    let precoTopper = 0
    if (querTopper && topperTipo && tamanho) {
      const topperSelecionado = topperOpcoes.find((t) => t.id === topperTipo)
      precoTopper = topperSelecionado
        ? topperSelecionado.precos[tamanho as keyof typeof topperSelecionado.precos] || 0
        : 0
    }

    const taxaEntregaTotal = tipoEntrega === "entrega" ? taxaEntrega : 0
    return (
      precoBase +
      precoRecheiosGourmet +
      precoAdicionais +
      (quantidadeRecheios === 2 ? 10 : 0) +
      precoTopper +
      taxaEntregaTotal
    )
  }

  const dataMinima = addDays(new Date(), 0)

  // Modifique a função handleAddToCart para incluir o topper e o horário de entrega
  const handleAddToCart = () => {
    const produto: Produto = {
      id: `bolo-retangular-${Date.now()}`,
      nome: "Bolo Retangular",
      massa: massaSelecionada,
      tamanho: tamanhos.find((t) => t.id === tamanho)?.nome,
      recheios: recheiosSelecionados,
      adicionais: adicionaisSelecionados,
      topper: querTopper ? topperOpcoes.find((t) => t.id === topperTipo)?.nome : null,
      preco: calcularPrecoTotal(),
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      tipoEntrega,
      horarioEntrega: tipoEntrega === "entrega" ? horarioEntrega : undefined, // Adicione o horário de entrega
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/bolo-retangular.jpg",
          alt: "Bolo Retangular",
          description: "Bolo Retangular Personalizado",
          name: "Bolo Retangular",
          price: calcularPrecoTotal(),
        },
      ],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  // Modifique a função resetForm para incluir o reset do horário de entrega
  const resetForm = () => {
    setEtapa(1)
    setMassaSelecionada("")
    setQuantidadeRecheios(1)
    setRecheiosSelecionados([])
    setTamanho("")
    setQuerTopper(null) // Reset do querTopper
    setTopperTipo("") // Reset do topperTipo
    setAdicionaisSelecionados([])
    setDataEntrega(undefined)
    setTipoEntrega("retirada")
    setHorarioEntrega("") // Reset do horário de entrega
    setEndereco({ rua: "", bairro: "", numero: "", complemento: "" })
  }

  // Modifique a função isFormValid para validar querTopper e topperTipo
  const isFormValid = () => {
    if (etapa === 1 && !massaSelecionada) return false
    if (etapa === 2 && quantidadeRecheios === 0) return false
    if (etapa === 3 && recheiosSelecionados.length === 0) return false
    if (etapa === 4 && !tamanho) return false
    if (etapa === 5 && querTopper === null) return false
    if (etapa === 5 && querTopper === true && !topperTipo) return false
    if (etapa === 7 && !dataEntrega) return false

    // Special validation for step 8 (delivery options)
    if (etapa === 8) {
      // Always require a time selection
      if (!horarioEntrega) return false

      // Only validate address fields if delivery is selected
      if (tipoEntrega === "entrega") {
        // Check address fields (making complemento optional)
        if (!endereco.rua) return false
        if (!endereco.bairro) return false
        if (!endereco.numero) return false
        // Note: complemento is now optional
      }
    }

    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-pink-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Bolo Retangular
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {etapa === 1 && (
            <div className="space-y-4">
              <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha a Massa</h3>
              <RadioGroup
                value={massaSelecionada}
                onValueChange={setMassaSelecionada}
                className="flex flex-col space-y-2"
              >
                {massas.map((massa) => (
                  <div key={massa} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value={massa} id={massa} />
                    <Label htmlFor={massa} className={`${sour_candy.className} text-lg flex-grow`}>
                      {massa}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {etapa === 2 && (
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

          {etapa === 3 && (
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

          {etapa === 4 && (
            <div className="space-y-4">
              <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Escolha o Tamanho</h3>
              <RadioGroup value={tamanho} onValueChange={setTamanho} className="space-y-2">
                {tamanhos.map((t) => (
                  <div key={t.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                    <RadioGroupItem value={t.id} id={t.id} />
                    <Label htmlFor={t.id} className={`${sour_candy.className} text-sm flex-grow`}>
                      {t.nome}
                    </Label>
                    <span className="text-pink-600 font-semibold">R${t.preco.toFixed(2)}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {etapa === 5 && (
            <div className="space-y-4">
              <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>
                Deseja adicionar um Topper?
              </h3>
              <RadioGroup
                value={querTopper ? "sim" : querTopper === false ? "nao" : ""}
                onValueChange={(value) => setQuerTopper(value === "sim")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <RadioGroupItem value="sim" id="topper-sim" />
                  <Label htmlFor="topper-sim" className={`${sour_candy.className} text-lg flex-grow`}>
                    Sim, quero um topper
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <RadioGroupItem value="nao" id="topper-nao" />
                  <Label htmlFor="topper-nao" className={`${sour_candy.className} text-lg flex-grow`}>
                    Não, obrigado
                  </Label>
                </div>
              </RadioGroup>

              {querTopper && (
                <div className="mt-4 space-y-4">
                  <h4 className={`${sour_candy.className} text-xl text-pink-500 font-semibold`}>
                    Escolha o tipo de Topper:
                  </h4>
                  <RadioGroup value={topperTipo} onValueChange={setTopperTipo} className="space-y-2">
                    {topperOpcoes.map((tipo) => (
                      <div key={tipo.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                        <RadioGroupItem value={tipo.id} id={tipo.id} />
                        <Label htmlFor={tipo.id} className={`${sour_candy.className} text-sm flex-grow`}>
                          {tipo.nome}
                        </Label>
                        <span className="text-pink-600 font-semibold">
                          {tamanho
                            ? `R$${tipo.precos[tamanho as keyof typeof tipo.precos]?.toFixed(2) || "0.00"}`
                            : "Selecione um tamanho primeiro"}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {etapa === 6 && (
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

          {etapa === 7 && (
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

          {etapa === 8 && (
            <div className="space-y-4">
              <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Entrega ou Retirada</h3>
              <RadioGroup
                value={tipoEntrega}
                onValueChange={(value: "retirada" | "entrega") => {
                  setTipoEntrega(value)
                  if (value === "retirada") {
                    setHorarioEntrega("") // Limpa o horário se mudar para retirada
                  }
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
              {tipoEntrega === "entrega" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="horario-entrega" className={`${sour_candy.className} text-sm font-medium`}>
                      Horário de Entrega
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
        <DialogFooter className="flex justify-between items-center bg-white p-4 border-t">
          {etapa > 1 && (
            <Button onClick={voltarEtapa} variant="outline" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
              Voltar
            </Button>
          )}
          {etapa < 8 ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

