import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const AddJobDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Vaga cadastrada com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary shadow-glow hover:opacity-90 transition-smooth">
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Vaga
        </Button>

        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Nova Vaga de Emprego
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da vaga para inclusão LGBTQIA+
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Vaga</Label>
              <Input
                id="title"
                placeholder="Ex: Desenvolvedor(a) Full Stack"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nome da empresa"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="São Paulo, SP"
                  required
                />
              </div>
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
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva a vaga e os requisitos..."
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="React, TypeScript, Remote"
              />
            </div>
          </div>
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

export default AddJobDialog;
