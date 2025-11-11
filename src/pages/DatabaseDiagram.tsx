import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

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

        <div className="bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Diagrama ER - LINKAR
          </h1>
          <p className="text-muted-foreground mb-6">
            Diagrama de Entidades e Relacionamentos do banco de dados
          </p>

          <div className="bg-white rounded-lg p-4 overflow-auto">
            <img 
              src="/database-er-diagram.svg" 
              alt="Database ER Diagram"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDiagram;
