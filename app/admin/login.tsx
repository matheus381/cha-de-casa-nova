'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminLoginProps {
  children: React.ReactNode;
}

export function AdminLogin({ children }: AdminLoginProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin-auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (user === adminUser && password === adminPass) {
      localStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Login Admin
          </h1>

          <Input
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>

      {children}
    </>
  );
}