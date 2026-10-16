import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Share,
  PlusSquare,
  ArrowDownToLine,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect if already running in standalone mode (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback: download web shortcut / manifest launcher
      downloadDesktopShortcut();
    }
  };

  const downloadDesktopShortcut = () => {
    const shortcutContent = `[InternetShortcut]\nURL=${window.location.origin}\nIconIndex=0\n`;
    const blob = new Blob([shortcutContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NowTech-Solar-App.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setInstallSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Download className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Baixar & Instalar Aplicativo</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PWA OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                NowTech Solar no seu Celular ou Computador com acesso rápido
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Quick Action Button */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Instalação Automática Direta
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {isInstalled
                  ? 'O aplicativo já está instalado no seu ambiente!'
                  : 'Instale o aplicativo na sua tela inicial para trabalhar em tela cheia.'}
              </p>
            </div>

            <button
              onClick={handleInstallClick}
              className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{deferredPrompt ? 'Instalar Agora' : 'Baixar Acesso Direto'}</span>
            </button>
          </div>

          {installSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Solicitação de instalação enviada! Verifique a tela inicial do seu dispositivo.</span>
            </div>
          )}

          {/* OS Switcher Tabs */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">Instruções por dispositivo:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('android')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  activeTab === 'android'
                    ? 'bg-slate-800 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  activeTab === 'ios'
                    ? 'bg-slate-800 text-sky-400 border-sky-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Computador</span>
              </button>
            </div>
          </div>

          {/* Tab Content Instructions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            {activeTab === 'android' && (
              <div className="space-y-2.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Instalar no Android (Google Chrome ou Edge):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1 leading-relaxed">
                  <li>Toque no botão de menu <strong className="text-white">(os 3 pontinhos ⋮ no canto superior direito)</strong> do Chrome.</li>
                  <li>Selecione a opção <strong className="text-amber-400">“Instalar aplicativo”</strong> ou <strong className="text-amber-400">“Adicionar à tela inicial”</strong>.</li>
                  <li>Confirme o nome <strong className="text-white">NowTech Solar</strong> e toque em <strong className="text-amber-400">“Instalar”</strong>.</li>
                  <li>O ícone será adicionado automaticamente à sua tela inicial como um app nativo.</li>
                </ol>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-2.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Apple className="w-4 h-4 text-sky-400" />
                  Instalar no iPhone / iPad (Safari):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1 leading-relaxed">
                  <li>Abra esta página no navegador <strong className="text-white">Safari</strong>.</li>
                  <li>Toque no botão de <strong className="text-sky-400">Compartilhar</strong> (ícone com quadrado e seta apontando para cima <Share className="w-3.5 h-3.5 inline mx-0.5" />).</li>
                  <li>Role as opções para baixo e toque em <strong className="text-amber-400">“Adicionar à Tela de Início”</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />.</li>
                  <li>Toque em <strong className="text-white">“Adicionar”</strong> no canto superior direito.</li>
                </ol>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="space-y-2.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  Instalar no Computador (Chrome, Edge ou Brave):
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1 leading-relaxed">
                  <li>Observe a barra de endereços do navegador (onde fica o link).</li>
                  <li>Clique no ícone de <strong className="text-emerald-400">Instalar Aplicativo</strong> (ou no menu de 3 pontos &gt; “Instalar NowTech Solar”).</li>
                  <li>O sistema criará um atalho na área de trabalho e abrirá em janela dedicada sem barras de navegador.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Vantagens */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Acesso rápido na tela inicial</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Interface fluida para celular e PC</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">NowTech Solar v2.4 · 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
