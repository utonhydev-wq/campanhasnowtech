import React, { useState } from 'react';
import { X, Gift, ShieldCheck, DollarSign, Package } from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';
import { Award } from '../../types';

interface AwardModalProps {
  award: Award;
  onClose: () => void;
}

export const AwardModal: React.FC<AwardModalProps> = ({ award, onClose }) => {
  const { updateAward } = useCampaigns();

  const [quantityAvailable, setQuantityAvailable] = useState<number>(award.quantityAvailable);
  const [unitCostStr, setUnitCostStr] = useState<string>(
    award.unitCost !== null ? String(award.unitCost) : ''
  );
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string>(award.eligibilityCriteria);
  const [promotionRules, setPromotionRules] = useState<string>(award.promotionRules);
  const [rulesApproved, setRulesApproved] = useState<boolean>(award.rulesApproved);
  const [responsible, setResponsible] = useState<string>(award.responsible);
  const [deliveryStatus, setDeliveryStatus] = useState<Award['deliveryStatus']>(award.deliveryStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnitCost = unitCostStr.trim() !== '' ? parseFloat(unitCostStr) : null;
    const newStockCurrent = Math.max(0, quantityAvailable - award.stockDelivered);

    await updateAward({
      ...award,
      quantityAvailable,
      stockCurrent: newStockCurrent,
      unitCost: finalUnitCost,
      eligibilityCriteria,
      promotionRules,
      rulesApproved,
      responsible,
      deliveryStatus,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Configurar Prêmio: {award.name}</h2>
              <span className="text-[11px] font-mono text-slate-400">Black Friday Oficial ("FECHOU, GANHOU!")</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Quantidade Total Prevista</label>
              <input
                type="number"
                value={quantityAvailable}
                onChange={(e) => setQuantityAvailable(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="A definir..."
                value={unitCostStr}
                onChange={(e) => setUnitCostStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Responsável pelo Estoque</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Status do Lote</label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="planejado">Planejado</option>
                <option value="em_aquisicao">Em Aquisição / Compra</option>
                <option value="em_estoque">Em Estoque na Loja</option>
                <option value="distribuicao_ativa">Distribuição Ativa</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Critérios de Participação & Elegibilidade</label>
            <textarea
              rows={3}
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              placeholder="Descreva quais contratos dão direito a este prêmio..."
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Regulamento Oficial da Promoção</label>
            <textarea
              rows={3}
              value={promotionRules}
              onChange={(e) => setPromotionRules(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              placeholder="Regras jurídicas e prazos de retirada pelo cliente..."
              required
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Aprovação da Diretoria Geral</span>
              <span className="text-[11px] text-slate-400">Homologar formalmente as regras de premiação</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rulesApproved}
                onChange={(e) => setRulesApproved(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
