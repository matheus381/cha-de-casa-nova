'use client';

import { Button } from '@/components/ui/button';

interface DataLoadingGateProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
  children: React.ReactNode;
}

export function DataLoadingGate({
  isLoading,
  error,
  onRetry,
  loadingMessage = 'Carregando...',
  children,
}: DataLoadingGateProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider animate-pulse">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center backdrop-blur-md">
          <p className="text-sm font-semibold text-rose-400 mb-2">
            Erro ao carregar dados
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6">{error}</p>
          {onRetry && (
            <Button
              onClick={() => void onRetry()}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500"
            >
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
