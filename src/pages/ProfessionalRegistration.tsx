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

const ProfessionalRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    description: '',
    location: '',
    hourly_rate: ''
  });

  const professions = [
    'Eletricista',
    'Pedreiro',
    'Encanador',
    'Pintor',
    'Carpinteiro',
    'Mecânico',
    'Jardineiro',
    'Técnico em Informática',
    'Limpeza Doméstica',
    'Outro'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Faça login para se registrar como profissional');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profession: formData.profession,
          description: formData.description,
          location: formData.location,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null
        });

      if (error) throw error;

      toast.success('Cadastro profissional criado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Erro ao criar cadastro profissional:', error);
      toast.error(`Erro ao criar cadastro: ${error.message}`);
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
              <CardTitle className="text-2xl text-center">Cadastro Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+244 XXX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="profession">Profissão</Label>
                  <Select value={formData.profession} onValueChange={(value) => handleInputChange('profession', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua profissão" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição dos Serviços</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva sua experiência e serviços oferecidos..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Localização de Atendimento</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Regiões onde atende"
                  />
                </div>

                <div>
                  <Label htmlFor="hourly_rate">Taxa por Hora (Kz)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar como Profissional'}
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

export default ProfessionalRegistration;