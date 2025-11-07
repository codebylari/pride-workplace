import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AlertItem {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
}

interface SystemAlertsProps {
  alerts: AlertItem[];
}

export function SystemAlerts({ alerts }: SystemAlertsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sistema funcionando normalmente. Nenhum alerta no momento.
              </AlertDescription>
            </Alert>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className={getAlertClass(alert.type)}>
                {getIcon(alert.type)}
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
