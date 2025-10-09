import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PROFESSIONS = [
  'Encanador', 'Eletricista', 'Pedreiro', 'Pintor', 'Carpinteiro',
  'Mecânico', 'Jardineiro', 'Técnico de Informática', 'Professor Particular', 'Outro'
];

const STEPS = [
  { id: 1, name: 'Informações Básicas', icon: Circle },
  { id: 2, name: 'Serviços', icon: Circle },
  { id: 3, name: 'Portfólio', icon: Circle },
  { id: 4, name: 'Certificações', icon: Circle },
  { id: 5, name: 'Disponibilidade', icon: Circle },
  { id: 6, name: 'Revisão', icon: CheckCircle2 }
];

const ProfessionalOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    description: '',
    hourly_rate: ''
  });

  // Step 2: Services
  const [services, setServices] = useState<Array<{
    service_name: string;
    description: string;
    base_price: string;
    estimated_duration: string;
  }>>([{ service_name: '', description: '', base_price: '', estimated_duration: '' }]);

  // Step 3: Portfolio
  const [portfolio, setPortfolio] = useState<Array<{
    title: string;
    description: string;
    project_date: string;
  }>>([{ title: '', description: '', project_date: '' }]);

  // Step 4: Certifications
  const [certifications, setCertifications] = useState<Array<{
    title: string;
    issuer: string;
    issue_date: string;
  }>>([{ title: '', issuer: '', issue_date: '' }]);

  // Step 5: Availability
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '09:00', end: '18:00' },
    tuesday: { available: true, start: '09:00', end: '18:00' },
    wednesday: { available: true, start: '09:00', end: '18:00' },
    thursday: { available: true, start: '09:00', end: '18:00' },
    friday: { available: true, start: '09:00', end: '18:00' },
    saturday: { available: false, start: '09:00', end: '18:00' },
    sunday: { available: false, start: '09:00', end: '18:00' }
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    newOpportunities: true,
    proposalUpdates: true,
    messages: true,
    reviews: true
  });

  useEffect(() => {
    loadProfessionalData();
  }, [user]);

  const loadProfessionalData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfessionalId(data.id);
      setBasicInfo({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        profession: data.profession || '',
        location: data.location || '',
        description: data.description || '',
        hourly_rate: data.hourly_rate?.toString() || ''
      });

      if (data.availability_schedule) {
        setAvailability(data.availability_schedule as any);
      }
      if (data.notification_preferences) {
        setNotifications(data.notification_preferences as any);
      }
    }
  };

  const saveStep = async () => {
    if (!user || !professionalId) return;

    try {
      setLoading(true);

      if (currentStep === 1) {
        const { error } = await supabase
          .from('professionals')
          .update({
            name: basicInfo.name,
            email: basicInfo.email,
            phone: basicInfo.phone,
            profession: basicInfo.profession,
            location: basicInfo.location,
            description: basicInfo.description,
            hourly_rate: parseFloat(basicInfo.hourly_rate)
          })
          .eq('id', professionalId);

        if (error) throw error;
      }

      if (currentStep === 2) {
        const validServices = services.filter(s => s.service_name.trim());
        
        if (validServices.length > 0) {
          await supabase.from('professional_services').delete().eq('professional_id', professionalId);
          
          const { error } = await supabase
            .from('professional_services')
            .insert(validServices.map(s => ({
              professional_id: professionalId,
              service_name: s.service_name,
              description: s.description,
              base_price: parseFloat(s.base_price),
              estimated_duration: parseInt(s.estimated_duration)
            })));

          if (error) throw error;
        }
      }

      if (currentStep === 3) {
        const validPortfolio = portfolio.filter(p => p.title.trim());
        
        if (validPortfolio.length > 0) {
          await supabase.from('professional_portfolio').delete().eq('professional_id', professionalId);
          
          const { error } = await supabase
            .from('professional_portfolio')
            .insert(validPortfolio.map(p => ({
              professional_id: professionalId,
              title: p.title,
              description: p.description,
              project_date: p.project_date
            })));

          if (error) throw error;
        }
      }

      if (currentStep === 4) {
        const validCerts = certifications.filter(c => c.title.trim());
        
        if (validCerts.length > 0) {
          await supabase.from('professional_certifications').delete().eq('professional_id', professionalId);
          
          const { error } = await supabase
            .from('professional_certifications')
            .insert(validCerts.map(c => ({
              professional_id: professionalId,
              title: c.title,
              issuer: c.issuer,
              issue_date: c.issue_date
            })));

          if (error) throw error;
        }
      }

      if (currentStep === 5) {
        const { error } = await supabase
          .from('professionals')
          .update({
            availability_schedule: availability,
            notification_preferences: notifications
          })
          .eq('id', professionalId);

        if (error) throw error;
      }

      toast.success('Progresso salvo!');
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('Erro ao salvar progresso');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await saveStep();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await saveStep();

      const { error } = await supabase
        .from('professionals')
        .update({ onboarding_completed: true })
        .eq('id', professionalId);

      if (error) throw error;

      toast.success('Perfil profissional completo!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Erro ao finalizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Nome Completo *</Label>
          <Input
            value={basicInfo.name}
            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
            placeholder="Seu nome"
          />
        </div>
        <div>
          <Label>Email *</Label>
          <Input
            type="email"
            value={basicInfo.email}
            onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Telefone</Label>
          <Input
            value={basicInfo.phone}
            onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
            placeholder="+244 900 000 000"
          />
        </div>
        <div>
          <Label>Profissão *</Label>
          <Select value={basicInfo.profession} onValueChange={(v) => setBasicInfo({ ...basicInfo, profession: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Localização *</Label>
          <Input
            value={basicInfo.location}
            onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
            placeholder="Luanda, Angola"
          />
        </div>
        <div>
          <Label>Taxa por Hora (Kz)</Label>
          <Input
            type="number"
            value={basicInfo.hourly_rate}
            onChange={(e) => setBasicInfo({ ...basicInfo, hourly_rate: e.target.value })}
            placeholder="5000"
          />
        </div>
      </div>

      <div>
        <Label>Descrição Profissional</Label>
        <Textarea
          value={basicInfo.description}
          onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
          placeholder="Descreva sua experiência e especialidades..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Adicione os serviços que você oferece</p>
      {services.map((service, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Serviço</Label>
                <Input
                  value={service.service_name}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].service_name = e.target.value;
                    setServices(newServices);
                  }}
                  placeholder="Ex: Instalação Elétrica"
                />
              </div>
              <div>
                <Label>Preço Base (Kz)</Label>
                <Input
                  type="number"
                  value={service.base_price}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].base_price = e.target.value;
                    setServices(newServices);
                  }}
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Duração Estimada (horas)</Label>
                <Input
                  type="number"
                  value={service.estimated_duration}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index].estimated_duration = e.target.value;
                    setServices(newServices);
                  }}
                  placeholder="2"
                />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={service.description}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].description = e.target.value;
                  setServices(newServices);
                }}
                placeholder="Descreva o serviço..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => setServices([...services, { service_name: '', description: '', base_price: '', estimated_duration: '' }])}
        className="w-full"
      >
        + Adicionar Serviço
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Adicione projetos ao seu portfólio (máximo 6)</p>
      {portfolio.slice(0, 6).map((item, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Título do Projeto</Label>
                <Input
                  value={item.title}
                  onChange={(e) => {
                    const newPortfolio = [...portfolio];
                    newPortfolio[index].title = e.target.value;
                    setPortfolio(newPortfolio);
                  }}
                  placeholder="Nome do projeto"
                />
              </div>
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={item.project_date}
                  onChange={(e) => {
                    const newPortfolio = [...portfolio];
                    newPortfolio[index].project_date = e.target.value;
                    setPortfolio(newPortfolio);
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={item.description}
                onChange={(e) => {
                  const newPortfolio = [...portfolio];
                  newPortfolio[index].description = e.target.value;
                  setPortfolio(newPortfolio);
                }}
                placeholder="Descreva o projeto..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      {portfolio.length < 6 && (
        <Button
          variant="outline"
          onClick={() => setPortfolio([...portfolio, { title: '', description: '', project_date: '' }])}
          className="w-full"
        >
          + Adicionar Projeto
        </Button>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Adicione suas certificações e qualificações</p>
      {certifications.map((cert, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Título da Certificação</Label>
                <Input
                  value={cert.title}
                  onChange={(e) => {
                    const newCerts = [...certifications];
                    newCerts[index].title = e.target.value;
                    setCertifications(newCerts);
                  }}
                  placeholder="Nome do certificado"
                />
              </div>
              <div>
                <Label>Emissor</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => {
                    const newCerts = [...certifications];
                    newCerts[index].issuer = e.target.value;
                    setCertifications(newCerts);
                  }}
                  placeholder="Instituição"
                />
              </div>
            </div>
            <div>
              <Label>Data de Emissão</Label>
              <Input
                type="date"
                value={cert.issue_date}
                onChange={(e) => {
                  const newCerts = [...certifications];
                  newCerts[index].issue_date = e.target.value;
                  setCertifications(newCerts);
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => setCertifications([...certifications, { title: '', issuer: '', issue_date: '' }])}
        className="w-full"
      >
        + Adicionar Certificação
      </Button>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Horários de Disponibilidade</h3>
        <div className="space-y-3">
          {Object.entries(availability).map(([day, schedule]) => (
            <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-32 capitalize">{day}</div>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={schedule.available}
                  onChange={(e) => setAvailability({
                    ...availability,
                    [day]: { ...schedule, available: e.target.checked }
                  })}
                />
                {schedule.available && (
                  <>
                    <Input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => setAvailability({
                        ...availability,
                        [day]: { ...schedule, start: e.target.value }
                      })}
                      className="w-32"
                    />
                    <span>até</span>
                    <Input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => setAvailability({
                        ...availability,
                        [day]: { ...schedule, end: e.target.value }
                      })}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Preferências de Notificação</h3>
        <div className="space-y-2">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
              />
              <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold">Revisão Final</h3>
        <p className="text-muted-foreground">Revise suas informações antes de finalizar</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nome:</strong> {basicInfo.name}</p>
            <p><strong>Profissão:</strong> {basicInfo.profession}</p>
            <p><strong>Localização:</strong> {basicInfo.location}</p>
            <p><strong>Taxa/hora:</strong> {basicInfo.hourly_rate} Kz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Serviços ({services.filter(s => s.service_name).length})</CardTitle>
          </CardHeader>
          <CardContent>
            {services.filter(s => s.service_name).map((s, i) => (
              <Badge key={i} className="mr-2 mb-2">{s.service_name}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos no Portfólio ({portfolio.filter(p => p.title).length})</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.filter(p => p.title).map((p, i) => (
              <Badge key={i} variant="outline" className="mr-2 mb-2">{p.title}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificações ({certifications.filter(c => c.title).length})</CardTitle>
          </CardHeader>
          <CardContent>
            {certifications.filter(c => c.title).map((c, i) => (
              <Badge key={i} variant="secondary" className="mr-2 mb-2">{c.title}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const progress = (currentStep / 6) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete seu Perfil Profissional</h1>
            <p className="text-muted-foreground">Passo {currentStep} de 6</p>
            <Progress value={progress} className="mt-4" />
          </div>

          <div className="grid grid-cols-6 gap-2 mb-8">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`text-center ${step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                ) : (
                  <Circle className="w-6 h-6 mx-auto mb-1" />
                )}
                <p className="text-xs hidden md:block">{step.name}</p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Preencha suas informações básicas'}
                {currentStep === 2 && 'Liste os serviços que você oferece'}
                {currentStep === 3 && 'Adicione projetos ao seu portfólio'}
                {currentStep === 4 && 'Adicione suas certificações'}
                {currentStep === 5 && 'Configure sua disponibilidade'}
                {currentStep === 6 && 'Revise todas as informações'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep < 6 ? (
              <Button onClick={handleNext} disabled={loading}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Você pode pular etapas e completá-las depois nas configurações
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessionalOnboarding;
