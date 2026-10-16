import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  CheckSquare,
  Gift,
  Video,
  FileText,
  Sparkles,
  Store,
  MapPin,
  TrendingUp,
  Plus,
  Edit3,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignId, SolarKit, Task } from '../types';
import { BalloonActionManager } from './BalloonActionManager';
import { ChristmasPamphletManager } from './ChristmasPamphletManager';
import { ChristmasVideoWorkflowManager } from './ChristmasVideoWorkflow';

interface CampaignDetailsProps {
  onOpenKitModal: (kit: SolarKit) => void;
  onOpenTaskModal: (task?: Task) => void;
  onNavigateTab: (tab: string) => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  onOpenKitModal,
  onOpenTaskModal,
  onNavigateTab,
}) => {
  const { state, selectedCampaignId, setSelectedCampaignId, toggleTaskChecklist, updateSolarKit } = useCampaigns();

  // If 'all' is selected, default to 'pre-black' for detailed view
  const activeSlug: CampaignId = selectedCampaignId === 'all' ? 'pre-black' : selectedCampaignId;

  const campaign = state.campaigns.find((c) => c.slug === activeSlug) || state.campaigns[0];

  const [activeSubTab, setActiveSubTab] = useState<'kits' | 'tarefas' | 'modulos' | 'indicadores'>('kits');

  // Filter items for this campaign
  const campaignKits = state.solarKits.filter((k) => k.campaignId === campaign.slug);
  const campaignTasks = state.tasks.filter((t) => t.campaignId === campaign.slug);
  const campaignMetric = state.metrics.find((m) => m.campaignId === campaign.slug);

  const undefinedPricesKits = campaignKits.filter(
    (k) => k.originalPrice === null || k.promotionalPrice === null
  );

  const completedTasks = campaignTasks.filter((t) => t.status === 'concluida');
  const pendingTasks = campaignTasks.filter((t) => t.status !== 'concluida');

  return (
    <div className="space-y-6">
      {/* Campaign Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {state.campaigns.map((c) => {
          const isSelected = c.slug === campaign.slug;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCampaignId(c.slug)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  c.slug === 'pre-black'
                    ? 'bg-amber-500'
                    : c.slug === 'black-friday'
                    ? 'bg-emerald-500'
                    : 'bg-sky-500'
                }`}
              />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Campaign Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-2.5 py-0.5 font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {campaign.badge}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-mono">
                {campaign.startDate} a {campaign.endDate}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-mono font-semibold">
                Status: Programada
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {campaign.name}
            </h1>

            <p className="text-base text-amber-300 italic font-medium">
              “{campaign.officialCall}”
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Kits Participantes</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {campaignKits.length}
              </span>
              <span className="text-[11px] text-amber-400 block mt-0.5">
                {undefinedPricesKits.length > 0 ? `${undefinedPricesKits.length} a definir` : '100% Precificados'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Tarefas Cadastradas</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {campaignTasks.length}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">
                {completedTasks.length} concluídas
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 mt-8 border-t border-slate-800 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('kits')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'kits'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kits & Preços ({campaignKits.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tarefas')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'tarefas'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Ações & Tarefas ({campaignTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('modulos')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'modulos'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {campaign.slug === 'black-friday' ? (
              <Gift className="w-4 h-4" />
            ) : campaign.slug === 'natal' ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Store className="w-4 h-4" />
            )}
            <span>
              {campaign.slug === 'pre-black'
                ? 'As 7 Ações Estratégicas'
                : campaign.slug === 'black-friday'
                ? 'Controle de Premiações ("Fechou, Ganhou!")'
                : 'Módulos Especiais de Natal'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('indicadores')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'indicadores'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Resultados Comerciais</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: KITS & PREÇOS PROMOCIONAIS */}
      {activeSubTab === 'kits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Tabela de Preços Promocionais</h2>
              <p className="text-xs text-slate-400">
                Kits participantes da campanha {campaign.name}. Valores aguardam deliberação da equipe.
              </p>
            </div>
          </div>

          {campaignKits.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-xs">
              Nenhum kit solar cadastrado para esta campanha ainda.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Kit Solar</th>
                    <th className="py-3 px-4 font-semibold text-right">Preço Original</th>
                    <th className="py-3 px-4 font-semibold text-right">Preço Promocional</th>
                    <th className="py-3 px-4 font-semibold text-right">Desconto</th>
                    <th className="py-3 px-4 font-semibold">Condições de Pagamento</th>
                    <th className="py-3 px-4 font-semibold">Validade</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {campaignKits.map((kit) => {
                    const isDefined = kit.originalPrice !== null && kit.promotionalPrice !== null;
                    return (
                      <tr key={kit.id} className="hover:bg-slate-850 transition-colors">
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          {kit.name}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {kit.originalPrice !== null ? (
                            <span className="text-slate-400 line-through">
                              R$ {kit.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-amber-400/80 italic">A definir</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {kit.promotionalPrice !== null ? (
                            <span className="text-emerald-400 font-bold">
                              R$ {kit.promotionalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-amber-400/80 italic">A definir</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {kit.discountReais !== null ? (
                            <span className="text-emerald-400 font-medium">
                              -R$ {kit.discountReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={kit.paymentConditions}>
                          {kit.paymentConditions}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {kit.offerValidity}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                              kit.approvalStatus === 'aprovado'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {kit.approvalStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onOpenKitModal(kit)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Preencher Preço</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TAREFAS & AÇÕES DA CAMPANHA */}
      {activeSubTab === 'tarefas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Tarefas Operacionais da Campanha</h2>
              <p className="text-xs text-slate-400">
                Cada ação cadastrada com responsável, prazos, prioridade e checklist.
              </p>
            </div>
            <button
              onClick={() => onOpenTaskModal()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Atividade</span>
            </button>
          </div>

          <div className="space-y-3">
            {campaignTasks.map((t) => {
              const completedCount = t.checklist.filter((i) => i.completed).length;
              const totalChecklist = t.checklist.length;
              const checklistPercent = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

              return (
                <div
                  key={t.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{t.title}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase border ${
                            t.priority === 'critica'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : t.priority === 'alta'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{t.description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <button
                        onClick={() => onOpenTaskModal(t)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>
                      <span>Responsável: </span>
                      <strong className="text-white font-medium">{t.assignee}</strong>
                    </div>
                    <div>
                      <span>Prazo: </span>
                      <strong className="text-amber-300 font-mono">{t.dueDate}</strong>
                    </div>
                    <div>
                      <span>Orçamento: </span>
                      <strong className="text-emerald-400 font-mono">
                        {t.estimatedBudget > 0 ? `R$ ${t.estimatedBudget.toLocaleString('pt-BR')}` : 'Sem custo direto'}
                      </strong>
                    </div>
                    <div>
                      <span>Status: </span>
                      <strong className="text-sky-400 uppercase font-mono text-[11px]">
                        {t.status.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  {totalChecklist > 0 && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">
                          Checklist de Execução ({completedCount}/{totalChecklist} concluídos)
                        </span>
                        <span className="font-mono text-amber-400 font-bold">{checklistPercent}%</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {t.checklist.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-900 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleTaskChecklist(t.id, item.id)}
                              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500"
                            />
                            <span
                              className={`${
                                item.completed ? 'line-through text-slate-500' : 'text-slate-300'
                              }`}
                            >
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MÓDULOS ESPECÍFICOS */}
      {activeSubTab === 'modulos' && (
        <div className="space-y-6">
          {campaign.slug === 'pre-black' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>As 7 Ações Estratégicas do Aquecimento Pré-Black</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para o aquecimento da Pré-Black Friday Solar, foram estruturadas 7 atividades independentes:
                  1. Panfletos da Black · 2. Ação com influenciador · 3. Vídeo para tráfego pago · 4. Ação em loja · 5. Ação na rua · 6. Redes sociais · 7. Aprovação comercial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaignTasks.map((t, idx) => (
                  <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">Ação 0{idx + 1}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {t.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{t.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                      <span>Resp: {t.assignee}</span>
                      <span className="font-mono text-amber-300">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.slug === 'black-friday' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Controle de Premiações "FECHOU, GANHOU!"</h3>
                  <p className="text-xs text-slate-400">
                    Acompanhamento direto dos 3 prêmios: Ventilador, Air fryer e Ar-condicionado.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('premiacoes')}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  <span>Abrir Painel Completo de Premiações</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {state.awards.map((aw) => (
                  <div key={aw.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase">{aw.category}</span>
                    <h4 className="text-base font-bold text-white">{aw.name}</h4>
                    <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Disponível:</span>
                        <strong className="font-mono text-white">{aw.stockCurrent} un</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Entregues:</span>
                        <strong className="font-mono text-emerald-400">{aw.stockDelivered} un</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Regras:</span>
                        <span className={aw.rulesApproved ? 'text-emerald-400' : 'text-amber-400'}>
                          {aw.rulesApproved ? 'Aprovadas' : 'Em elaboração'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.slug === 'natal' && (
            <div className="space-y-8">
              {/* Module 1: Estoura Balão */}
              <section className="space-y-4">
                <BalloonActionManager />
              </section>

              {/* Module 2: Panfleto de Natal */}
              <section className="space-y-4 pt-4 border-t border-slate-800">
                <ChristmasPamphletManager />
              </section>

              {/* Module 3: Vídeo Tráfego Pago 9 Etapas */}
              <section className="space-y-4 pt-4 border-t border-slate-800">
                <ChristmasVideoWorkflowManager />
              </section>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: RESULTADOS DA CAMPANHA */}
      {activeSubTab === 'indicadores' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Métricas & ROI da {campaign.name}</h3>
              <p className="text-xs text-slate-400">
                Indicadores calculados estritamente sobre dados reais registrados pela equipe comercial.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('indicadores')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              Lançar / Atualizar Números
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Investimento Mídia</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {campaignMetric && campaignMetric.paidTrafficInvestment > 0
                  ? `R$ ${campaignMetric.paidTrafficInvestment.toLocaleString('pt-BR')}`
                  : 'R$ 0,00'}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Leads Registrados</span>
              <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                {campaignMetric?.leads || 0}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Vendas Fechadas</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {campaignMetric?.salesClosed || 0}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {campaignMetric && campaignMetric.revenue > 0
                  ? `R$ ${campaignMetric.revenue.toLocaleString('pt-BR')}`
                  : 'R$ 0,00'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
