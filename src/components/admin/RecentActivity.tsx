import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityItem {
  id: string;
  name: string;
  type: 'candidate' | 'company' | 'job';
  created_at: string;
  photo_url?: string;
  logo_url?: string;
}

interface RecentActivityProps {
  title: string;
  items: ActivityItem[];
  onViewAll?: () => void;
}

export function RecentActivity({ title, items, onViewAll }: RecentActivityProps) {
  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      candidate: 'Candidato',
      company: 'Empresa',
      job: 'Vaga'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs text-primary hover:underline"
          >
            Ver todos
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum registro recente
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.photo_url || item.logo_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitial(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getTypeLabel(item.type)} • {formatDistanceToNow(new Date(item.created_at), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
