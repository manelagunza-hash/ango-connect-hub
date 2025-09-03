import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Users, MessageSquare, Star, FileText, BarChart3 } from "lucide-react";
import ProfessionalsManagement from "@/components/admin/ProfessionalsManagement";
import ServiceRequestsManagement from "@/components/admin/ServiceRequestsManagement";
import ConversationsManagement from "@/components/admin/ConversationsManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import DashboardStats from "@/components/admin/DashboardStats";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <Badge variant="secondary" className="ml-auto">
              PFLGMANEGER
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Gerencie profissionais, solicitações, conversas e avaliações em um só lugar.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profissionais
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Solicitações
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="professionals" className="space-y-6">
            <ProfessionalsManagement />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <ServiceRequestsManagement />
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <ConversationsManagement />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure parâmetros gerais do sistema de gestão.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Aprovação Automática</h3>
                    <p className="text-sm text-muted-foreground">
                      Aprovar automaticamente novos profissionais
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Notificações</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurar notificações por email
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Backup de Dados</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurar backup automático dos dados
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;