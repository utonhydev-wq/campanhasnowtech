import React from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Flame,
  Gift,
  Megaphone,
  ShoppingBag,
  TrendingUp,
  Users,
  Video,
  ArrowRight,
  ShieldAlert,
  Store,
  MapPin,
  ChevronRight,
  SunMedium,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignId, SolarKit, Task } from '../types';

interface DashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectCampaign: (id: CampaignId) => void;
  onOpenKitModal: (kit?: SolarKit) => void;
  onOpenTaskModal: (task?: Task) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onSelectCampaign,
  onOpenKitModal,
  onOpenTaskModal,
}) => {
  const { state } = useCampaigns();
  const { campaigns, solarKits, tasks, awards, balloonAction, christmasPamphlet, christmasVideoWorkflow, metrics } = state;

  // Reference date: 2026-10-13
  const refDate = new Date('2026-10-13T10:32:36');
  const preBlackLaunchDate = new Date('2026-10-29T00:00:00');
  const msDiff = preBlackLaunchDate.getTime() - refDate.getTime();
  const daysToLaunch = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

  // Critical Alerts Calculations
  const undefinedPricesKits = solarKits.filter(
    (k) => k.originalPrice === null || k.promotionalPrice === null
  );

  const pendingApprovalTasks = tasks.filter((t) => t.status === 'aguardando_aprovacao');
  const inProgressTasks = tasks.filter((t) => t.status === 'em_andamento');
  const completedTasks = tasks.filter((t) => t.status === 'concluida');

  // Materials needing production or approval
  const pendingMaterials = tasks.filter(
    (t) =>
      (t.category === 'panfleto' || t.category === 'social_media') &&
      t.status !== 'concluida'
  );

  // Videos and Ads pending
  const pendingVideos = tasks.filter(
    (t) => t.category === 'video_trafego' && t.status !== 'concluida'
  );

  // In-person activations
  const inPersonActions = tasks.filter(
    (t) => (t.category === 'acao_loja' || t.category === 'acao_rua') && t.status !== 'concluida'
  );

  // Consolidated Results
  const totalRevenue = metrics.reduce((acc, m) => acc + m.revenue, 0);
  const totalSales = metrics.reduce((acc, m) => acc + m.salesClosed, 0);
  const totalLeads = metrics.reduce((acc, m) => acc + m.leads, 0);
  const totalInvestment = metrics.reduce((acc, m) => acc + m.paidTrafficInvestment, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO LAUNCHPAD: Próximo Lançamento Countdown */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold tracking-wide uppercase">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                LANÇAMENTO PRÉ-BLACK
              </span>
              <span>·</span>
              <span className="text-slate-300 font-normal">Início em 29/10/2026</span>
              <span>·</span>
              <span className="text-slate-400 font-mono">16 Dias Restantes</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
              “A Black Friday Solar está chegando: começa o maior aquecimento do ano!”
            </h1>

            <p className="text-sm sm:text-base text-slate-300">
              Painel unificado da NowTech Solar para controle estratégico, preços promocionais dos kits,
              ações presenciais, premiações e captação de leads de Outubro a Dezembro de 2026.
            </p>
          </div>

          {/* Countdown & Action Block */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-6">
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
                  {daysToLaunch}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Dias p/ Estreia</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                  5
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Kits no Aquecimento</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-center">
                <span className="block text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                  7
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Ações Estratégicas</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCampaign('pre-black');
                onNavigateTab('campanhas');
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 transition-colors"
            >
              <span>Acessar Pré-Black Solar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. ALERTA CRÍTICO: PREÇOS A DEFINIR */}
      {undefinedPricesKits.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 mt-0.5 sm:mt-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span>Atenção Comercial: {undefinedPricesKits.length} kits com valores promocionais a definir</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  A equipe ainda não preencheu e aprovou os preços originais e promocionais de: {' '}
                  <span className="font-semibold text-white">
                    {undefinedPricesKits.map((k) => `${k.name} (${k.campaignId === 'pre-black' ? 'Pré-Black' : 'Black Oficial'})`).join(', ')}
                  </span>.
                  A aprovação é obrigatória antes da impressão dos panfletos e do tráfego pago.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('kits')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 self-end sm:self-center"
            >
              Definir Preços Agora
            </button>
          </div>
        </div>
      )}

      {/* 3. QUADRO GERAL DAS 3 CAMPANHAS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Campanhas Q4 2026</h2>
            <p className="text-xs text-slate-400">
              Cronograma oficial protegido contra alterações não autorizadas.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('calendario')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Ver Calendário Completo
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {campaigns.map((camp) => {
            const isPreBlack = camp.slug === 'pre-black';
            const isBlackFriday = camp.slug === 'black-friday';
            const isNatal = camp.slug === 'natal';

            const borderClass = isPreBlack
              ? 'border-amber-500/30 hover:border-amber-500/60'
              : isBlackFriday
              ? 'border-emerald-500/30 hover:border-emerald-500/60'
              : 'border-sky-500/30 hover:border-sky-500/60';

            const badgeBg = isPreBlack
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : isBlackFriday
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-sky-500/20 text-sky-300 border-sky-500/30';

            const campTasks = tasks.filter((t) => t.campaignId === camp.slug);
            const campKits = solarKits.filter((k) => k.campaignId === camp.slug);
            const campDefinedKits = campKits.filter(
              (k) => k.originalPrice !== null && k.promotionalPrice !== null
            );

            return (
              <div
                key={camp.id}
                className={`flex flex-col justify-between rounded-xl bg-slate-900 border ${borderClass} p-5 transition-all hover:bg-slate-850 shadow-sm`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded border ${badgeBg}`}>
                      {camp.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {camp.startDate.split('-').reverse().slice(0, 2).join('/')} a {camp.endDate.split('-').reverse().slice(0, 2).join('/')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-amber-300 font-medium mt-0.5 line-clamp-1 italic">
                      “{camp.officialCall}”
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {camp.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Kits Participantes:</span>
                      <span className="font-mono font-semibold text-white">
                        {campKits.length} kits ({campDefinedKits.length} precificados)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Tarefas Cadastradas:</span>
                      <span className="font-mono font-semibold text-white">
                        {campTasks.length} ações
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectCampaign(camp.slug);
                      onNavigateTab('campanhas');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                  >
                    <span>Abrir Página da Campanha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PAINEL DE CONTROLE DE PENDÊNCIAS E STATUS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tarefas Pendentes & Atrasadas */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tarefas & Produção</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {pendingApprovalTasks.length + inProgressTasks.length}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              ({pendingApprovalTasks.length} aguardando aprovação)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {completedTasks.length} de {tasks.length} atividades concluídas no total.
          </p>
          <button
            onClick={() => onNavigateTab('tarefas')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium pt-1 flex items-center gap-1"
          >
            Gerenciar tarefas <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: Materiais Gráficos & Panfletos */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Materiais & Panfletos</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {pendingMaterials.length}
            </span>
            <span className="text-xs text-sky-400 font-medium">
              em produção/revisão
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Panfletos Pré-Black e Panfleto de Natal (Pós-Black).
          </p>
          <button
            onClick={() => onNavigateTab('campanhas')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium pt-1 flex items-center gap-1"
          >
            Ver panfletos e artes <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Vídeos & Tráfego Pago */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Vídeos & Anúncios</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {pendingVideos.length}
            </span>
            <span className="text-xs text-purple-400 font-medium">
              vídeos em produção
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Inclui roteiro de Natal em 9 etapas e vídeos Black Friday.
          </p>
          <button
            onClick={() => {
              onSelectCampaign('natal');
              onNavigateTab('campanhas');
            }}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium pt-1 flex items-center gap-1"
          >
            Ver fluxo de vídeos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Premiações da Black Friday */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Premiações "Fechou, Ganhou!"</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              3
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Prêmios Oficiais
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ventilador, Air fryer e Ar-condicionado (60 unidades previstas).
          </p>
          <button
            onClick={() => onNavigateTab('premiacoes')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1 flex items-center gap-1"
          >
            Painel de premiações <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 5. AÇÕES PRESENCIAIS & DESTAQUES OPERACIONAIS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloco 1: Ações Presenciais Programadas */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Ações Presenciais Programadas</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{inPersonActions.length} ativas</span>
          </div>

          <div className="space-y-3">
            {/* Ação em Loja Pré-Black */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Ambientação no Showroom NowTech</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                    Pré-Black
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Totens promocionais dos 5 kits, script de recepção e banners temáticos.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Resp: Rodrigo Antunes</span>
                  <span>·</span>
                  <span className="font-mono text-amber-300">Prazo: 28/10/2026</span>
                </div>
              </div>
            </div>

            {/* Ação na Rua Pré-Black */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Blitz de Panfletagem Externa</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                    Pré-Black
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  4 pontos comerciais de grande fluxo com promotores uniformizados e QR Code.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Resp: Rodrigo Antunes</span>
                  <span>·</span>
                  <span className="font-mono text-amber-300">Prazo: 29/10/2026</span>
                </div>
              </div>
            </div>

            {/* Ação Estoura Balão Natal */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-sky-500/20 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Dinâmica "Estoura Balão"</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-500/20 text-sky-300 rounded">
                    Natal 2026
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  100 balões com descontos exclusivos e brindes para quem realizar simulação ou fechar proposta.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Resp: {balloonAction.responsible}</span>
                  <span>·</span>
                  <span className="font-mono text-sky-300">10 a 24/12/2026</span>
                  <span>·</span>
                  <span className="text-slate-400 font-mono">Status: {balloonAction.executionStatus}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectCampaign('natal');
                  onNavigateTab('campanhas');
                }}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 underline shrink-0 mt-1"
              >
                Detalhes
              </button>
            </div>
          </div>
        </div>

        {/* Bloco 2: Acompanhamento de Resultados & Indicadores */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Indicadores de Vendas & Resultados</h3>
            </div>
            <button
              onClick={() => onNavigateTab('indicadores')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Registrar / Analisar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Investimento Tráfego</span>
              <span className="text-lg font-mono font-bold text-white tabular-nums">
                {totalInvestment > 0 ? `R$ ${totalInvestment.toLocaleString('pt-BR')}` : 'R$ 0,00'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Baseado em dados reais</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Leads Registrados</span>
              <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">
                {totalLeads}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Meta Q4: 250 leads</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Vendas Concretizadas</span>
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                {totalSales}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Contratos assinados</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Faturamento Total</span>
              <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                {totalRevenue > 0 ? `R$ ${totalRevenue.toLocaleString('pt-BR')}` : 'R$ 0,00'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {totalSales > 0 ? `Ticket Médio: R$ ${(totalRevenue / totalSales).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}` : 'Aguardando fechamentos'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-white font-medium">
              <span>Comparativo entre Campanhas:</span>
              <span className="text-[11px] font-mono text-slate-400">Pré-Black vs Black Oficial vs Natal</span>
            </div>
            <p>
              Os indicadores são calculados estritamente com base nos lançamentos comerciais reais
              registrados na aba de Indicadores.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
