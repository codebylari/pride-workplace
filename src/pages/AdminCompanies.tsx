import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface Company {
  id: string;
  fantasy_name: string;
  cnpj: string;
  city: string;
  state: string;
  sector: string;
  rating: number;
  total_ratings: number;
  created_at: string;
}

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fantasy_name: "", city: "", state: "", sector: "" });

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchCompanies();
    }
  }, [userRole, loading, navigate]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setEditForm({
      fantasy_name: company.fantasy_name,
      city: company.city || "",
      state: company.state || "",
      sector: company.sector || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCompany) return;

    try {
      const { error } = await supabase
        .from("company_profiles")
        .update(editForm)
        .eq("id", editingCompany.id);

      if (error) throw error;

      toast({
        title: "Empresa atualizada",
        description: "Os dados foram atualizados com sucesso.",
      });

      setEditingCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from("company_profiles")
        .update({ is_active: false })
        .eq("id", deletingId);

      if (error) throw error;

      toast({
        title: "Empresa desativada",
        description: "A empresa foi desativada com sucesso.",
      });

      setDeletingId(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar a empresa.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.fantasy_name}</TableCell>
                    <TableCell>{company.cnpj}</TableCell>
                    <TableCell>
                      {company.city && company.state
                        ? `${company.city} - ${company.state}`
                        : "Não informado"}
                    </TableCell>
                    <TableCell>{company.sector || "Não informado"}</TableCell>
                    <TableCell>
                      {company.rating?.toFixed(1)} ({company.total_ratings} avaliações)
                    </TableCell>
                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingId(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Empresa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                <Input
                  id="fantasy_name"
                  value={editForm.fantasy_name}
                  onChange={(e) => setEditForm({ ...editForm, fantasy_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sector">Setor</Label>
                <Input
                  id="sector"
                  value={editForm.sector}
                  onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCompany(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja desativar esta empresa? Esta ação pode ser revertida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Desativar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
