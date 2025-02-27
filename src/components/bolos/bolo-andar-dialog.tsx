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
import { format, addDays, isBefore } from "date-fns"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] })
const sour_candy = Sour_Candy({ weight: "400", subsets: ["latin"] })

const massas = ["Amanteigada", "Chocolate", "Pão de Ló"]

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

interface BoloAndarDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (produto: any) => void
}

interface Produto {
  id: string
  nome: string
  tamanho: string | undefined
  massa: string
  recheios: string[]
  adicionais: string[]
  preco: number
  dataEntrega: string
  observacao: string
  imagens: { src: string; alt: string; description: string }[]
}

export function BoloAndarDialog({ isOpen, onClose, onAddToCart }: BoloAndarDialogProps) {
  const [etapa, setEtapa] = useState(1)
  const [tamanho, setTamanho] = useState<string>("")
  const [massaSelecionada, setMassaSelecionada] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([])
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(undefined)

  const avancarEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const calcularPrecoTotal = () => {
    const precoBase = tamanhos.find((t) => t.id === tamanho)?.preco || 0
    const precoRecheiosGourmet = recheiosSelecionados
      .map((r) => recheiosGourmet.find((rg) => rg.nome === r)?.adicional || 0)
      .reduce((a, b) => a + b, 0)
    const precoAdicionais = adicionaisSelecionados
      .map((a) => adicionais.find((ad) => ad.nome === a)?.preco || 0)
      .reduce((a, b) => a + b, 0)
    return precoBase + precoRecheiosGourmet + precoAdicionais + (quantidadeRecheios === 2 ? 10 : 0)
  }

  const dataMinima = addDays(new Date(), 4)

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
      observacao: "Incluso topper e entrega",
      imagens: [{ src: "/bolo-de-andar.jpg", alt: "Bolo de Andar", description: "Bolo de Andar Personalizado" }],
    }
    onAddToCart(produto)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setEtapa(1)
    setTamanho("")
    setMassaSelecionada("")
    setQuantidadeRecheios(1)
    setRecheiosSelecionados([])
    setAdicionaisSelecionados([])
    setDataEntrega(undefined)
  }

  const isFormValid = () => {
    if (etapa === 1 && !tamanho) return false
    if (etapa === 2 && !massaSelecionada) return false
    if (etapa === 3 && quantidadeRecheios === 0) return false
    if (etapa === 4 && recheiosSelecionados.length === 0) return false
    if (etapa === 6 && !dataEntrega) return false
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-pink-50 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-pink-100">
          <DialogTitle className={`${pacifico.className} text-3xl font-bold text-pink-700 text-center`}>
            Monte seu Bolo de Andar
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
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
              <p className={`${sour_candy.className} text-sm text-center text-pink-500 mt-4`}>
                Obs: Incluso topper e entrega.
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

