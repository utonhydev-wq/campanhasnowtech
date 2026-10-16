import React, { useState } from 'react';
import { X, Layers, DollarSign, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';
import { SolarKit } from '../../types';

interface KitPriceModalProps {
  kit: SolarKit;
  onClose: () => void;
}

export const KitPriceModal: React.FC<KitPriceModalProps> = ({ kit, onClose }) => {
  const { updateSolarKit } = useCampaigns();

  const [originalPriceStr, setOriginalPriceStr] = useState<string>(
    kit.originalPrice !== null ? String(kit.originalPrice) : ''
  );
  const [promotionalPriceStr, setPromotionalPriceStr] = useState<string>(
    kit.promotionalPrice !== null ? String(kit.promotionalPrice) : ''
  );
  const [paymentConditions, setPaymentConditions] = useState<string>(kit.paymentConditions);
  const [offerValidity, setOfferValidity] = useState<string>(kit.offerValidity);
  const [approvalStatus, setApprovalStatus] = useState<SolarKit['approvalStatus']>(kit.approvalStatus);
  const [notes, setNotes] = useState<string>(kit.notes);

  // Live calculation of discount
  const orig = parseFloat(originalPriceStr) || 0;
  const promo = parseFloat(promotionalPriceStr) || 0;
  const discountReais = orig > promo && orig > 0 ? orig - promo : 0;
  const discountPercent = orig > 0 ? (discountReais / orig) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOriginalPrice = originalPriceStr.trim() !== '' ? parseFloat(originalPriceStr) : null;
    const finalPromotionalPrice = promotionalPriceStr.trim() !== '' ? parseFloat(promotionalPriceStr) : null;

    let finalApproval = approvalStatus;
    let approvedBy = kit.approvedBy;
    let approvedAt = kit.approvedAt;

    if (finalOriginalPrice === null || finalPromotionalPrice === null) {
      finalApproval = 'a_definir';
      approvedBy = null;
      approvedAt = null;
    } else if (approvalStatus === 'aprovado' && !approvedBy) {
      approvedBy = 'Carlos Mendes (Gestão Comercial)';
      approvedAt = new Date().toISOString();
    }

    await updateSolarKit({
      ...kit,
      originalPrice: finalOriginalPrice,
      promotionalPrice: finalPromotionalPrice,
      discountReais: finalOriginalPrice && finalPromotionalPrice ? finalOriginalPrice - finalPromotionalPrice : null,
      discountPercent: finalOriginalPrice && finalPromotionalPrice && finalOriginalPrice > 0
        ? ((finalOriginalPrice - finalPromotionalPrice) / finalOriginalPrice) * 100
        : null,
      paymentConditions: paymentConditions.trim() || 'A definir',
      offerValidity: offerValidity.trim() || 'A definir',
      approvalStatus: finalApproval,
      approvedBy,
      approvedAt,
      notes,
    });

    onClose();
  };

  const handleResetToUndefined = () => {
    setOriginalPriceStr('');
    setPromotionalPriceStr('');
    setApprovalStatus('a_definir');
    setPaymentConditions('A definir');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Definir Preços Promocionais: {kit.name}
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {kit.campaignId === 'pre-black' ? 'Pré-Black Friday Solar' : 'Black Friday Solar Oficial'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
            <p className="leading-relaxed">
              Deixe os campos em branco caso o preço deste kit ainda permaneça como <strong>"A definir"</strong>.
              Aprovação formal é obrigatória antes de autorizar a circulação em anúncios ou panfletos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Preço Original (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 18900.00"
                value={originalPriceStr}
                onChange={(e) => setOriginalPriceStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Preço Promocional (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 15900.00"
                value={promotionalPriceStr}
                onChange={(e) => setPromotionalPriceStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold text-emerald-400"
              />
            </div>
          </div>

          {/* Discount Preview */}
          {orig > 0 && promo > 0 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
              <span className="text-slate-400">Desconto Calculado:</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm block">
                  R$ {discountReais.toFixed(2)} OFF
                </span>
                <span className="text-[11px] text-slate-400">
                  ({discountPercent.toFixed(1)}% de desconto real)
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Condições de Pagamento</label>
            <input
              type="text"
              placeholder="Ex: Em até 24x sem juros no cartão ou financiamento solar..."
              value={paymentConditions}
              onChange={(e) => setPaymentConditions(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Validade da Oferta</label>
            <input
              type="text"
              placeholder="Ex: 29/10/2026 a 13/11/2026 ou enquanto durar o estoque"
              value={offerValidity}
              onChange={(e) => setOfferValidity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Status de Aprovação Comercial</label>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            >
              <option value="a_definir">A definir (Sem preços)</option>
              <option value="pendente">Pendente de Avaliação</option>
              <option value="em_revisao">Em Revisão Comercial</option>
              <option value="aprovado">Aprovado pela Diretoria</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Observações Internas</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              placeholder="Justificativa de margem ou limites de estoque..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetToUndefined}
              className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
            >
              Resetar para "A definir"
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Salvar Preços
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
