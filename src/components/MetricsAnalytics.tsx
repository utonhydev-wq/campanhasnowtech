import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Target,
  Edit2,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { CampaignMetrics, CampaignId, ChannelPerformance } from '../types';

export const MetricsAnalytics: React.FC = () => {
  const { state, updateMetrics } = useCampaigns();
  const { metrics, campaigns } = state;

  const [selectedCampaignId, setSelectedCampaignId] = useState<CampaignId>('pre-black');
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);

  const currentMetric = metrics.find((m) => m.campaignId === selectedCampaignId) || metrics[0];

  const [editForm, setEditForm] = useState<CampaignMetrics>({ ...currentMetric });

  const handleSelectCampaign = (id: CampaignId) => {
    setSelectedCampaignId(id);
    const m = metrics.find((item) => item.campaignId === id) || metrics[0];
    setEditForm({ ...m });
    setIsEditingMetrics(false);
  };

  const handleSaveMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMetrics(editForm);
    setIsEditingMetrics(false);
  };

  // Safe calculated metrics
  const calculateCPL = (investment: number, leads: number) => {
    if (leads <= 0) return 0;
    return investment / leads;
  };

  const calculateConversionRate = (sales: number, leads: number) => {
    if (leads <= 0) return 0;
    return (sales / leads) * 100;
  };

  const calculateAverageTicket = (revenue: number, sales: number) => {
    if (sales <= 0) return 0;
    return revenue / sales;
  };

  const calculateROI = (revenue: number, investment: number) => {
    if (investment <= 0) return 0;
    return ((revenue - investment) / investment) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Indicadores de Resultados & Comparativo de Campanhas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registro rigoroso de investimento, leads, contatos e faturamento. Cálculos estritamente baseados em dados reais.
          </p>
        </div>

        <button
          onClick={() => {
            setEditForm({ ...currentMetric });
            setIsEditingMetrics(!isEditingMetrics);
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Edit2 className="w-4 h-4" />
          <span>{isEditingMetrics ? 'Cancelar Edição' : 'Lançar Dados da Campanha'}</span>
        </button>
      </div>

      {/* Campaign Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl overflow-x-auto">
        {campaigns.map((c) => {
          const isSelected = c.slug === selectedCampaignId;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCampaign(c.slug)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  c.slug === 'pre-black'
                    ? 'bg-amber-400'
                    : c.slug === 'black-friday'
                    ? 'bg-emerald-400'
                    : 'bg-sky-400'
                }`}
              />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Edit Form Modal/Drawer */}
      {isEditingMetrics && (
        <form onSubmit={handleSaveMetrics} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Lançamento de Resultados Reais: {campaigns.find((c) => c.slug === selectedCampaignId)?.name}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Investimento Tráfego Pago (R$)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.paidTrafficInvestment}
                onChange={(e) => setEditForm({ ...editForm, paidTrafficInvestment: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Alcance Estimado (Pessoas)</label>
              <input
                type="number"
                value={editForm.reach}
                onChange={(e) => setEditForm({ ...editForm, reach: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Visualizações de Vídeo</label>
              <input
                type="number"
                value={editForm.views}
                onChange={(e) => setEditForm({ ...editForm, views: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Leads Recebidos</label>
              <input
                type="number"
                value={editForm.leads}
                onChange={(e) => setEditForm({ ...editForm, leads: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Contatos Comerciais (Qualificados)</label>
              <input
                type="number"
                value={editForm.commercialContacts}
                onChange={(e) => setEditForm({ ...editForm, commercialContacts: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Vendas / Contratos Concluídos</label>
              <input
                type="number"
                value={editForm.salesClosed}
                onChange={(e) => setEditForm({ ...editForm, salesClosed: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Faturamento Total Gerado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.revenue}
                onChange={(e) => setEditForm({ ...editForm, revenue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold text-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingMetrics(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
            >
              Salvar Resultados
            </button>
          </div>
        </form>
      )}

      {/* Primary KPI Grid for Selected Campaign */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Investimento */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Investimento Mídia</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {currentMetric.paidTrafficInvestment > 0
              ? `R$ ${currentMetric.paidTrafficInvestment.toLocaleString('pt-BR')}`
              : 'R$ 0,00'}
          </span>
          <span className="text-[10px] text-slate-500 block">Tráfego pago cadastrado</span>
        </div>

        {/* Leads */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Leads Gerados</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {currentMetric.leads}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {currentMetric.commercialContacts} contatos qualificados
          </span>
        </div>

        {/* Custo por Lead (CPL) */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Custo por Lead (CPL)</span>
          <span className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
            {currentMetric.leads > 0
              ? `R$ ${calculateCPL(currentMetric.paidTrafficInvestment, currentMetric.leads).toFixed(2)}`
              : 'R$ 0,00'}
          </span>
          <span className="text-[10px] text-slate-500 block">Investimento ÷ Leads</span>
        </div>

        {/* Taxa de Conversão */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Taxa de Conversão</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {currentMetric.leads > 0
              ? `${calculateConversionRate(currentMetric.salesClosed, currentMetric.leads).toFixed(1)}%`
              : '0.0%'}
          </span>
          <span className="text-[10px] text-slate-500 block">Vendas ÷ Leads</span>
        </div>

        {/* Vendas Fechadas */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Vendas Concluídas</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {currentMetric.salesClosed}
          </span>
          <span className="text-[10px] text-slate-500 block">Contratos assinados</span>
        </div>

        {/* Faturamento */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Faturamento Total</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {currentMetric.revenue > 0
              ? `R$ ${currentMetric.revenue.toLocaleString('pt-BR')}`
              : 'R$ 0,00'}
          </span>
          <span className="text-[10px] text-slate-500 block">Volume comercial bruto</span>
        </div>

        {/* Ticket Médio */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Ticket Médio</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {currentMetric.salesClosed > 0
              ? `R$ ${calculateAverageTicket(currentMetric.revenue, currentMetric.salesClosed).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
              : 'R$ 0,00'}
          </span>
          <span className="text-[10px] text-slate-500 block">Faturamento ÷ Vendas</span>
        </div>

        {/* ROI / Retorno */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ROI Estimado</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {currentMetric.paidTrafficInvestment > 0 && currentMetric.revenue > 0
              ? `${calculateROI(currentMetric.revenue, currentMetric.paidTrafficInvestment).toFixed(0)}%`
              : '0%'}
          </span>
          <span className="text-[10px] text-slate-500 block">Retorno s/ Mídia</span>
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>Comparativo Comercial: Pré-Black vs Black Oficial vs Natal</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Métrica Comercial</th>
                <th className="py-3 px-4 font-semibold text-right">Pré-Black Solar</th>
                <th className="py-3 px-4 font-semibold text-right">Black Friday Oficial</th>
                <th className="py-3 px-4 font-semibold text-right">Natal NowTech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(() => {
                const pb = metrics.find((m) => m.campaignId === 'pre-black') || metrics[0];
                const bf = metrics.find((m) => m.campaignId === 'black-friday') || metrics[1];
                const nat = metrics.find((m) => m.campaignId === 'natal') || metrics[2];

                return (
                  <>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Investimento em Tráfego</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        R$ {pb.paidTrafficInvestment.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        R$ {bf.paidTrafficInvestment.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        R$ {nat.paidTrafficInvestment.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Leads Captados</td>
                      <td className="py-3 px-4 text-right font-mono text-sky-400 font-bold">{pb.leads}</td>
                      <td className="py-3 px-4 text-right font-mono text-sky-400 font-bold">{bf.leads}</td>
                      <td className="py-3 px-4 text-right font-mono text-sky-400 font-bold">{nat.leads}</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Contatos Comerciais</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">{pb.commercialContacts}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">{bf.commercialContacts}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">{nat.commercialContacts}</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Custo por Lead (CPL)</td>
                      <td className="py-3 px-4 text-right font-mono text-purple-400">
                        {pb.leads > 0 ? `R$ ${(pb.paidTrafficInvestment / pb.leads).toFixed(2)}` : 'R$ 0,00'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-purple-400">
                        {bf.leads > 0 ? `R$ ${(bf.paidTrafficInvestment / bf.leads).toFixed(2)}` : 'R$ 0,00'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-purple-400">
                        {nat.leads > 0 ? `R$ ${(nat.paidTrafficInvestment / nat.leads).toFixed(2)}` : 'R$ 0,00'}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Vendas Realizadas</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">{pb.salesClosed}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">{bf.salesClosed}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">{nat.salesClosed}</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">Taxa de Conversão</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {pb.leads > 0 ? `${((pb.salesClosed / pb.leads) * 100).toFixed(1)}%` : '0%'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {bf.leads > 0 ? `${((bf.salesClosed / bf.leads) * 100).toFixed(1)}%` : '0%'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {nat.leads > 0 ? `${((nat.salesClosed / nat.leads) * 100).toFixed(1)}%` : '0%'}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40 font-bold">
                      <td className="py-3.5 px-4 text-amber-400">Faturamento Bruto</td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                        R$ {pb.revenue.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                        R$ {bf.revenue.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                        R$ {nat.revenue.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
