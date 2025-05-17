
import React from 'react';
import { ArrowRight, Search, UserCheck, Star, Calendar, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepCard from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const howItWorksSteps = [
  {
    title: "Busque Serviços",
    description: "Pesquise o serviço que você precisa em nossa plataforma",
    icon: Search,
    step: 1
  },
  {
    title: "Compare Profissionais",
    description: "Veja avaliações, perfis e preços de diversos prestadores",
    icon: UserCheck,
    step: 2
  },
  {
    title: "Agende um Horário",
    description: "Marque diretamente com o profissional escolhido",
    icon: Calendar,
    step: 3
  },
  {
    title: "Receba o Serviço",
    description: "O profissional realiza o trabalho no local combinado",
    icon: MessageCircle,
    step: 4
  },
  {
    title: "Avalie o Serviço",
    description: "Compartilhe sua experiência e ajude outros usuários",
    icon: Star,
    step: 5
  }
];

const HowItWorks = () => {
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
                  <BreadcrumbPage>Como Funciona</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Como o Ango Connect Funciona</h1>
              <p className="text-xl text-gray-600 mb-8">
                Conectamos profissionais qualificados às pessoas que precisam dos seus serviços
                de forma simples, segura e eficiente.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-14">O processo é simples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <StepCard
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    step={step.step}
                  />
                  
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:flex justify-center mt-6">
                      <ArrowRight className="text-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button className="bg-accent hover:bg-accent-hover text-lg px-8 py-6">
                Encontrar Profissionais Agora
              </Button>
            </div>
          </div>
        </section>

        {/* For Professionals */}
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Para Profissionais</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Se você é um profissional qualificado, o Ango Connect é a plataforma ideal para expandir seus negócios e encontrar novos clientes.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <span className="bg-accent text-white p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Crie um perfil profissional destacando suas habilidades</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Receba solicitações de orçamento diretamente no seu telefone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Gerencie sua agenda e compromissos em um só lugar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Construa sua reputação com avaliações positivas de clientes</span>
                  </li>
                </ul>

                <Button className="bg-primary hover:bg-primary-hover">
                  Registrar como Profissional
                </Button>
              </div>

              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Profissional utilizando Ango Connect" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como sei se um profissional é confiável?</h3>
                <p className="text-gray-600">
                  Todos os profissionais do Ango Connect passam por um processo de verificação de documentos. Além disso, você pode conferir as avaliações de outros clientes antes de contratar.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Preciso pagar para utilizar a plataforma?</h3>
                <p className="text-gray-600">
                  O uso básico do Ango Connect é totalmente gratuito. Apenas alguns recursos premium são pagos, mas você pode encontrar e contratar profissionais sem nenhum custo.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como funciona o pagamento pelos serviços?</h3>
                <p className="text-gray-600">
                  O pagamento é combinado diretamente entre você e o profissional. A plataforma não realiza cobranças sobre os serviços prestados.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">O que fazer se tiver problemas com um serviço?</h3>
                <p className="text-gray-600">
                  Caso tenha problemas com algum serviço, você pode reportar através da plataforma e nossa equipe de suporte irá intermediar a situação.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
