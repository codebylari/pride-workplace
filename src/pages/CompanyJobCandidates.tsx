import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Star, ArrowLeft } from "lucide-react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { CompanySidebar } from "@/components/CompanySidebar";
import { useAuth } from "@/hooks/useAuth";
import { ChatBot } from "@/components/ChatBot";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RatingDialog } from "@/components/RatingDialog";
import { ContractDialog } from "@/components/ContractDialog";

export default function JobCandidates() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { toast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    applicationId: string;
    candidateId: string;
    candidateName: string;
  } | null>(null);
  const [contractDialog, setContractDialog] = useState<{
    open: boolean;
    applicationId: string;
    candidateId: string;
    candidateName: string;
  } | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchJobAndCandidates();
    }
  }, [id, user]);

  const fetchJobAndCandidates = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("company_id", user?.id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch applications for this job with ratings info
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:candidate_id (
            full_name,
            city,
            state,
            rating
          ),
          ratings!ratings_application_id_fkey (
            id,
            rating,
            rater_id
          )
        `)
        .eq("job_id", id);

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar candidatos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'contact_requested') {
        updateData.contract_status = 'pending';
      }

      const { error } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: newStatus === 'accepted' 
          ? "Candidato aceito! Uma notificação foi enviada." 
          : "Solicitação de contato enviada ao candidato.",
      });

      fetchJobAndCandidates();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDefineContract = async (startDate: string, endDate: string) => {
    if (!contractDialog) return;

    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: 'accepted',
          contract_status: 'pending',
          start_date: startDate,
          end_date: endDate,
          candidate_accepted: false
        })
        .eq("id", contractDialog.applicationId);

      if (error) throw error;

      // Criar notificação para o candidato
      await supabase
        .from("notifications")
        .insert({
          user_id: contractDialog.candidateId,
          title: "Nova Proposta de Contrato",
          message: `Você recebeu uma proposta de contrato de ${job?.title}. Revise e responda.`,
          type: "contract_proposal",
          related_id: contractDialog.applicationId
        });

      toast({
        title: "Contrato enviado!",
        description: "O candidato receberá uma notificação para aceitar.",
      });

      setContractDialog(null);
      fetchJobAndCandidates();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar contrato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateContractStatus = async (applicationId: string, newStatus: string) => {
    try {
      const updateData: any = { contract_status: newStatus };
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Contrato ${newStatus === 'active' ? 'iniciado' : 'finalizado'} com sucesso.`,
      });

      fetchJobAndCandidates();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "outline" },
      active: { label: "Ativo", variant: "default" },
      completed: { label: "Concluído", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    };
    const config = statusMap[status] || statusMap.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const hasRated = (application: any) => {
    return application.ratings?.some((r: any) => r.rater_id === user?.id);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        
        <NotificationsPanel />
      </header>

      {/* Sidebar */}
      <CompanySidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Candidatos da Vaga
          </h1>
          <Button
            onClick={() => navigate("/company-jobs")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {job && (
              <h2 className={`text-2xl font-semibold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                {job.title}
              </h2>
            )}

            {applications.length === 0 ? (
              <div className={`rounded-2xl shadow-sm p-12 mb-12 animate-fade-in ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <p className={`text-center leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Ainda não há candidatos para esta vaga.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className={`p-6 rounded-xl shadow-sm ${darkMode ? "bg-gray-700" : "bg-white"}`}
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-white">
                          {application.profiles?.full_name?.substring(0, 2).toUpperCase() || "??"}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {application.profiles?.full_name || "Nome não disponível"}
                          </h3>
                          {getStatusBadge(application.contract_status || 'pending')}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < Math.floor(application.profiles?.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {(application.profiles?.rating || 5.0).toFixed(1)}
                          </span>
                        </div>
                        
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Possui interesse na vaga
                        </p>

                        <div className="flex gap-3 mt-4 flex-wrap">
                          <Button
                            onClick={() => navigate(`/candidate-profile/${application.candidate_id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Ver Perfil
                          </Button>
                          
                          {application.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => setContractDialog({
                                  open: true,
                                  applicationId: application.id,
                                  candidateId: application.candidate_id,
                                  candidateName: application.profiles?.full_name || "Candidato"
                                })}
                                size="sm"
                              >
                                Aceitar e Definir Contrato
                              </Button>
                              <Button
                                onClick={() => handleUpdateStatus(application.id, 'contact_requested')}
                                variant="secondary"
                                size="sm"
                              >
                                Solicitar Contato
                              </Button>
                            </>
                          )}
                          
                          {(application.status === 'accepted' || application.status === 'contact_requested') && application.contract_status === 'pending' && (
                            <Button
                              onClick={() => handleUpdateContractStatus(application.id, 'active')}
                              size="sm"
                            >
                              Iniciar Contrato
                            </Button>
                          )}
                          
                          {application.contract_status === 'active' && (
                            <Button
                              onClick={() => handleUpdateContractStatus(application.id, 'completed')}
                              variant="secondary"
                              size="sm"
                            >
                              Finalizar Contrato
                            </Button>
                          )}
                          
                          {application.contract_status === 'completed' && !hasRated(application) && (
                            <Button
                              onClick={() => setRatingDialog({
                                open: true,
                                applicationId: application.id,
                                candidateId: application.candidate_id,
                                candidateName: application.profiles?.full_name || "Candidato"
                              })}
                              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                              size="sm"
                            >
                              <Star size={16} className="mr-1" />
                              Avaliar Candidato
                            </Button>
                          )}
                          
                          {application.contract_status === 'completed' && hasRated(application) && (
                            <Badge variant="secondary">✓ Avaliado</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {ratingDialog && (
        <RatingDialog
          open={ratingDialog.open}
          onOpenChange={(open) => !open && setRatingDialog(null)}
          applicationId={ratingDialog.applicationId}
          ratedUserId={ratingDialog.candidateId}
          ratedUserName={ratingDialog.candidateName}
          isRatingCandidate={true}
          onSuccess={() => {
            fetchJobAndCandidates();
            setRatingDialog(null);
          }}
        />
      )}
      
      {contractDialog && (
        <ContractDialog
          open={contractDialog.open}
          onOpenChange={(open) => !open && setContractDialog(null)}
          candidateName={contractDialog.candidateName}
          onConfirm={handleDefineContract}
        />
      )}
      
      <ChatBot />
    </div>
  );
}
