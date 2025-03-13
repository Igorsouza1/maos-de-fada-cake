"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Pacifico, Sour_Gummy } from "next/font/google"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { format, addDays, isBefore } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Gummy({ weight: "400", subsets: ["latin"] })

const massas = ["Amanteigada", "Chocolate"]

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

const horariosEntrega = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
]

interface Produto {
  id: string
  nome: string
  massa: string
  recheios: string[]
  adicionais: string[]
  preco: number
  dataEntrega: string
  horarioEntrega: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    complemento: string
  }
  imagens: { src: string; alt: string; description: string; name: string; price: number }[]
}

interface BoloAquarioDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: Produto) => void
}

export function BoloAquarioDialog({ isOpen, onClose, onAddToCart }: BoloAquarioDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [massaSelecionada, setMassaSelecionada] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([])
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)
  const [horarioEntrega, setHorarioEntrega] = useState<string>("")
  const [endereco, setEndereco] = useState({ rua: "", numero: "", bairro: "", complemento: "" })

  const avancarEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const calcularPrecoTotal = () => {
    const precoBase = 150 // Preço base do Bolo Aquário
    const precoRecheiosGourmet = recheiosSelecionados
      .map((r) => recheiosGourmet.find((rg) => rg.nome === r)?.adicional || 0)
      .reduce((a, b) => a + b, 0)
    const precoAdicionais = adicionaisSelecionados
      .map((a) => adicionais.find((ad) => ad.nome === a)?.preco || 0)
      .reduce((a, b) => a + b, 0)
    return precoBase + precoRecheiosGourmet + precoAdicionais + (quantidadeRecheios === 2 ? 10 : 0)
  }

  const dataMinima = addDays(new Date(), 0)

  const handleAddToCart = () => {
    const produto: Produto = {
      id: `bolo-aquario-${Date.now()}`,
      nome: "Bolo Aquário",
      massa: massaSelecionada,
      recheios: recheiosSelecionados,
      adicionais: adicionaisSelecionados,
      preco: calcularPrecoTotal(),
      dataEntrega: dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "",
      horarioEntrega: horarioEntrega,
      endereco: endereco,
      imagens: [
        {
          src: "/bolo-aquario-1.jpg",
          alt: "Bolo Aquário 1",
          description: "Bolo Aquário decorado com tema marinho",
          name: "Bolo Aquário",
          price: calcularPrecoTotal(),
        },
        {
          src: "/bolo-aquario-2.jpg",
          alt: "Bolo Aquário 2",
          description: "Bolo Aquário com decoração de peixes",
          name: "Bolo Aquário",
          price: calcularPrecoTotal(),
        },
      ],
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
    setAdicionaisSelecionados([])
    setDataEntrega(undefined)
    setHorarioEntrega("")
    setEndereco({ rua: "", numero: "", bairro: "", complemento: "" })
  }

  const isFormValid = () => {
    if (etapa === 1 && !massaSelecionada) return false
    if (etapa === 2 && quantidadeRecheios === 0) return false
    if (etapa === 3 && recheiosSelecionados.length === 0) return false
    if (etapa === 5 && !dataEntrega) return false
    if (etapa === 6 && (!endereco.rua || !endereco.numero || !endereco.bairro || !horarioEntrega)) return false
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] min-h-[600px] flex flex-col p-0 bg-pink-50">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Bolo Aquário
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
              <h3 className={`${pacifico.className} text-2xl text-pink-600 text-center`}>
                Endereço e Horário de Entrega
              </h3>
              <p className={`${sour_candy.className} text-sm text-center text-pink-500`}>
                Preencha o endereço para entrega do seu bolo e escolha o melhor horário.
              </p>
              <p className={`${sour_candy.className} text-sm text-center text-pink-500 font-bold`}>
                OBS: A entrega e topper são gratuitos para o Bolo Aquário!
              </p>
              <div className="space-y-2">
                <Input
                  placeholder="Rua"
                  value={endereco.rua}
                  onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                  className="w-full"
                />
                <Input
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                  className="w-full"
                />
                <Input
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                  className="w-full"
                />
                <Input
                  placeholder="Complemento"
                  value={endereco.complemento}
                  onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                  className="w-full"
                />
                <Select value={horarioEntrega} onValueChange={setHorarioEntrega}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o horário de entrega" />
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
            </div>
          )}
        </div>
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

