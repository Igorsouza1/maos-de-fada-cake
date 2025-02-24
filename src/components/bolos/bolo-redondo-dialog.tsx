import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const tamanhos = [
  { id: "17cm", nome: "17 cm (13 a 15 fatias)", preco: 110 },
  { id: "23cm", nome: "23 cm (23 a 25 fatias)", preco: 180 },
  { id: "25cm", nome: "25 cm (25 a 30 fatias)", preco: 200 },
  { id: "28cm", nome: "28 cm (40 a 45 fatias)", preco: 270 },
  { id: "33cm", nome: "33 cm (45 a 50 fatias)", preco: 300 },
  { id: "40cm", nome: "40 cm (60 a 65 fatias)", preco: 320 },
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

interface BoloRedondoDialogProps {
  onAddToCart: (produto: any) => void
  onClose: () => void
}

export function BoloRedondoDialog({ onAddToCart, onClose }: BoloRedondoDialogProps) {
  const [tamanho, setTamanho] = useState<string>("")
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<number>(1)
  const [recheiosSelecionados, setRecheiosSelecionados] = useState<string[]>([])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([])

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

  const handleAddToCart = () => {
    const produto = {
      id: `bolo-redondo-${Date.now()}`,
      nome: "Bolo Redondo",
      tamanho: tamanhos.find((t) => t.id === tamanho)?.nome,
      recheios: recheiosSelecionados,
      adicionais: adicionaisSelecionados,
      preco: calcularPrecoTotal(),
    }
    onAddToCart(produto)
    onClose()
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Montar Bolo Redondo</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="tamanho">Tamanho</Label>
          <RadioGroup id="tamanho" value={tamanho} onValueChange={setTamanho}>
            {tamanhos.map((t) => (
              <div key={t.id} className="flex items-center space-x-2">
                <RadioGroupItem value={t.id} id={t.id} />
                <Label htmlFor={t.id}>
                  {t.nome} - R${t.preco.toFixed(2)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="grid gap-2">
          <Label>Quantidade de Recheios</Label>
          <RadioGroup
            value={quantidadeRecheios.toString()}
            onValueChange={(value) => setQuantidadeRecheios(Number.parseInt(value))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="recheio-1" />
              <Label htmlFor="recheio-1">1 Recheio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="recheio-2" />
              <Label htmlFor="recheio-2">2 Recheios (+R$10,00)</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-2">
          <Label>Recheios</Label>
          {recheiosSimples.map((recheio) => (
            <div key={recheio} className="flex items-center space-x-2">
              <Checkbox
                id={recheio}
                checked={recheiosSelecionados.includes(recheio)}
                onCheckedChange={(checked) => {
                  setRecheiosSelecionados((prev) => (checked ? [...prev, recheio] : prev.filter((r) => r !== recheio)))
                }}
              />
              <label
                htmlFor={recheio}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {recheio}
              </label>
            </div>
          ))}
          {recheiosGourmet.map((recheio) => (
            <div key={recheio.nome} className="flex items-center space-x-2">
              <Checkbox
                id={recheio.nome}
                checked={recheiosSelecionados.includes(recheio.nome)}
                onCheckedChange={(checked) => {
                  setRecheiosSelecionados((prev) =>
                    checked ? [...prev, recheio.nome] : prev.filter((r) => r !== recheio.nome),
                  )
                }}
              />
              <label
                htmlFor={recheio.nome}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {recheio.nome} (+R${recheio.adicional.toFixed(2)})
              </label>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <Label>Adicionais</Label>
          {adicionais.map((adicional) => (
            <div key={adicional.nome} className="flex items-center space-x-2">
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {adicional.nome} (+R${adicional.preco.toFixed(2)})
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">Total: R${calcularPrecoTotal().toFixed(2)}</p>
        <Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
      </div>
    </DialogContent>
  )
}

