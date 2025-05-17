
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria adicionada a lógica de envio do formulário
    console.log("Formulário enviado");
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
                  <BreadcrumbPage>Contato</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
              <p className="text-xl text-gray-600">
                Estamos aqui para ajudar. Entre em contato com a nossa equipe 
                para esclarecer dúvidas ou solicitar informações.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information + Form */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Informações de Contato</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Escritório Principal</h3>
                      <p className="text-gray-600">
                        Rua Principal, 123<br />
                        Namibe, Angola
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Telefone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+244123456789" className="hover:text-accent transition-colors">
                          +244 123 456 789
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contato@angoconnect.co.ao" className="hover:text-accent transition-colors">
                          contato@angoconnect.co.ao
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Horário de Atendimento</h3>
                      <p className="text-gray-600">
                        Segunda a Sexta: 8h às 18h<br />
                        Sábado: 9h às 13h<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Envie uma Mensagem</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="Digite seu nome completo" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input 
                      type="email" 
                      id="email" 
                      placeholder="Digite seu email" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input 
                      type="tel" 
                      id="phone" 
                      placeholder="+244 XXX XXX XXX" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <Input 
                      type="text" 
                      id="subject" 
                      placeholder="Digite o assunto" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="Digite sua mensagem"
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="bg-accent hover:bg-accent-hover w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa Localização</h2>
            
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231234.79867045096!2d12.938303509325424!3d-15.168721245064491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ba49f32b403a65d%3A0x8e5e091937ddaf7d!2sNamibe!5e0!3m2!1spt-PT!2sao!4v1648214758347!5m2!1spt-PT!2sao" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy"
                title="Mapa da localização do Ango Connect"
              ></iframe>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes sobre Contato</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Qual o tempo de resposta para mensagens?</h3>
                <p className="text-gray-600">
                  Respondemos todas as mensagens em até 24 horas úteis. Para assuntos urgentes, recomendamos entrar em contato por telefone.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como posso reportar um problema técnico?</h3>
                <p className="text-gray-600">
                  Você pode enviar um email para suporte@angoconnect.co.ao com detalhes do problema encontrado ou usar nosso formulário de contato.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Vocês atendem em outras províncias?</h3>
                <p className="text-gray-600">
                  Sim! Nossa plataforma está disponível em todas as províncias de Angola. O suporte é online, mas temos representantes em várias regiões.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Como posso me tornar um parceiro?</h3>
                <p className="text-gray-600">
                  Entre em contato pelo email parcerias@angoconnect.co.ao ou preencha o formulário especificando seu interesse em parceria.
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

export default Contact;
