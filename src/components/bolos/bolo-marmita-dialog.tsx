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
import { format, addDays, isBefore } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const massas = ["Amanteigada", "Chocolate", "Pão de Ló"]

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

// Add these constants for pickup and delivery times
const horariosRetirada = ["11:00", "12:00", "15:00", "18:00", "19:00"]
const horariosEntrega = ["13:30", "17:30", "18:00", "19:00"]

interface Produto {
  id: string
  nome: string
  massa: string
  recheios: string[]
  adicionais: string[]
  quantidadeBrigadeiros: number
  preco: number
  quantidade: number
  dataEntrega: string
  tipoEntrega: "retirada" | "entrega"
  endereco: { rua: string; bairro: string; numero: string; complemento: string } | null
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
  horario: string // Add this field for the selected time
}

interface BoloMarmitaDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloMarmitaDialog({ isOpen, onClose, onAddToCart }: BoloMarmitaDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [massaSelecionada, setMassaSelecionada] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [adicionarBrigadeiros, setAdicionarBrigadeiros] = useState<boolean>(false)
  const [quantidadeBrigadeiros, setQuantidadeBrigadeiros] = useState<number | "">("")
  const [quantidade, setQuantidade] = useState<number | "">("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [tipoEntrega, setTipoEntrega] = useState<"retirada" | "entrega">("retirada")
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", numero: "", complemento: "" })
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("") // New state for selected time

  const avancarEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const calcularPrecoTotal = () => {
    const precoBase = 8 * (quantidade === "" ? 0 : quantidade) // 8 reais por unidade
    const precoRecheiosGourmet = recheiosSelecionados
      .map((r) => recheiosGourmet.find((rg) => rg.nome === r)?.adicional || 0)
      .reduce((a, b) => a + b, 0)
    const precoBrigadeiros = adicionarBrigadeiros ? 1.5 * (quantidadeBrigadeiros === "" ? 0 : quantidadeBrigadeiros) : 0
    return precoBase + precoRecheiosGourmet + precoBrigadeiros + (quantidadeRecheios === 2 ? 10 : 0)
  }

  const dataMinima = addDays(new Date(), 4)

  const isFormValid = () => {
    if (etapa === 1 && (!massaSelecionada || quantidade === "" || (typeof quantidade === "number" && quantidade < 10)))
      return false
    if (etapa === 2 && quantidadeRecheios === 0) return false
    if (etapa === 3 && recheiosSelecionados.length === 0) return false
    if (
      etapa === 4 &&
      adicionarBrigadeiros &&
      (quantidadeBrigadeiros === "" || (typeof quantidadeBrigadeiros === "number" && quantidadeBrigadeiros < 0))
    )
      return false
    if (etapa === 5 && !dataEntrega) return false
    if (etapa === 6 && !horarioSelecionado) return false // Add validation for selected time
    if (etapa === 6 && tipoEntrega === "entrega" && (!endereco.rua || !endereco.bairro || !endereco.numero))
      return false
    return true
  }

  const handleAddToCart = () => {
    const produto: Produto = {
      id: `bolo-marmita-${Date.now()}`,
      nome: "Bolo na Marmita",
      massa: massaSelecionada,
      recheios: recheiosSelecionados,
      adicionais: adicionarBrigadeiros ? ["Brigadeiros"] : [],
      quantidadeBrigadeiros: adicionarBrigadeiros
        ? typeof quantidadeBrigadeiros === "number"
          ? quantidadeBrigadeiros
          : 0
        : 0,
      preco: calcularPrecoTotal(),
      quantidade: typeof quantidade === "number" ? quantidade : 0,
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      tipoEntrega,
      endereco: tipoEntrega === "entrega" ? endereco : null,
      imagens: [
        {
          src: "/bolo-marmita.jpg",
          alt: "Bolo na Marmita",
          description: "Bolo na Marmita Personalizado",
          name: "Bolo na Marmita",
          price: 8,
        },
      ],
      horario: horarioSelecionado, // Add the selected time to the product
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setEtapa(1)
    setMassaSelecionada("")
    setQuantidadeRecheios(1)
    setRecheiosSelecionados([])
    setAdicionarBrigadeiros(false)
    setQuantidadeBrigadeiros(0)
    setQuantidade(10)
    setDataEntrega(undefined)
    setTipoEntrega("retirada")
    setEndereco({ rua: "", bairro: "", numero: "", complemento: "" })
    setHorarioSelecionado("") // Reset the selected time
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Bolo na Marmita
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pb-6">
            {etapa === 1 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>
                  Escolha a Massa e Quantidade
                </h3>
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
                <div className="space-y-2 mt-4">
                  <Label htmlFor="quantidade" className={`${sour_candy.className} text-lg`}>
                    Quantidade (mínimo 10 unidades)
                  </Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10)
                      setQuantidade(value)
                    }}
                    className="w-full"
                  />
                  <p className={`${sour_candy.className} text-sm text-pink-600`}>
                    Aviso: A quantidade mínima para pedidos de bolo na marmita é de 10 unidades.
                  </p>
                </div>
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
              <div className="space-y-6 max-h-[50vh] overflow-y-auto">
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
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <h4 className={`${sour_candy.className} text-xl text-pink-500 font-semibold`}>
                      Recheios Gourmet (Com adicional)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {recheiosGourmet.map((recheio) => (
                        <div
                          key={recheio.nome}
                          className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm"
                        >
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
              </div>
            )}

            {etapa === 4 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Adicionais</h3>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <Checkbox
                    id="brigadeiros"
                    checked={adicionarBrigadeiros}
                    onCheckedChange={(checked) => {
                      setAdicionarBrigadeiros(!!checked)
                      if (!checked) setQuantidadeBrigadeiros(0)
                    }}
                  />
                  <label
                    htmlFor="brigadeiros"
                    className={`${sour_candy.className} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow`}
                  >
                    Brigadeiros
                  </label>
                  <span className="text-pink-600 font-semibold">+R$1,50 por unidade</span>
                </div>

                {adicionarBrigadeiros && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="qtdBrigadeiros" className={`${sour_candy.className} text-lg`}>
                      Quantidade de Brigadeiros
                    </Label>
                    <Input
                      id="qtdBrigadeiros"
                      type="number"
                      value={quantidadeBrigadeiros}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10)
                        setQuantidadeBrigadeiros(value)
                      }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {etapa === 5 && (
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

            {etapa === 6 && (
              <div className="space-y-4">
                <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>Entrega ou Retirada</h3>
                <RadioGroup
                  value={tipoEntrega}
                  onValueChange={(value: "retirada" | "entrega") => {
                    setTipoEntrega(value)
                    setHorarioSelecionado("") // Reset the selected time when changing delivery type
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
        <DialogFooter className="flex justify-between items-center bg-white p-4 border-t">
          {etapa > 1 && (
            <Button onClick={voltarEtapa} variant="outline" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
              Voltar
            </Button>
          )}
          {etapa < 6 ? (
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

