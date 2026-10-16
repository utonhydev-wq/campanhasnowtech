import React, { useState } from 'react';
import {
  Sun,
  LayoutDashboard,
  Megaphone,
  Layers,
  CheckSquare,
  Gift,
  Calendar,
  BarChart3,
  Plus,
  RefreshCw,
  Database,
  Menu,
  X,
  Sparkles,
  Download,
  Smartphone,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignId } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenSyncModal: () => void;
  onOpenInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewTaskModal,
  onOpenSyncModal,
  onOpenInstallModal,
}) => {
  const { syncStatus, selectedCampaignId, setSelectedCampaignId, state } = useCampaigns();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Count pending prices
  const pendingPricesCount = state.solarKits.filter(
    (k) => k.originalPrice === null || k.promotionalPrice === null
  ).length;

  // Count pending approvals
  const pendingApprovalsCount = state.tasks.filter(
    (t) => t.status === 'aguardando_aprovacao'
  ).length;

  const pendingEditorialCount = (state.editorialPosts || []).filter(
    (p) => p.status === 'aguardando_aprovacao'
  ).length;

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
    { id: 'editorial', label: 'Editorial', icon: Sparkles, badge: pendingEditorialCount > 0 ? `${pendingEditorialCount}` : null },
    { id: 'kits', label: 'Kits & Preços', icon: Layers, badge: pendingPricesCount > 0 ? `${pendingPricesCount}` : null },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null },
    { id: 'premiacoes', label: 'Premiações', icon: Gift },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'indicadores', label: 'Indicadores', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setSelectedCampaignId('all');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                  NowTech <span className="text-amber-400">Solar</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase whitespace-nowrap">
                  Campanhas Q4 · 2026
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action, Download App & Sync Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Download / Install App Button */}
            <button
              onClick={onOpenInstallModal}
              title="Baixar ou instalar aplicativo no celular e PC"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all active:scale-95 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-semibold">Baixar App</span>
            </button>

            {/* Sync Status Button */}
            <button
              onClick={onOpenSyncModal}
              title={syncStatus.isServerConnected ? 'Sincronizado com servidor compartilhado' : 'Armazenamento local ativo'}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus.isServerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono text-[11px] text-slate-300 hidden xl:inline">
                {syncStatus.isServerConnected ? 'Nuvem Conectada' : 'Modo Local'}
              </span>
              <Database className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Quick Add Task Button */}
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-sm shadow-amber-500/20 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Nova Tarefa</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-xs font-mono font-bold rounded bg-amber-500/20 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {/* Install App Button in Mobile Drawer */}
            <button
              onClick={() => {
                onOpenInstallModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Baixar Aplicativo no Celular / PC
              </span>
              <span className="font-mono text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                PWA
              </span>
            </button>

            <button
              onClick={() => {
                onOpenSyncModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Status de Sincronização & Backup
              </span>
              <span className="font-mono text-emerald-400">
                {syncStatus.isServerConnected ? 'Nuvem OK' : 'Local'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
