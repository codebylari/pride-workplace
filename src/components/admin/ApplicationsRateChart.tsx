import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ApplicationsRateChartProps {
  data: Array<{
    name: string;
    candidaturas: number;
    vagas: number;
  }>;
}

export function ApplicationsRateChart({ data }: ApplicationsRateChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Candidaturas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="candidaturas" 
              fill="hsl(var(--primary))" 
              name="Candidaturas"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="vagas" 
              fill="hsl(var(--accent))" 
              name="Vagas"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
