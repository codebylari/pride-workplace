import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const DatabaseDiagram = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/database-er-diagram.svg';
    link.download = 'linkar-database-er-diagram.svg';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar SVG
          </Button>
        </div>

        <Card className="p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Diagrama ER - LINKAR
          </h1>
          <p className="text-muted-foreground mb-4">
            Diagrama de Entidades e Relacionamentos do banco de dados
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Relacionamentos Inclusos
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>✓ <strong>AUTH.USERS → USER_ROLES</strong> (1:N) - Usuários têm papéis</li>
              <li>✓ <strong>USER_ROLES → PROFILES</strong> (1:1) - Papel vinculado ao perfil de candidato</li>
              <li>✓ <strong>USER_ROLES → COMPANY_PROFILES</strong> (1:1) - Papel vinculado ao perfil de empresa</li>
              <li>✓ <strong>PROFILES → SWIPES</strong> (1:N) - Candidatos fazem swipes</li>
              <li>✓ <strong>COMPANY_PROFILES → SWIPES</strong> (1:N) - Empresas fazem swipes</li>
              <li>✓ <strong>AUTH.USERS → NOTIFICATIONS</strong> (1:N) - Usuários recebem notificações</li>
              <li>✓ <strong>USER_ROLES → ADMIN_LOGS</strong> (1:N) - Admins geram logs</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 overflow-auto border">
            <img 
              src="/database-er-diagram.svg" 
              alt="Database ER Diagram"
              className="w-full h-auto"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseDiagram;
