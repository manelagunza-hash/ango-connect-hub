
import React from 'react';
import { Users, Globe, Award, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const About = () => {
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
                  <BreadcrumbPage>Sobre</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">Sobre o Ango Connect</h1>
                <p className="text-lg text-gray-600 mb-6">
                  Nascemos com a missão de conectar profissionais qualificados a quem precisa de seus serviços, 
                  contribuindo para o desenvolvimento econômico e social de Angola.
                </p>
                <p className="text-lg text-gray-600">
                  A Ango Connect é uma plataforma 100% angolana, desenvolvida para atender às necessidades 
                  específicas do mercado local e promover o talento nacional.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517022812141-23620dba5c23" 
                  alt="Equipe Ango Connect" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
              <p className="text-lg text-gray-600">
                Empoderar profissionais angolanos e facilitar o acesso a serviços de qualidade em todo o país, 
                promovendo o desenvolvimento econômico e a criação de oportunidades de trabalho.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-secondary inline-block p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inclusão Digital</h3>
                <p className="text-gray-600">
                  Facilitar o acesso de profissionais tradicionais ao mundo digital, expandindo seu alcance de mercado.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-secondary inline-block p-4 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Presença Nacional</h3>
                <p className="text-gray-600">
                  Conectar todas as províncias de Angola, levando oportunidades a cada canto do país.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-secondary inline-block p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
                <p className="text-gray-600">
                  Promover e reconhecer serviços de excelência através do nosso sistema de avaliações.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-secondary inline-block p-4 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Crescimento</h3>
                <p className="text-gray-600">
                  Contribuir para o desenvolvimento econômico e a criação de empregos em Angola.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                  alt="História do Ango Connect" 
                  className="w-full h-auto"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
                <p className="text-lg text-gray-600 mb-6">
                  O Ango Connect nasceu da visão de jovens empreendedores angolanos que perceberam a dificuldade de encontrar 
                  profissionais qualificados e confiáveis para serviços cotidianos.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Em 2024, lançamos a plataforma com o objetivo de criar uma ponte entre prestadores de serviços e clientes, 
                  permitindo que talentos locais pudessem se destacar e expandir seus negócios.
                </p>
                <p className="text-lg text-gray-600">
                  Hoje, continuamos crescendo e inovando, com o compromisso de sempre melhorar a experiência de nossos 
                  usuários e contribuir para o desenvolvimento econômico de Angola.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="João Silva" 
                    className="object-cover w-full h-64"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">João Silva</h3>
                  <p className="text-accent mb-4">Fundador & CEO</p>
                  <p className="text-gray-600 text-sm">
                    Empreendedor apaixonado por tecnologia e inovação social.
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Maria Fernanda" 
                    className="object-cover w-full h-64"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">Maria Fernanda</h3>
                  <p className="text-accent mb-4">Diretora de Operações</p>
                  <p className="text-gray-600 text-sm">
                    Especialista em gestão de negócios e desenvolvimento organizacional.
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img 
                    src="https://randomuser.me/api/portraits/men/67.jpg" 
                    alt="Carlos Eduardo" 
                    className="object-cover w-full h-64"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">Carlos Eduardo</h3>
                  <p className="text-accent mb-4">Diretor de Tecnologia</p>
                  <p className="text-gray-600 text-sm">
                    Desenvolvedor full-stack com paixão por criar soluções inovadoras.
                  </p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img 
                    src="https://randomuser.me/api/portraits/women/17.jpg" 
                    alt="Ana Luísa" 
                    className="object-cover w-full h-64"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">Ana Luísa</h3>
                  <p className="text-accent mb-4">Diretora de Marketing</p>
                  <p className="text-gray-600 text-sm">
                    Especialista em estratégias de crescimento e campanhas digitais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Junte-se à Revolução dos Serviços em Angola</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Seja como cliente ou profissional, faça parte da comunidade Ango Connect e transforme a forma como os serviços são contratados e prestados.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Encontrar Serviços
              </Button>
              <Button className="bg-accent hover:bg-accent-hover">
                Oferecer Meus Serviços
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
