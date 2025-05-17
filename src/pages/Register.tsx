
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário já estiver autenticado, redirecionar para a página inicial
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validação de senha
  const hasMinLength = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isPasswordValid) {
      setError("A senha não atende aos requisitos de segurança");
      return;
    }

    if (!termsAccepted) {
      setError("Você precisa aceitar os termos de serviço");
      return;
    }
    
    try {
      await signUp(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.phone || undefined
      );
      
      // O redirecionamento será feito pelo AuthContext se o registro for bem-sucedido
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar sua conta');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Crie sua conta</h1>
              <p className="text-gray-600 mt-2">
                Junte-se ao Ango Connect e conecte-se aos melhores profissionais
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Account Type Selection */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                type="button"
                variant={accountType === 'client' ? 'default' : 'outline'}
                className={`flex-1 ${accountType === 'client' ? 'bg-accent hover:bg-accent-hover' : ''}`}
                onClick={() => setAccountType('client')}
              >
                <User className="mr-2" size={18} />
                Cliente
              </Button>
              <Button
                type="button"
                variant={accountType === 'professional' ? 'default' : 'outline'}
                className={`flex-1 ${accountType === 'professional' ? 'bg-accent hover:bg-accent-hover' : ''}`}
                onClick={() => setAccountType('professional')}
              >
                <Briefcase className="mr-2" size={18} />
                Profissional
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="João da Silva"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+244 XXX XXX XXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Requisitos da senha:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    {hasMinLength ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={16} className="text-red-500 mr-2" />
                    )}
                    Pelo menos 8 caracteres
                  </li>
                  <li className="flex items-center">
                    {hasUpperCase ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={16} className="text-red-500 mr-2" />
                    )}
                    Pelo menos uma letra maiúscula
                  </li>
                  <li className="flex items-center">
                    {hasNumber ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={16} className="text-red-500 mr-2" />
                    )}
                    Pelo menos um número
                  </li>
                </ul>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-600">
                    Eu aceito os{" "}
                    <a className="font-medium text-accent hover:underline" href="/terms">
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a className="font-medium text-accent hover:underline" href="/privacy">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent-hover"
                disabled={!isPasswordValid || !termsAccepted}
              >
                Criar Conta
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">ou continue com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-accent hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
