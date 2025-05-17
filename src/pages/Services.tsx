
import React, { useState } from 'react';
import { Search, Star, MapPin, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const serviceCategories = [
  {
    title: "Eletricista",
    description: "Instalações, reparos e manutenção elétrica residencial e comercial",
    icon: "lightning",
    link: "/services/eletricista"
  },
  {
    title: "Pedreiro",
    description: "Construção civil, reformas e acabamentos de qualidade",
    icon: "building",
    link: "/services/pedreiro"
  },
  {
    title: "Cabeleireiro",
    description: "Cortes, tratamentos e estilos para todos os tipos de cabelo",
    icon: "scissors",
    link: "/services/cabeleireiro"
  },
  {
    title: "Informática",
    description: "Suporte técnico, manutenção de computadores e redes",
    icon: "laptop",
    link: "/services/informatica"
  },
  {
    title: "Contador",
    description: "Serviços contábeis, declaração de impostos e consultoria financeira",
    icon: "calculator",
    link: "/services/contador"
  },
  {
    title: "Encanador",
    description: "Reparos hidráulicos, instalação de tubulações e desentupimentos",
    icon: "droplet",
    link: "/services/encanador"
  }
];

const provincias = [
  "Luanda", "Benguela", "Huambo", "Cabinda", "Malanje", 
  "Bié", "Uíge", "Namibe", "Cunene", "Moxico"
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [rating, setRating] = useState(0);

  // Handlers simulados para os filtros
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-custom">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Serviços</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-2">Serviços Disponíveis</h1>
          <p className="text-gray-600 mb-8">
            Encontre profissionais de confiança em todas as províncias de Angola
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="w-full lg:w-1/4">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Filter className="mr-2 size-5" /> Filtros
                  </h3>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium mb-2">
                        Buscar serviço
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input 
                          id="search"
                          placeholder="Ex: Eletricista"
                          className="pl-10"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>

                    {/* Province */}
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium mb-2 flex items-center">
                        <MapPin className="mr-1 size-4" /> Província
                      </label>
                      <select
                        id="province"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                      >
                        <option value="">Todas as províncias</option>
                        {provincias.map((provincia) => (
                          <option key={provincia} value={provincia}>{provincia}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium mb-2 flex items-center">
                        <Star className="mr-1 size-4 fill-yellow-400 text-yellow-400" /> Avaliação mínima
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="p-1"
                          >
                            <Star 
                              size={20} 
                              className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Apply Filters */}
                    <Button className="w-full bg-accent hover:bg-accent-hover">
                      Aplicar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Categories Grid */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceCategories.map((service, index) => {
                  // Importar dinamicamente o ícone correto usando o nome
                  const IconComponent = () => {
                    const getLucideIcon = () => {
                      switch(service.icon) {
                        case 'lightning': return <Search className="h-8 w-8 text-primary" />;
                        case 'building': return <MapPin className="h-8 w-8 text-primary" />;
                        case 'scissors': return <Star className="h-8 w-8 text-primary" />;
                        case 'laptop': return <Search className="h-8 w-8 text-primary" />;
                        case 'calculator': return <MapPin className="h-8 w-8 text-primary" />;
                        case 'droplet': return <Filter className="h-8 w-8 text-primary" />;
                        default: return <Search className="h-8 w-8 text-primary" />;
                      }
                    };
                    return getLucideIcon();
                  };

                  return (
                    <ServiceCard
                      key={index}
                      title={service.title}
                      description={service.description}
                      icon={IconComponent}
                      link={service.link}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Featured Professionals Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Profissionais em Destaque</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <img 
                      src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'men' : 'women'}/${item + 10}.jpg`}
                      alt="Profissional"
                      className="object-cover w-full h-48"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">
                      {item % 2 === 0 ? 'João Silva' : 'Maria Fernanda'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {['Eletricista', 'Pedreiro', 'Cabeleireira', 'Técnico de Informática'][item - 1]}
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={`${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(24)</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <MapPin size={14} className="mr-1" />
                      {['Luanda', 'Benguela', 'Huambo', 'Cabinda'][item - 1]}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="bg-accent hover:bg-accent-hover">
                Ver Todos os Profissionais
              </Button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
