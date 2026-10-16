import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Printer,
  Share2,
  ExternalLink,
  Edit2,
  Save,
  AlertCircle,
  Truck,
  Layers,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { ChristmasPamphlet } from '../types';

export const ChristmasPamphletManager: React.FC = () => {
  const { state, updateChristmasPamphlet } = useCampaigns();
  const { christmasPamphlet } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ChristmasPamphlet>({ ...christmasPamphlet });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateChristmasPamphlet(formData);
    setIsEditing(false);
  };

  const handleQuickApprove = async () => {
    await updateChristmasPamphlet({ reviewStatus: 'aprovado' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              PRODUÇÃO PÓS-BLACK FRIDAY
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">Material Gráfico Oficial</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <FileText className="w-5 h-5 text-sky-400" />
            Panfleto de Natal NowTech Solar 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Controle de criação, texto promocional, aprovação dos preços natalinos, impressão gráfica e distribuição externa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => {
                setFormData({ ...christmasPamphlet });
                setIsEditing(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Panfleto</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          )}

          {christmasPamphlet.reviewStatus !== 'aprovado' && (
            <button
              onClick={handleQuickApprove}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Aprovar Panfleto</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Status de Revisão</span>
          <span
            className={`text-xs font-mono font-bold block mt-1 uppercase ${
              christmasPamphlet.reviewStatus === 'aprovado'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {christmasPamphlet.reviewStatus.replace('_', ' ')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Aprovação da Gestão</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Impressão Gráfica</span>
          <span className="text-xs font-mono font-bold text-sky-400 block mt-1 uppercase">
            {christmasPamphlet.printStatus.replace('_', ' ')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">{christmasPamphlet.quantityOrdered.toLocaleString('pt-BR')} unidades</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Distribuição</span>
          <span className="text-xs font-mono font-bold text-purple-400 block mt-1 uppercase">
            {christmasPamphlet.distributionStatus.replace('_', ' ')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Bairros mapeados</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Prazo de Entrega</span>
          <span className="text-base font-bold font-mono text-white tabular-nums block mt-1">
            {christmasPamphlet.deadlineDelivery}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Resp: {christmasPamphlet.responsibleCreation}</span>
        </div>
      </div>

      {/* Edit Form or Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Editar Cadastro do Panfleto de Natal</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Nome do Material</label>
              <input
                type="text"
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Responsável pela Criação</label>
              <input
                type="text"
                value={formData.responsibleCreation}
                onChange={(e) => setFormData({ ...formData, responsibleCreation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Prazo para Entrega</label>
              <input
                type="date"
                value={formData.deadlineDelivery}
                onChange={(e) => setFormData({ ...formData, deadlineDelivery: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tiragem Prevista (Unidades)</label>
              <input
                type="number"
                value={formData.quantityOrdered}
                onChange={(e) => setFormData({ ...formData, quantityOrdered: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Status de Revisão e Aprovação</label>
              <select
                value={formData.reviewStatus}
                onChange={(e) => setFormData({ ...formData, reviewStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="em_elaboracao">Em Elaboração</option>
                <option value="em_revisao">Em Revisão</option>
                <option value="aprovado">Aprovado pela Gestão</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Status de Impressão</label>
              <select
                value={formData.printStatus}
                onChange={(e) => setFormData({ ...formData, printStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="nao_iniciado">Não Iniciado</option>
                <option value="em_orcamento">Em Orçamento</option>
                <option value="em_impressao">Em Impressão</option>
                <option value="impresso">Impresso</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Status de Distribuição</label>
              <select
                value={formData.distributionStatus}
                onChange={(e) => setFormData({ ...formData, distributionStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="nao_iniciado">Não Iniciado</option>
                <option value="planejada">Planejada</option>
                <option value="em_distribuicao">Em Distribuição</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Link do Arquivo Final (Drive / Canva / PDF)</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.finalFileLink}
                onChange={(e) => setFormData({ ...formData, finalFileLink: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Texto Promocional do Panfleto</label>
              <textarea
                rows={3}
                value={formData.promotionalText}
                onChange={(e) => setFormData({ ...formData, promotionalText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Produtos ou Kits Participantes</label>
              <input
                type="text"
                value={formData.participatingKits}
                onChange={(e) => setFormData({ ...formData, participatingKits: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Preços e Condições (A definir pela equipe)</label>
              <textarea
                rows={2}
                value={formData.pricesAndConditions}
                onChange={(e) => setFormData({ ...formData, pricesAndConditions: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Dados do Panfleto</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Conteúdo Editorial & Chamada
            </span>

            <div>
              <span className="text-slate-400 text-[11px] block">Texto Promocional:</span>
              <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80 mt-1 italic">
                "{christmasPamphlet.promotionalText}"
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Kits Participantes:</span>
              <p className="text-amber-300 font-medium mt-0.5">{christmasPamphlet.participatingKits}</p>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Preços e Condições:</span>
              <p className="text-slate-300 mt-0.5">{christmasPamphlet.pricesAndConditions}</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Produção Gráfica & Logística
            </span>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Responsável:</span>
                <span className="font-medium text-white">{christmasPamphlet.responsibleCreation}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Prazo de Entrega:</span>
                <span className="font-mono text-white">{christmasPamphlet.deadlineDelivery}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Tiragem Autorizada:</span>
                <span className="font-mono font-bold text-white">
                  {christmasPamphlet.quantityOrdered.toLocaleString('pt-BR')} unidades
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Arquivo Final:</span>
                {christmasPamphlet.finalFileLink ? (
                  <a
                    href={christmasPamphlet.finalFileLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    Abrir Arquivo <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-amber-400/80 italic font-mono">Pendente de upload</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">Observações:</span>
              {christmasPamphlet.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
