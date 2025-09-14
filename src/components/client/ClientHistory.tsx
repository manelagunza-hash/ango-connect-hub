import { Card, CardContent } from '@/components/ui/card';

export function ClientHistory() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
        <p className="text-sm text-muted-foreground">
          Visualize seus projetos concluídos e avaliações
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Histórico de projetos em desenvolvimento.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aqui você poderá ver todos os seus projetos concluídos e dar avaliações.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}