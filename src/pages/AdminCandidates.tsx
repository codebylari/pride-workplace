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

interface Candidate {
  id: string;
  full_name: string;
  city: string;
  state: string;
  gender: string;
  rating: number;
  total_ratings: number;
  created_at: string;
}

export default function AdminCandidates() {
  const navigate = useNavigate();
  const { userRole, loading } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", city: "", state: "", gender: "" });

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      fetchCandidates();
    }
  }, [userRole, loading, navigate]);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setEditForm({
      full_name: candidate.full_name,
      city: candidate.city || "",
      state: candidate.state || "",
      gender: candidate.gender || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCandidate) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(editForm)
        .eq("id", editingCandidate.id);

      if (error) throw error;

      toast({
        title: "Candidato atualizado",
        description: "Os dados foram atualizados com sucesso.",
      });

      setEditingCandidate(null);
      fetchCandidates();
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o candidato.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: false })
        .eq("id", deletingId);

      if (error) throw error;

      toast({
        title: "Candidato desativado",
        description: "O candidato foi desativado com sucesso.",
      });

      setDeletingId(null);
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar o candidato.",
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
            <CardTitle>Candidatos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.full_name}</TableCell>
                    <TableCell>
                      {candidate.city && candidate.state
                        ? `${candidate.city} - ${candidate.state}`
                        : "Não informado"}
                    </TableCell>
                    <TableCell>{candidate.gender || "Não informado"}</TableCell>
                    <TableCell>
                      {candidate.rating?.toFixed(1)} ({candidate.total_ratings} avaliações)
                    </TableCell>
                    <TableCell>
                      {new Date(candidate.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(candidate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingId(candidate.id)}
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

        <Dialog open={!!editingCandidate} onOpenChange={() => setEditingCandidate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Candidato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
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
                <Label htmlFor="gender">Gênero</Label>
                <Input
                  id="gender"
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCandidate(null)}>
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
                Tem certeza que deseja desativar este candidato? Esta ação pode ser revertida.
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
