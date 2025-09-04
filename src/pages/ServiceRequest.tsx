import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ServiceRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    urgency: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Faça login para solicitar um serviço');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          urgency: formData.urgency,
          client_id: user.id
        });

      if (error) throw error;

      toast.success('Solicitação criada com sucesso!');
      navigate('/client-dashboard');
    } catch (error: any) {
      console.error('Erro ao criar solicitação:', error);
      toast.error(`Erro ao criar solicitação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Solicitar Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Título do Serviço</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Reparo elétrico no quarto"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva detalhadamente o serviço necessário..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Endereço ou região"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Orçamento (Opcional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgência</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Criando...' : 'Criar Solicitação'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRequest;