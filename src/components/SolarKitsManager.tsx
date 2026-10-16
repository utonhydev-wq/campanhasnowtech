import React, { useState } from 'react';
import {
  Layers,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  ShieldCheck,
  Filter,
  DollarSign,
  Info,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { SolarKit, CampaignId } from '../types';

interface SolarKitsManagerProps {
  onOpenEditKitModal: (kit: SolarKit) => void;
}

export const SolarKitsManager: React.FC<SolarKitsManagerProps> = ({ onOpenEditKitModal }) => {
  const { state, updateSolarKit } = useCampaigns();
  const [filterCampaign, setFilterCampaign] = useState<'all' | CampaignId>('all');
  const [filterApproval, setFilterApproval] = useState<string>('all');

  const filteredKits = state.solarKits.filter((kit) => {
    if (filterCampaign !== 'all' && kit.campaignId !== filterCampaign) return false;
    if (filterApproval !== 'all' && kit.approvalStatus !== filterApproval) return false;
    return true;
  });

  // Calculate statistics
  const totalKits = state.solarKits.length;
  const definedKits = state.solarKits.filter(
    (k) => k.originalPrice !== null && k.promotionalPrice !== null
  ).length;
  const approvedKits = state.solarKits.filter((k) => k.approvalStatus === 'aprovado').length;
  const pendingKits = totalKits - definedKits;

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleQuickApprove = async (kit: SolarKit) => {
    if (kit.originalPrice === null || kit.promotionalPrice === null) {
      setFeedbackMsg({
        type: 'error',
        text: `Não é possível aprovar o ${kit.name} com valores "A definir". Clique em "Definir Valores" primeiro.`,
      });
      return;
    }

    await updateSolarKit({
      ...kit,
      approvalStatus: 'aprovado',
      approvedBy: 'Carlos Mendes (Gestão Comercial)',
      approvedAt: new Date().toISOString(),
    });

    setFeedbackMsg({
      type: 'success',
      text: `Valores e condições do ${kit.name} foram formalmente aprovados para comercialização!`,
    });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            Matriz de Kits Solares & Preços Promocionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão oficial de tabelas de preços para a Pré-Black e Black Friday Solar. Preços permanecem "A definir" até preenchimento oficial.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {feedbackMsg.type === 'error' ? 'Aviso:' : 'Sucesso:'}
            </span>
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
          >
            Fechar
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total de Kits</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalKits}</span>
          <span className="text-[11px] text-slate-400 block mt-1">5 Pré-Black · 3 Black Oficial</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Preços Definidos</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">{definedKits}</span>
          <span className="text-[11px] text-slate-400 block mt-1">{totalKits - definedKits} aguardando valores</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Kits Aprovados</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{approvedKits}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Liberados para divulgação</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/20">
          <span className="text-[11px] text-amber-400 uppercase tracking-wider block">Status Geral</span>
          <span className="text-sm font-bold text-amber-300 block mt-1">
            {pendingKits > 0 ? `${pendingKits} Kits Pendentes` : 'Tudo Aprovado'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Aprovação mandatória</span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Regra de Segurança Comercial NowTech Solar:</span>
          <p className="mt-0.5 text-slate-400">
            Nenhum panfleto, anúncio em vídeo ou arte de redes sociais pode ser publicado sem que os preços do kit participante estejam devidamente preenchidos e com status <strong className="text-emerald-400 font-medium">Aprovado</strong> pela gestão comercial e diretoria.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Campanha:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
            <button
              onClick={() => setFilterCampaign('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterCampaign === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({state.solarKits.length})
            </button>
            <button
              onClick={() => setFilterCampaign('pre-black')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterCampaign === 'pre-black'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Pré-Black Friday (5 Kits)
            </button>
            <button
              onClick={() => setFilterCampaign('black-friday')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterCampaign === 'black-friday'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Black Friday Oficial (3 Kits)
            </button>
          </div>
        </div>

        {/* Approval Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Aprovação:</span>
          <select
            value={filterApproval}
            onChange={(e) => setFilterApproval(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Status</option>
            <option value="a_definir">A definir</option>
            <option value="pendente">Pendente</option>
            <option value="em_revisao">Em Revisão</option>
            <option value="aprovado">Aprovado</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Kit Solar</th>
              <th className="py-3.5 px-4 font-semibold">Campanha</th>
              <th className="py-3.5 px-4 font-semibold text-right">Preço Original</th>
              <th className="py-3.5 px-4 font-semibold text-right">Preço Promocional</th>
              <th className="py-3.5 px-4 font-semibold text-right">Desconto (R$ / %)</th>
              <th className="py-3.5 px-4 font-semibold">Condições de Pagamento</th>
              <th className="py-3.5 px-4 font-semibold">Validade</th>
              <th className="py-3.5 px-4 font-semibold text-center">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredKits.map((kit) => {
              const isDefined = kit.originalPrice !== null && kit.promotionalPrice !== null;
              const isApproved = kit.approvalStatus === 'aprovado';

              const statusBadge = {
                a_definir: 'bg-slate-800 text-slate-300 border-slate-700',
                pendente: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                em_revisao: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                aprovado: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              }[kit.approvalStatus] || 'bg-slate-800 text-slate-300';

              const statusLabel = {
                a_definir: 'A definir',
                pendente: 'Aguardando Aprovação',
                em_revisao: 'Em Revisão',
                aprovado: 'Aprovado',
              }[kit.approvalStatus];

              return (
                <tr key={kit.id} className="hover:bg-slate-800/40 transition-colors group">
                  {/* Name */}
                  <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{kit.name}</span>
                    </div>
                  </td>

                  {/* Campaign */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        kit.campaignId === 'pre-black'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}
                    >
                      {kit.campaignId === 'pre-black' ? 'Pré-Black' : 'Black Oficial'}
                    </span>
                  </td>

                  {/* Original Price */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {kit.originalPrice !== null ? (
                      <span className="text-slate-400 line-through">
                        R$ {kit.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-amber-400/80 italic font-sans">A definir</span>
                    )}
                  </td>

                  {/* Promotional Price */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {kit.promotionalPrice !== null ? (
                      <span className="text-emerald-400 font-bold text-sm">
                        R$ {kit.promotionalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-amber-400/80 italic font-sans">A definir</span>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {kit.discountReais !== null ? (
                      <div>
                        <span className="text-emerald-400 font-semibold">
                          -R$ {kit.discountReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {kit.discountPercent !== null && (
                          <span className="text-[10px] text-slate-400 block">
                            ({kit.discountPercent.toFixed(1)}% OFF)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic font-sans">—</span>
                    )}
                  </td>

                  {/* Payment Conditions */}
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={kit.paymentConditions}>
                    {kit.paymentConditions}
                  </td>

                  {/* Validity */}
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {kit.offerValidity}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium border ${statusBadge}`}>
                      {isApproved ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                      <span>{statusLabel}</span>
                    </span>
                    {kit.approvedBy && (
                      <span className="block text-[9px] text-slate-500 mt-0.5 truncate max-w-[120px]" title={kit.approvedBy}>
                        Por: {kit.approvedBy}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenEditKitModal(kit)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors flex items-center gap-1"
                        title="Editar preços e condições"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Preencher</span>
                      </button>

                      {!isApproved && isDefined && (
                        <button
                          onClick={() => handleQuickApprove(kit)}
                          className="px-2 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 rounded transition-colors"
                          title="Aprovar comercialmente este kit"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
