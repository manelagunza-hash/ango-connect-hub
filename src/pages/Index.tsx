
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import StepCard from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { User, Search, Handshake, Zap, Hammer, Scissors, Computer, Calculator } from 'lucide-react';

const Index = () => {
  // Serviços em destaque
  const featuredServices = [
    {
      title: 'Eletricista',
      description: 'Instalações, reparos e manutenção elétrica para sua casa ou empresa.',
      icon: Zap,
      link: '/services/electrician'
    },
    {
      title: 'Pedreiro',
      description: 'Construção, renovação e acabamentos para seus projetos.',
      icon: Hammer,
      link: '/services/builder'
    },
    {
      title: 'Cabeleireiro',
      description: 'Cortes, penteados e tratamentos para todos os tipos de cabelo.',
      icon: Scissors,
      link: '/services/hairdresser'
    },
    {
      title: 'Informática',
      description: 'Suporte técnico, manutenção e conserto de computadores e redes.',
      icon: Computer,
      link: '/services/it'
    },
    {
      title: 'Contador',
      description: 'Serviços contábeis, fiscais e financeiros para pessoas e empresas.',
      icon: Calculator,
      link: '/services/accountant'
    }
  ];

  // Depoimentos
  const testimonials = [
    {
      name: 'João Silva',
      role: 'Cliente',
      comment: 'Encontrei um eletricista excelente através do Ango Connect. Serviço rápido e preço justo!',
      imageSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop'
    },
    {
      name: 'Maria Luísa',
      role: 'Profissional',
      comment: 'Desde que me cadastrei como cabeleireira, minha agenda está sempre cheia. Recomendo a todos os profissionais!',
      imageSrc: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1374&auto=format&fit=crop'
    },
    {
      name: 'António Manuel',
      role: 'Cliente',
      comment: 'A plataforma facilitou muito encontrar um técnico de informática qualificado para minha empresa.',
      imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                  Conectando Angola, um serviço de cada vez.
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8">
                  Encontre eletricistas, pedreiros, cabeleireiros, técnicos de informática e muito mais.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-white text-primary hover:bg-gray-100 font-bold text-base py-6 px-8"
                    size="lg"
                  >
                    <Link to="/services">Quero Contratar</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-white text-white hover:bg-white/10 font-bold text-base py-6 px-8"
                    size="lg"
                  >
                    <Link to="/register">Quero Trabalhar</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Serviços em Angola" 
                  className="rounded-lg shadow-lg max-w-full h-auto animate-fade-in" 
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Como Funciona</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conectar-se a profissionais qualificados em Angola nunca foi tão fácil.
                Siga estes simples passos:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                title="Cadastro"
                description="Crie sua conta como cliente ou profissional em poucos minutos."
                icon={User}
                step={1}
              />
              <StepCard
                title="Busca"
                description="Encontre o serviço que precisa com filtros por localização e categoria."
                icon={Search}
                step={2}
              />
              <StepCard
                title="Contratação e Pagamento"
                description="Negocie, contrate e pague pelo serviço de forma segura."
                icon={Handshake}
                step={3}
              />
            </div>
          </div>
        </section>

        {/* Serviços em Destaque */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Serviços em Destaque</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conheça algumas das categorias mais populares disponíveis na nossa plataforma.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={service.link}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Depoimentos</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Veja o que nossos usuários estão dizendo sobre o Ango Connect.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  comment={testimonial.comment}
                  imageSrc={testimonial.imageSrc}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Chamada para Parceria */}
        <section className="py-12 bg-primary text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Quer destacar seu serviço?
                </h2>
                <p className="text-gray-100">
                  Conheça nosso plano Premium e alcance mais clientes.
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white/10 font-bold"
                size="lg"
              >
                <Link to="/premium">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
