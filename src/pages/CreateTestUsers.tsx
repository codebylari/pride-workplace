import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateTestUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const createUsers = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-test-users');
      
      if (error) throw error;
      
      setResults(data.results);
      toast.success(data.message);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erro ao criar usuários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Criar Usuários de Teste</h1>
            <p className="text-muted-foreground">
              Cria automaticamente 11 usuários de teste no banco de dados
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Usuários que serão criados:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 5 candidatos (candidato1@teste.com até candidato5@teste.com)</li>
                <li>• 5 empresas (empresa1@teste.com até empresa5@teste.com)</li>
                <li>• 1 admin (admin@teste.com)</li>
                <li>• Senha para todos: <code className="bg-background px-2 py-1 rounded">Senha123!</code></li>
              </ul>
            </div>

            <Button
              onClick={createUsers}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? 'Criando usuários...' : 'Criar Usuários de Teste'}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Resultados:</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        result.success ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      {result.success ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{result.email}</p>
                        {result.error && (
                          <p className="text-sm text-muted-foreground">
                            {result.error}
                          </p>
                        )}
                        {result.userId && (
                          <p className="text-xs text-muted-foreground font-mono">
                            UUID: {result.userId}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateTestUsers;
