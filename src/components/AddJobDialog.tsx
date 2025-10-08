// Importa o hook useState do React para controlar estados
import { useState } from "react";

// Importa o componente Button customizado
import { Button } from "@/components/ui/button";

// Importa componentes do Dialog (caixa de diálogo/modal)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Importa Input e Label para campos de formulário
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Importa componentes de Select (dropdown)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importa ícone Plus da biblioteca lucide-react
import { Plus } from "lucide-react";

// Importa função toast para mostrar notificações
import { toast } from "sonner";

// Componente funcional AddJobDialog
const AddJobDialog = () => {
  // Estado para controlar se o Dialog está aberto ou fechado
  const [open, setOpen] = useState(false);

  // Função que será executada ao enviar o formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página
    toast.success("Vaga cadastrada com sucesso!"); // Mostra notificação de sucesso
    setOpen(false); // Fecha o Dialog
  };

  return (
    // Componente Dialog que abre ou fecha com base no estado "open"
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botão que dispara a abertura do Dialog */}
      <DialogTrigger asChild>
        <Button className="gradient-primary shadow-glow hover:opacity-90 transition-smooth">
          <Plus className="w-4 h-4 mr-2" /> {/* Ícone de "+" */}
          Cadastrar Vaga
        </Button>
      </DialogTrigger>

      {/* Conteúdo do Dialog */}
      <DialogContent className="sm:max-w-[600px]">
        {/* Formulário que chama handleSubmit ao enviar */}
        <form onSubmit={handleSubmit}>
          {/* Cabeçalho do Dialog */}
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Nova Vaga de Emprego
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da vaga para inclusão LGBTQIA+
            </DialogDescription>
          </DialogHeader>

          {/* Corpo do formulário */}
          <div className="grid gap-4 py-4">
            {/* Campo de Título da Vaga */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Vaga</Label>
              <Input
                id="title"
                placeholder="Ex: Desenvolvedor(a) Full Stack"
                required
              />
            </div>

            {/* Campo de Empresa */}
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nome da empresa"
                required
              />
            </div>

            {/* Linha com Localização e Tipo */}
            <div className="grid grid-cols-2 gap-4">
              {/* Localização */}
              <div className="grid gap-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="São Paulo, SP"
                  required
                />
              </div>

              {/* Tipo de contrato */}
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clt">CLT</SelectItem>
                    <SelectItem value="pj">PJ</SelectItem>
                    <SelectItem value="estagio">Estágio</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campo de descrição */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva a vaga e os requisitos..."
                rows={4}
                required
              />
            </div>

            {/* Campo de tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="React, TypeScript, Remote"
              />
            </div>
          </div>

          {/* Rodapé do Dialog com botão de submit */}
          <DialogFooter>
            <Button type="submit" className="gradient-primary">
              Cadastrar Vaga
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Exporta o componente para ser usado em outras partes do projeto
export default AddJobDialog;
