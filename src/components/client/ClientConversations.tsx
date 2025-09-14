import { Card, CardContent } from '@/components/ui/card';

export function ClientConversations() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Conversas</h1>
        <p className="text-sm text-muted-foreground">
          Converse com profissionais sobre seus projetos
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Sistema de conversas em desenvolvimento.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Em breve você poderá conversar diretamente com os profissionais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}