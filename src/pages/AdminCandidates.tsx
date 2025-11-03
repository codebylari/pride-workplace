import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Mail, MapPin, Star } from "lucide-react";

interface CandidateData {
  id: string;
  full_name: string;
  city: string | null;
  state: string | null;
  rating: number;
  total_ratings: number;
  created_at: string;
  email?: string;
}

export default function AdminCandidates() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userRole !== "admin") {
      navigate("/auth");
      return;
    }
    fetchCandidates();
  }, [user, userRole, navigate]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar emails dos usuários
      const candidatesWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: user?.email
          };
        })
      );

      setCandidates(candidatesWithEmail);
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2 mb-4">
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Candidatos Cadastrados</h1>
          <p className="text-muted-foreground">Total: {candidates.length}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Candidatos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.full_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-muted-foreground" />
                          {candidate.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-muted-foreground" />
                          {candidate.city && candidate.state 
                            ? `${candidate.city}, ${candidate.state}` 
                            : "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          {candidate.rating?.toFixed(1) || "5.0"} ({candidate.total_ratings || 0})
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(candidate.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
