import React, { useState } from 'react';
import { X, Gift, CheckCircle, Truck, User } from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';
import { Award } from '../../types';

interface AwardDeliveryModalProps {
  awardId: string;
  onClose: () => void;
}

export const AwardDeliveryModal: React.FC<AwardDeliveryModalProps> = ({ awardId, onClose }) => {
  const { state, addAwardDelivery } = useCampaigns();
  const { awards } = state;

  const [selectedAward, setSelectedAward] = useState<string>(awardId);
  const [customerName, setCustomerName] = useState('');
  const [contractNumber, setContractNumber] = useState(`CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [kitPurchased, setKitPurchased] = useState('Kit 1.000');
  const [deliveryDate, setDeliveryDate] = useState('2026-11-20');
  const [deliveredBy, setDeliveredBy] = useState('Carlos Mendes');

  const award = awards.find((a) => a.id === selectedAward);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contractNumber.trim() || !award) return;

    await addAwardDelivery(award.id, {
      customerName: customerName.trim(),
      contractNumber: contractNumber.trim(),
      kitPurchased,
      deliveryDate,
      deliveredBy,
      status: 'entregue',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Registrar Entrega de Brinde</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Prêmio a Entregar *</label>
            <select
              value={selectedAward}
              onChange={(e) => setSelectedAward(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            >
              {awards.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Disponível em estoque: {a.stockCurrent} un)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Nome Completo do Cliente *</label>
            <input
              type="text"
              placeholder="Ex: Roberto Alencar..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Nº do Contrato Assinado *</label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Kit Solar Fechado</label>
              <select
                value={kitPurchased}
                onChange={(e) => setKitPurchased(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="Kit 1.000">Kit 1.000</option>
                <option value="Kit 2.000">Kit 2.000</option>
                <option value="Kit 3.000">Kit 3.000</option>
                <option value="Outro Kit Especial">Outro Kit Especial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Data da Entrega</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Entregue Por (Consultor)</label>
              <input
                type="text"
                value={deliveredBy}
                onChange={(e) => setDeliveredBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
            Ao registrar a entrega, o estoque atual do prêmio selecionado será reduzido em 1 unidade automaticamente.
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
              Confirmar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
