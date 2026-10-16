import React, { useState } from 'react';
import {
  Gift,
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  UserCheck,
  DollarSign,
  FileCheck,
  Truck,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { Award, AwardDelivery } from '../types';

interface AwardsManagerProps {
  onOpenAwardModal: (award: Award) => void;
  onOpenDeliveryModal: (awardId: string) => void;
}

export const AwardsManager: React.FC<AwardsManagerProps> = ({
  onOpenAwardModal,
  onOpenDeliveryModal,
}) => {
  const { state, updateAward } = useCampaigns();
  const { awards } = state;

  const [selectedAwardId, setSelectedAwardId] = useState<string>(awards[0]?.id || 'award-ventilador');

  const selectedAward = awards.find((a) => a.id === selectedAwardId) || awards[0];

  // Totals
  const totalQuantity = awards.reduce((acc, a) => acc + a.quantityAvailable, 0);
  const totalStock = awards.reduce((acc, a) => acc + a.stockCurrent, 0);
  const totalDelivered = awards.reduce((acc, a) => acc + a.stockDelivered, 0);

  const handleApproveRules = async (award: Award) => {
    await updateAward({
      ...award,
      rulesApproved: !award.rulesApproved,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CAMPANHA BLACK FRIDAY OFICIAL
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-amber-300">Chamada: “FECHOU, GANHOU!”</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <Gift className="w-6 h-6 text-emerald-400" />
            Painel de Controle de Premiações
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Gestão de estoque, custos, elegibilidade contratual e registro de entregas dos prêmios oficiais.
          </p>
        </div>

        {selectedAward && (
          <button
            onClick={() => onOpenDeliveryModal(selectedAward.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 transition-colors whitespace-nowrap self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Entrega de Prêmio</span>
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estoque Total Previsto</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalQuantity}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Unidades em cotação</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Disponível em Estoque</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">{totalStock}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Prontos para entrega</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Prêmios Já Entregues</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{totalDelivered}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Com contrato assinado</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Regras Aprovadas</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {awards.filter((a) => a.rulesApproved).length} de {awards.length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Validação da Diretoria</span>
        </div>
      </div>

      {/* Warning Box regarding Promotion Rules */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Diretriz de Gestão:</span>
          <p className="mt-0.5">
            As regras de participação e a vinculação de cada prêmio a kits específicos (Kit 1.000, Kit 2.000 ou Kit 3.000)
            devem ser deliberadas e aprovadas pela gestão comercial e diretoria. Nenhum consultor deve prometer prêmios sem homologação formal.
          </p>
        </div>
      </div>

      {/* Awards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {awards.map((award) => {
          const isSelected = award.id === selectedAward?.id;
          const deliveredPct =
            award.quantityAvailable > 0
              ? Math.round((award.stockDelivered / award.quantityAvailable) * 100)
              : 0;

          return (
            <div
              key={award.id}
              onClick={() => setSelectedAwardId(award.id)}
              className={`cursor-pointer rounded-xl bg-slate-900 border transition-all p-5 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-850'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                    {award.category}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      award.rulesApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {award.rulesApproved ? 'Regras Aprovadas' : 'Regras em Elaboração'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    {award.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {award.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estoque Disponível:</span>
                    <span className="font-mono font-bold text-white">
                      {award.stockCurrent} / {award.quantityAvailable} un
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, deliveredPct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Entregues: {award.stockDelivered} un</span>
                    <span>Custo Unit: {award.unitCost ? `R$ ${award.unitCost.toFixed(2)}` : 'A definir'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAwardModal(award);
                  }}
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>

                {!award.rulesApproved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveRules(award);
                    }}
                    className="py-1.5 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                    title="Aprovar regras pela gestão"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Aprovar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Award Detail & Delivery History */}
      {selectedAward && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                Detalhes & Histórico de Entregas
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{selectedAward.name}</span>
                <span className="text-xs text-slate-400 font-normal">
                  (Responsável: {selectedAward.responsible})
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDeliveryModal(selectedAward.id)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Entrega Realizada</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                Critérios de Participação & Elegibilidade
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedAward.eligibilityCriteria}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                Regras Oficiais da Promoção
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedAward.promotionRules}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <span>Status da Diretoria:</span>
                <span
                  className={`font-semibold ${
                    selectedAward.rulesApproved ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {selectedAward.rulesApproved ? 'Aprovado' : 'Aguardando validação'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Records Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Contratos Fechados com Entrega Registrada ({selectedAward.deliveries.length})</span>
            </h3>

            {selectedAward.deliveries.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-400">
                <Package className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-medium">Nenhuma entrega de {selectedAward.name} registrada ainda.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Assim que um contrato da Black Friday Oficial for fechado, registre a entrega para abater do estoque.
                </p>
                <button
                  onClick={() => onOpenDeliveryModal(selectedAward.id)}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg transition-colors"
                >
                  Registrar Primeira Entrega
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Cliente</th>
                      <th className="py-2.5 px-4 font-semibold">Nº do Contrato</th>
                      <th className="py-2.5 px-4 font-semibold">Kit Adquirido</th>
                      <th className="py-2.5 px-4 font-semibold">Data da Entrega</th>
                      <th className="py-2.5 px-4 font-semibold">Entregue Por</th>
                      <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedAward.deliveries.map((del) => (
                      <tr key={del.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-white">{del.customerName}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-300">{del.contractNumber}</td>
                        <td className="py-2.5 px-4 text-amber-300 font-medium">{del.kitPurchased}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">{del.deliveryDate}</td>
                        <td className="py-2.5 px-4 text-slate-300">{del.deliveredBy}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {del.status === 'entregue' ? 'Entregue' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
