import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Plus,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  DollarSign,
  Trophy,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { BalloonAction, BalloonPrize, BalloonActionLog } from '../types';

export const BalloonActionManager: React.FC = () => {
  const { state, updateBalloonAction } = useCampaigns();
  const { balloonAction } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogAuthor, setNewLogAuthor] = useState('Rodrigo Antunes');

  const [formData, setFormData] = useState({
    description: balloonAction.description,
    location: balloonAction.location,
    dateTime: balloonAction.dateTime,
    responsible: balloonAction.responsible,
    balloonQuantity: balloonAction.balloonQuantity,
    participationRules: balloonAction.participationRules,
    estimatedBudget: balloonAction.estimatedBudget,
    actualBudget: balloonAction.actualBudget,
    executionStatus: balloonAction.executionStatus,
  });

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBalloonAction(formData);
    setIsEditing(false);
  };

  const handleApproveRules = async () => {
    await updateBalloonAction({ rulesApproved: !balloonAction.rulesApproved });
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAction.trim()) return;

    const newLog: BalloonActionLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      action: newLogAction.trim(),
      doneBy: newLogAuthor.trim(),
    };

    await updateBalloonAction({
      preparationsLog: [newLog, ...balloonAction.preparationsLog],
    });

    setNewLogAction('');
  };

  const handleUpdatePrizeAwarded = async (prizeId: string, delta: number) => {
    const updatedPrizes = balloonAction.prizes.map((p) => {
      if (p.id !== prizeId) return p;
      const newAwarded = Math.max(0, Math.min(p.quantityAvailable, p.quantityAwarded + delta));
      return { ...p, quantityAwarded: newAwarded };
    });
    await updateBalloonAction({ prizes: updatedPrizes });
  };

  const totalPrizesCount = balloonAction.prizes.reduce((acc, p) => acc + p.quantityAvailable, 0);
  const totalPrizesAwarded = balloonAction.prizes.reduce((acc, p) => acc + p.quantityAwarded, 0);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              AÇÃO 1 · CAMPANHA DE NATAL
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">Showroom Central</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Dinâmica Promocional "Estoura Balão"
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Módulo oficial para planejar, aprovar regras, controlar preparativos e auditar a distribuição de prêmios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Editar Detalhes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          )}

          {!balloonAction.rulesApproved && (
            <button
              onClick={handleApproveRules}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Aprovar Regras</span>
            </button>
          )}
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total de Balões</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {balloonAction.balloonQuantity}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Painel decorado na loja</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Prêmios no Total</span>
          <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {totalPrizesCount}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">{totalPrizesAwarded} já estourados</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Orçamento Previsto</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            R$ {balloonAction.estimatedBudget.toLocaleString('pt-BR')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Realizado: R$ {balloonAction.actualBudget}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Fase de Execução</span>
          <span className="text-xs font-mono font-bold text-emerald-400 block mt-1 uppercase">
            {balloonAction.executionStatus.replace('_', ' ')}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {balloonAction.rulesApproved ? 'Regras Aprovadas' : 'Regras Pendentes'}
          </span>
        </div>
      </div>

      {/* Edit Form or Information Block */}
      {isEditing ? (
        <form onSubmit={handleSaveGeneral} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Editar Dados da Ação Estoura Balão</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Local de Realização</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Data e Horário</label>
              <input
                type="text"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Responsável</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Quantidade de Balões</label>
              <input
                type="number"
                value={formData.balloonQuantity}
                onChange={(e) => setFormData({ ...formData, balloonQuantity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Orçamento Previsto (R$)</label>
              <input
                type="number"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Status da Execução</label>
              <select
                value={formData.executionStatus}
                onChange={(e) => setFormData({ ...formData, executionStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="planejamento">Planejamento</option>
                <option value="preparativos">Preparativos</option>
                <option value="regras_aprovadas">Regras Aprovadas</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Regras de Participação</label>
              <textarea
                rows={3}
                value={formData.participationRules}
                onChange={(e) => setFormData({ ...formData, participationRules: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Dados Operacionais da Ativação
            </span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>Local:</strong> {balloonAction.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>Período:</strong> {balloonAction.dateTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>Responsável Geral:</strong> {balloonAction.responsible}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="font-semibold text-slate-300 block mb-1">Materiais Necessários:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                {balloonAction.requiredMaterials.map((mat, i) => (
                  <li key={i}>{mat}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                Regulamento & Critérios
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  balloonAction.rulesApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {balloonAction.rulesApproved ? 'Aprovado' : 'Aguardando Gestão'}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              {balloonAction.participationRules}
            </p>

            <p className="text-[11px] text-slate-400">
              Clientes que realizarem proposta na loja têm direito a estourar 1 balão no painel com premiação imediata.
            </p>
          </div>
        </div>
      )}

      {/* Prizes Matrix */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Distribuição de Prêmios nos Balões ({balloonAction.prizes.length} tipos de benefícios)</span>
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Prêmio / Benefício no Balão</th>
                <th className="py-2.5 px-4 font-semibold text-center">Quantidade Total</th>
                <th className="py-2.5 px-4 font-semibold text-center">Já Entregues</th>
                <th className="py-2.5 px-4 font-semibold text-center">Restantes</th>
                <th className="py-2.5 px-4 font-semibold text-right">Controle Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {balloonAction.prizes.map((pz) => {
                const remaining = pz.quantityAvailable - pz.quantityAwarded;
                return (
                  <tr key={pz.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-medium text-white">{pz.name}</td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-300">{pz.quantityAvailable}</td>
                    <td className="py-2.5 px-4 text-center font-mono text-sky-400 font-bold">{pz.quantityAwarded}</td>
                    <td className="py-2.5 px-4 text-center font-mono text-emerald-400 font-bold">{remaining}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdatePrizeAwarded(pz.id, -1)}
                          disabled={pz.quantityAwarded <= 0}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleUpdatePrizeAwarded(pz.id, 1)}
                          disabled={remaining <= 0}
                          className="px-2 py-0.5 rounded bg-sky-900 hover:bg-sky-800 text-sky-200 font-bold disabled:opacity-30"
                        >
                          +1 Estourado
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preparations Log */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Registro dos Preparativos & Histórico de Execução</span>
        </h3>

        <form onSubmit={handleAddLog} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            placeholder="Descreva a ação de preparativo concluída (ex: Painel de balões montado no salão)..."
            value={newLogAction}
            onChange={(e) => setNewLogAction(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500"
          />
          <input
            type="text"
            placeholder="Responsável"
            value={newLogAuthor}
            onChange={(e) => setNewLogAuthor(e.target.value)}
            className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg whitespace-nowrap"
          >
            Registrar Preparativo
          </button>
        </form>

        <div className="space-y-2">
          {balloonAction.preparationsLog.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-slate-200">{log.action}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
                <span>Por: {log.doneBy}</span>
                <span>·</span>
                <span>{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
