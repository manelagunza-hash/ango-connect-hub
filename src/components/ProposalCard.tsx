import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, User, DollarSign } from 'lucide-react';

interface Proposal {
  id: string;
  service_request_id: string;
  professional_id: string;
  price: number;
  message: string;
  estimated_duration: number;
  status: string;
  created_at: string;
  professionals?: {
    name?: string;
    email?: string;
    profession?: string;
    rating?: number;
    total_reviews?: number;
    hourly_rate?: number;
  };
}

interface ProposalCardProps {
  proposal: Proposal;
  onUpdate: () => void;
  canRespond?: boolean;
}

export const ProposalCard = ({ proposal, onUpdate, canRespond = false }: ProposalCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleAcceptProposal = async () => {
    setLoading(true);
    try {
      // Aceitar a proposta
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', proposal.id);

      if (proposalError) throw proposalError;

      // Rejeitar outras propostas da mesma solicitação
      const { error: rejectError } = await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .neq('id', proposal.id)
        .eq('service_request_id', proposal.service_request_id);

      if (rejectError) throw rejectError;

      // Atualizar a solicitação de serviço
      const { error: serviceError } = await supabase
        .from('service_requests')
        .update({ 
          status: 'contratado',
          professional_id: proposal.professional_id
        })
        .eq('id', proposal.service_request_id);

      if (serviceError) throw serviceError;

      toast.success('Proposta aceita! O profissional foi contratado.');
      onUpdate();
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      toast.error('Erro ao aceitar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProposal = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .eq('id', proposal.id);

      if (error) throw error;

      toast.success('Proposta rejeitada.');
      onUpdate();
    } catch (error) {
      console.error('Erro ao rejeitar proposta:', error);
      toast.error('Erro ao rejeitar proposta');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Aguardando', variant: 'secondary' as const, icon: Clock },
      accepted: { label: 'Aceita', variant: 'outline' as const, icon: CheckCircle },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const, icon: XCircle },
      withdrawn: { label: 'Retirada', variant: 'outline' as const, icon: XCircle }
    };
    
    const statusInfo = config[status as keyof typeof config] || config.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const professional = proposal.professionals;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{professional?.name}</CardTitle>
              <CardDescription>{professional?.profession}</CardDescription>
            </div>
          </div>
          {getStatusBadge(proposal.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Valor Proposto:</span>
              <p>R$ {proposal.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Duração:</span>
              <p>{proposal.estimated_duration}h</p>
            </div>
          </div>
        </div>

        {professional && (
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium">Avaliação:</span>
              <p>{professional.rating || 'Sem avaliações'} 
                {professional.total_reviews > 0 && ` (${professional.total_reviews})`}
              </p>
            </div>
            <div>
              <span className="font-medium">Valor/hora:</span>
              <p>R$ {professional.hourly_rate}</p>
            </div>
          </div>
        )}

        {proposal.message && (
          <div>
            <span className="font-medium text-sm">Mensagem:</span>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {proposal.message}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Enviada em {new Date(proposal.created_at).toLocaleDateString('pt-BR')} às{' '}
          {new Date(proposal.created_at).toLocaleTimeString('pt-BR')}
        </div>

        {canRespond && proposal.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil Completo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Perfil do Profissional</DialogTitle>
                  <DialogDescription>
                    {professional?.name} - {professional?.profession}
                  </DialogDescription>
                </DialogHeader>
                {professional && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p>{professional.email}</p>
                      </div>
                      <div>
                        <span className="font-medium">Valor por hora:</span>
                        <p>R$ {professional.hourly_rate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Avaliação:</span>
                        <p>{professional.rating || 'Sem avaliações'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total de avaliações:</span>
                        <p>{professional.total_reviews}</p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Proposta completa:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {proposal.message || 'Nenhuma mensagem adicional'}
                      </p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleRejectProposal}
              disabled={loading}
            >
              Rejeitar
            </Button>
            <Button 
              size="sm" 
              onClick={handleAcceptProposal}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Aceitar'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};