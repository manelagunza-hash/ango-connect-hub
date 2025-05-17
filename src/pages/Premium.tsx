
import React from 'react';
import { Check, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useSubscription, SubscriptionPlan } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  features: {
    included: boolean;
    text: string;
  }[];
  buttonText: string;
  highlighted?: boolean;
}

const Premium = () => {
  const { user } = useAuth();
  const { currentPlan, purchasePlan, isLoading } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: "Básico",
      price: "Grátis",
      description: "Para quem está começando a explorar serviços",
      features: [
        { included: true, text: "Acesso à pesquisa de profissionais" },
        { included: true, text: "Visualização limitada de perfis" },
        { included: true, text: "Visualização de avaliações" },
        { included: false, text: "Contato direto com profissionais" },
        { included: false, text: "Solicitações prioritárias" },
        { included: false, text: "Perfil verificado" },
      ],
      buttonText: "Plano Atual",
    },
    {
      id: 'premium',
      name: "Premium",
      price: "1.500 Kz",
      description: "Para quem busca o melhor acesso a serviços",
      features: [
        { included: true, text: "Acesso ilimitado à pesquisa" },
        { included: true, text: "Visualização completa de perfis" },
        { included: true, text: "Contato direto com profissionais" },
        { included: true, text: "Solicitações prioritárias" },
        { included: true, text: "Perfil verificado" },
        { included: true, text: "Suporte prioritário 24/7" },
      ],
      buttonText: "Escolher Premium",
      highlighted: true,
    },
    {
      id: 'professional',
      name: "Profissional",
      price: "3.500 Kz",
      description: "Para prestadores de serviços",
      features: [
        { included: true, text: "Perfil profissional destacado" },
        { included: true, text: "Visibilidade aumentada nas buscas" },
        { included: true, text: "Sistema de gestão de clientes" },
        { included: true, text: "Ferramentas de orçamento" },
        { included: true, text: "Acesso a estatísticas detalhadas" },
        { included: true, text: "Suporte especializado para negócios" },
      ],
      buttonText: "Escolher Profissional",
    },
  ];

  // Atualiza o texto do botão e destaque conforme o plano atual do usuário
  const updatedPricingPlans = pricingPlans.map(plan => ({
    ...plan,
    buttonText: plan.id === currentPlan ? "Plano Atual" : plan.buttonText,
    highlighted: plan.id === currentPlan || plan.highlighted && currentPlan !== 'premium' && currentPlan !== 'professional'
  }));

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para assinar um plano.",
      });
      navigate('/login');
      return;
    }

    if (plan === currentPlan) {
      toast({
        title: "Este já é seu plano atual",
        description: "Você já está inscrito neste plano.",
      });
      return;
    }

    if (plan === 'basic' && currentPlan !== 'basic') {
      toast({
        title: "Downgrade para plano básico",
        description: "Para fazer downgrade para o plano básico, cancele sua assinatura atual.",
      });
      return;
    }

    try {
      await purchasePlan(plan);
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Planos Premium</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Escolha o Plano Ideal</h1>
              <p className="text-xl text-gray-600 mb-8">
                Desbloqueie recursos exclusivos e tenha a melhor experiência no Ango Connect
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {updatedPricingPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-lg shadow-lg p-8 border ${
                    plan.highlighted ? 'border-accent border-2 relative' : 'border-gray-100'
                  } flex flex-col h-full`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-accent text-white text-xs font-bold uppercase py-1 px-4 rounded-full">
                        {plan.id === currentPlan ? 'Seu Plano' : 'Mais Popular'}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                    <div className="text-4xl font-bold text-accent mb-2">
                      {plan.price}
                      {plan.price !== "Grátis" && <span className="text-lg text-gray-500"> /mês</span>}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-gray-800" : "text-gray-400"}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.id === currentPlan 
                        ? "bg-green-500 hover:bg-green-600"
                        : plan.highlighted && plan.id !== currentPlan
                        ? "bg-accent hover:bg-accent-hover"
                        : "bg-primary hover:bg-primary-hover"
                    }`}
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isLoading || plan.id === currentPlan}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Compare os Recursos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left font-semibold">Recurso</th>
                    <th className="py-4 px-6 text-center font-semibold">Básico</th>
                    <th className="py-4 px-6 text-center font-semibold bg-accent/10">Premium</th>
                    <th className="py-4 px-6 text-center font-semibold">Profissional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-4 px-6">Busca de profissionais</td>
                    <td className="py-4 px-6 text-center">Limitada</td>
                    <td className="py-4 px-6 text-center bg-accent/5">Ilimitada</td>
                    <td className="py-4 px-6 text-center">Ilimitada</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-4 px-6">Contato com profissionais</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center bg-accent/5">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-4 px-6">Perfil destacado</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center bg-accent/5">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-4 px-6">Solicitações prioritárias</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center bg-accent/5">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-4 px-6">Suporte ao cliente</td>
                    <td className="py-4 px-6 text-center">Básico</td>
                    <td className="py-4 px-6 text-center bg-accent/5">Prioritário</td>
                    <td className="py-4 px-6 text-center">Especializado</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-4 px-6">Ferramentas de negócio</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center bg-accent/5">
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim, você pode cancelar sua assinatura a qualquer momento. O cancelamento entrará em vigor no final do período de cobrança atual.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como funciona o pagamento?</h3>
                <p className="text-gray-600">
                  Aceitamos pagamentos via transferência bancária, cartão de crédito e soluções de pagamento móvel como Multicaixa Express.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Existe um período de teste?</h3>
                <p className="text-gray-600">
                  Oferecemos um período de teste gratuito de 7 dias para os planos Premium e Profissional, sem compromisso.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Quais são os benefícios de ser Premium?</h3>
                <p className="text-gray-600">
                  Como usuário Premium, você terá acesso prioritário aos melhores profissionais, contato direto, suporte exclusivo e muito mais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-white">
          <div className="container-custom text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Pronto para Elevar sua Experiência?</h2>
            <p className="text-xl mb-8">
              Escolha o plano ideal para você e desfrute de todos os recursos que o Ango Connect tem a oferecer.
            </p>
            <Button 
              className="bg-accent hover:bg-accent-hover text-lg px-8 py-6"
              onClick={() => {
                const premiumPlan = updatedPricingPlans.find(p => p.id === 'premium');
                if (premiumPlan && premiumPlan.id !== currentPlan) {
                  handlePlanSelection('premium');
                } else if (currentPlan === 'premium') {
                  toast({
                    title: "Você já é um usuário Premium",
                    description: "Você já está aproveitando todos os benefícios do plano Premium.",
                  });
                }
              }}
              disabled={isLoading || currentPlan === 'premium' || currentPlan === 'professional'}
            >
              {currentPlan === 'premium' || currentPlan === 'professional' 
                ? "Você já possui um plano premium" 
                : "Escolher Plano Premium"}
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;
