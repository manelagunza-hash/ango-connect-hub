import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
  description: string;
  service_request_id: string;
}

const ProfessionalFinances: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('current-month');

  useEffect(() => {
    loadProfessionalData();
  }, [user]);

  useEffect(() => {
    if (professionalId) {
      loadPayments();
    }
  }, [professionalId, statusFilter, methodFilter, dateFilter]);

  const loadProfessionalData = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfessionalId(data.id);
    }
  };

  const loadPayments = async () => {
    if (!professionalId) return;

    try {
      setLoading(true);
      let query = supabase
        .from('payments')
        .select('*')
        .eq('professional_id', professionalId)
        .order('payment_date', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (methodFilter !== 'all') {
        query = query.eq('payment_method', methodFilter);
      }

      if (dateFilter === 'current-month') {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        query = query.gte('payment_date', start.toISOString()).lte('payment_date', end.toISOString());
      } else if (dateFilter === 'last-month') {
        const start = startOfMonth(subMonths(new Date(), 1));
        const end = endOfMonth(subMonths(new Date(), 1));
        query = query.gte('payment_date', start.toISOString()).lte('payment_date', end.toISOString());
      } else if (dateFilter === 'last-3-months') {
        const start = subMonths(new Date(), 3);
        query = query.gte('payment_date', start.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments((data as Payment[]) || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalEarningsCurrentMonth = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPending = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const averageTicket = payments.length > 0
    ? totalEarningsCurrentMonth / payments.filter(p => p.status === 'completed').length
    : 0;

  // Monthly earnings for chart (last 12 months)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    const monthName = format(date, 'MMM');
    const monthPayments = payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return paymentDate.getMonth() === date.getMonth() &&
             paymentDate.getFullYear() === date.getFullYear() &&
             p.status === 'completed';
    });
    const total = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return { month: monthName, earnings: total };
  });

  // Payment methods distribution
  const methodsData = [
    { name: 'Dinheiro', value: payments.filter(p => p.payment_method === 'dinheiro' && p.status === 'completed').length },
    { name: 'Transferência', value: payments.filter(p => p.payment_method === 'transferencia' && p.status === 'completed').length },
    { name: 'Multicaixa', value: payments.filter(p => p.payment_method === 'multicaixa' && p.status === 'completed').length },
    { name: 'Outro', value: payments.filter(p => p.payment_method === 'outro' && p.status === 'completed').length },
  ].filter(m => m.value > 0);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const handleExportCSV = () => {
    const csv = [
      ['Data', 'Valor', 'Método', 'Status', 'Descrição'].join(','),
      ...payments.map(p => [
        format(new Date(p.payment_date), 'dd/MM/yyyy'),
        p.amount,
        p.payment_method,
        p.status,
        p.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Relatório exportado!');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-muted-foreground">Acompanhe seus ganhos e pagamentos</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ganhos (Mês Atual)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarningsCurrentMonth.toLocaleString()} Kz</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending.toLocaleString()} Kz</div>
            <p className="text-xs text-muted-foreground">{pendingPayments.length} pagamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTicket.toLocaleString()} Kz</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Este período</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Ganhos Mensais</TabsTrigger>
          <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Ganhos dos Últimos 12 Meses</CardTitle>
              <CardDescription>Histórico de ganhos mensais</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2} name="Ganhos (Kz)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Métodos de Pagamento</CardTitle>
              <CardDescription>Como você recebe seus pagamentos</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {methodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Lista completa de todos os seus pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Label>Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="current-month">Mês Atual</SelectItem>
                  <SelectItem value="last-month">Mês Passado</SelectItem>
                  <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Método</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="multicaixa">Multicaixa</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.payment_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{Number(payment.amount).toLocaleString()} Kz</TableCell>
                      <TableCell className="capitalize">{payment.payment_method}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{payment.description || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalFinances;
