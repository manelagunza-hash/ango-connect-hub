import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Filter, Zap, Building, Scissors, Laptop, Calculator, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
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
    icon: Zap,
    link: "/services/eletricista"
  },
  {
    title: "Pedreiro",
    description: "Construção civil, reformas e acabamentos de qualidade",
    icon: Building,
    link: "/services/pedreiro"
  },
  {
    title: "Cabeleireiro",
    description: "Cortes, tratamentos e estilos para todos os tipos de cabelo",
    icon: Scissors,
    link: "/services/cabeleireiro"
  },
  {
    title: "Informática",
    description: "Suporte técnico, manutenção de computadores e redes",
    icon: Laptop,
    link: "/services/informatica"
  },
  {
    title: "Contador",
    description: "Serviços contábeis, declaração de impostos e consultoria financeira",
    icon: Calculator,
    link: "/services/contador"
  },
  {
    title: "Encanador",
    description: "Reparos hidráulicos, instalação de tubulações e desentupimentos",
    icon: Droplet,
    link: "/services/encanador"
  }
];

const provincias = [
  "Luanda", "Benguela", "Huambo", "Cabinda", "Malanje", 
  "Bié", "Uíge", "Namibe", "Cunene", "Moxico"
];

interface Professional {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  total_reviews: number;
  hourly_rate: number;
  is_verified: boolean;
}

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [rating, setRating] = useState(0);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, selectedProvince, rating, professionals]);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(prof => 
        prof.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(prof => 
        prof.location.includes(selectedProvince)
      );
    }

    if (rating > 0) {
      filtered = filtered.filter(prof => prof.rating >= rating);
    }

    setFilteredProfessionals(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
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
                    <Button onClick={filterProfessionals} className="w-full bg-accent hover:bg-accent-hover">
                      Aplicar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Categories Grid */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceCategories.map((service, index) => (
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
          </div>

          {/* Featured Professionals Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Profissionais Disponíveis</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfessionals.slice(0, 8).map((prof) => (
                  <Card key={prof.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="flex items-center justify-center h-48 text-6xl">
                        {prof.profession === 'Eletricista' && '⚡'}
                        {prof.profession === 'Pedreiro' && '🏗️'}
                        {prof.profession === 'Encanador' && '🔧'}
                        {prof.profession === 'Pintor' && '🎨'}
                        {prof.profession === 'Carpinteiro' && '🔨'}
                        {prof.profession === 'Limpeza Doméstica' && '🧹'}
                        {prof.profession === 'Jardineiro' && '🌱'}
                        {prof.profession === 'Técnico em Informática' && '💻'}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{prof.name}</h3>
                        {prof.is_verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{prof.profession}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={`${star <= Math.floor(prof.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({prof.total_reviews})</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin size={14} className="mr-1" />
                        {prof.location}
                      </div>
                      <div className="text-sm font-semibold text-primary mb-3">
                        {prof.hourly_rate.toLocaleString('pt-AO')} AOA/hora
                      </div>
                      <Link to="/service-request">
                        <Button 
                          variant="outline" 
                          className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                        >
                          Contratar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && filteredProfessionals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum profissional encontrado com os filtros selecionados.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedProvince("");
                    setRating(0);
                  }}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
            
            {!loading && filteredProfessionals.length > 8 && (
              <div className="text-center mt-10">
                <Button className="bg-accent hover:bg-accent-hover">
                  Ver Mais Profissionais
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;