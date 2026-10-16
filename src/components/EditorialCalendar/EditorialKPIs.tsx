import React from 'react';
import {
  Calendar,
  Layers,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Share2,
  Users,
  MousePointer,
  Sparkles,
} from 'lucide-react';
import { EditorialPost } from '../../types';

interface EditorialKPIsProps {
  posts: EditorialPost[];
  currentDateRef: string; // '2026-10-13'
}

export const EditorialKPIs: React.FC<EditorialKPIsProps> = ({ posts, currentDateRef }) => {
  const totalPlanned = posts.length;
  const mondayPosts = posts.filter((p) => p.contentType === 'post').length;
  const thursdayCarousels = posts.filter((p) => p.contentType === 'carrossel').length;

  const pendingProduction = posts.filter(
    (p) => p.status === 'ideia' || p.status === 'em_producao' || p.status === 'em_revisao'
  ).length;

  const awaitingApproval = posts.filter((p) => p.status === 'aguardando_aprovacao').length;
  const approved = posts.filter((p) => p.status === 'aprovado').length;
  const scheduled = posts.filter((p) => p.status === 'agendado').length;
  const published = posts.filter((p) => p.status === 'publicado').length;

  // Overdue check: scheduled date < currentDateRef and not published or canceled
  const overdue = posts.filter(
    (p) => p.scheduledDate < currentDateRef && p.status !== 'publicado' && p.status !== 'cancelado'
  ).length;

  // Unassigned check
  const unassigned = posts.filter((p) => !p.responsible || p.responsible.trim() === '').length;

  // Aggregated results
  const totalReach = posts.reduce((acc, p) => acc + (p.results?.reach || 0), 0);
  const totalInteractions = posts.reduce((acc, p) => acc + (p.results?.interactions || 0), 0);
  const totalClicks = posts.reduce((acc, p) => acc + (p.results?.clicks || 0), 0);
  const totalLeads = posts.reduce((acc, p) => acc + (p.results?.leads || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Alert Banners if any overdue or awaiting approval */}
      {(overdue > 0 || awaitingApproval > 0 || unassigned > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overdue > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">Alerta de Atraso Editorial:</span>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  {overdue} publicação(ões) com data anterior a 13/10/2026 ainda não foram marcadas como publicadas.
                </p>
              </div>
            </div>
          )}

          {awaitingApproval > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Aprovação Pendente da Gestão:</span>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  {awaitingApproval} publicação(ões) aguardam revisão formal de texto e preços promocionais antes do agendamento.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
        {/* Total Planejadas */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Planejadas
          </span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">{totalPlanned}</span>
          <span className="text-[10px] text-slate-500 block">Q4 2026</span>
        </div>

        {/* Segundas (Posts) */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
            Segunda (Posts)
          </span>
          <span className="text-xl font-bold font-mono text-sky-300 tabular-nums">{mondayPosts}</span>
          <span className="text-[10px] text-slate-500 block">Posts da Semana</span>
        </div>

        {/* Quintas (Carrosséis) */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
            Quinta (Carrosséis)
          </span>
          <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">{thursdayCarousels}</span>
          <span className="text-[10px] text-slate-500 block">Carrosséis de Fotos</span>
        </div>

        {/* Pendentes */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Em Produção
          </span>
          <span className="text-xl font-bold font-mono text-slate-200 tabular-nums">{pendingProduction}</span>
          <span className="text-[10px] text-slate-500 block">Ideia / Criação</span>
        </div>

        {/* Aguardando Aprovação */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
            P/ Aprovação
          </span>
          <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">{awaitingApproval}</span>
          <span className="text-[10px] text-slate-500 block">Coordenação</span>
        </div>

        {/* Aprovadas / Agendadas */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Aprovados / Agendados
          </span>
          <span className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
            {approved + scheduled}
          </span>
          <span className="text-[10px] text-slate-500 block">Prontos p/ Postar</span>
        </div>

        {/* Publicadas */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
            Publicadas
          </span>
          <span className="text-xl font-bold font-mono text-sky-300 tabular-nums">{published}</span>
          <span className="text-[10px] text-slate-500 block">Com link no ar</span>
        </div>

        {/* Atrasadas */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/20 space-y-1">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
            Atrasadas
          </span>
          <span className="text-xl font-bold font-mono text-rose-300 tabular-nums">{overdue}</span>
          <span className="text-[10px] text-slate-500 block">Exigem atenção</span>
        </div>
      </div>

      {/* Aggregate Performance row if any results are recorded */}
      {(totalReach > 0 || totalInteractions > 0 || totalClicks > 0 || totalLeads > 0) && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Métricas Reais Consolidadas das Redes Sociais:</span>
          </span>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Alcance Total:</span>
              <span className="font-bold text-white">{totalReach.toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Interações:</span>
              <span className="font-bold text-sky-400">{totalInteractions.toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Cliques no Link:</span>
              <span className="font-bold text-amber-400">{totalClicks.toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Leads Gerados:</span>
              <span className="font-bold text-emerald-400">{totalLeads.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
