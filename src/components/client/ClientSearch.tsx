import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, MapPin, Star, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Professional {
  id: string;
  name: string;
  email: string;
  profession: string;
  description?: string;
  location?: string;
  rating?: number;
  total_reviews?: number;
  hourly_rate?: number;
  phone?: string;
  is_available: boolean;
  is_verified: boolean;
}

export function ClientSearch() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchTerm, selectedProfession, selectedLocation]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      toast.error('Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProfession) {
      filtered = filtered.filter(p => p.profession === selectedProfession);
    }

    if (selectedLocation) {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }

    setFilteredProfessionals(filtered);
  };

  const getUniqueProfessions = () => {
    return [...new Set(professionals.map(p => p.profession))];
  };

  const getUniqueLocations = () => {
    return [...new Set(professionals.map(p => p.location).filter(Boolean))];
  };

  const handleRequestService = (professionalId: string) => {
    navigate(`/service-request?professional=${professionalId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Buscar Profissionais</h1>
        <p className="text-sm text-muted-foreground">
          Encontre profissionais qualificados para seus projetos
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, profissão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as profissões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as profissões</SelectItem>
                {getUniqueProfessions().map(profession => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as localizações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as localizações</SelectItem>
                {getUniqueLocations().map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Profissionais */}
      {filteredProfessionals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum profissional encontrado com os filtros aplicados.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{professional.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Badge variant="outline">{professional.profession}</Badge>
                      {professional.is_verified && (
                        <Badge variant="default" className="text-xs">Verificado</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    {professional.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{professional.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({professional.total_reviews})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {professional.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {professional.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {professional.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {professional.location}
                      </div>
                    )}
                    
                    {professional.hourly_rate && (
                      <div className="text-sm font-medium">
                        AOA {professional.hourly_rate.toLocaleString('pt-BR')}/hora
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {/* Ver perfil completo */}}
                    >
                      Ver Perfil
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRequestService(professional.id)}
                    >
                      Solicitar Serviço
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}