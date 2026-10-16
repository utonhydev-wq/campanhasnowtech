import React, { useState } from 'react';
import {
  Video,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Calendar,
  Share2,
  Edit2,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { ChristmasVideoWorkflow, VideoProductionStep } from '../types';

export const ChristmasVideoWorkflowManager: React.FC = () => {
  const { state, updateChristmasVideoWorkflow, advanceVideoStep } = useCampaigns();
  const { christmasVideoWorkflow } = state;

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepDeliverableUrl, setStepDeliverableUrl] = useState('');
  const [stepNotes, setStepNotes] = useState('');

  const [settingsForm, setSettingsForm] = useState({
    mediaBudget: christmasVideoWorkflow.mediaBudget,
    responsible: christmasVideoWorkflow.responsible,
    finalVideoUrl: christmasVideoWorkflow.finalVideoUrl,
    airingStart: christmasVideoWorkflow.airingPeriod.start,
    airingEnd: christmasVideoWorkflow.airingPeriod.end,
    platformsStr: christmasVideoWorkflow.platforms.join(', '),
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const platforms = settingsForm.platformsStr
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    await updateChristmasVideoWorkflow({
      mediaBudget: settingsForm.mediaBudget,
      responsible: settingsForm.responsible,
      finalVideoUrl: settingsForm.finalVideoUrl,
      platforms,
      airingPeriod: {
        start: settingsForm.airingStart,
        end: settingsForm.airingEnd,
      },
    });
    setIsEditingSettings(false);
  };

  const handleCompleteStep = async (stepNum: number) => {
    await advanceVideoStep(stepNum, stepDeliverableUrl, stepNotes);
    setEditingStepIndex(null);
    setStepDeliverableUrl('');
    setStepNotes('');
  };

  const completedStepsCount = christmasVideoWorkflow.steps.filter((s) => s.status === 'concluido').length;
  const progressPercent = Math.round((completedStepsCount / christmasVideoWorkflow.steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              AÇÃO 3 · CAMPANHA DE NATAL
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">Tráfego Pago & Audiovisual</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <Video className="w-5 h-5 text-sky-400" />
            Fluxo de Produção do Vídeo Promocional de Natal (9 Etapas)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Acompanhamento sequencial de ponta a ponta: do objetivo comercial à veiculação e mensuração de ROI.
          </p>
        </div>

        <button
          onClick={() => setIsEditingSettings(!isEditingSettings)}
          className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditingSettings ? 'Fechar Configurações' : 'Configurar Mídia'}</span>
        </button>
      </div>

      {/* Progress & Overview Bar */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Progresso do Pipeline ({completedStepsCount} de {christmasVideoWorkflow.steps.length} etapas concluídas)
            </span>
            <span className="text-lg font-bold text-white mt-0.5 block">
              Etapa Atual: {christmasVideoWorkflow.steps[christmasVideoWorkflow.currentStep - 1]?.title || 'Finalizado'}
            </span>
          </div>
          <span className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Media Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-800/80">
          <div>
            <span className="text-slate-400 text-[11px] block">Orçamento de Mídia:</span>
            <span className="font-mono font-bold text-emerald-400">
              R$ {christmasVideoWorkflow.mediaBudget.toLocaleString('pt-BR')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Responsável de Mídia:</span>
            <span className="font-medium text-white">{christmasVideoWorkflow.responsible}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Período de Veiculação:</span>
            <span className="font-mono text-white">
              {christmasVideoWorkflow.airingPeriod.start} a {christmasVideoWorkflow.airingPeriod.end}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Vídeo Final:</span>
            {christmasVideoWorkflow.finalVideoUrl ? (
              <a
                href={christmasVideoWorkflow.finalVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
              >
                Assistir <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-slate-500 italic">Em produção</span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Form Modal/Panel */}
      {isEditingSettings && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Configurar Mídia & Período do Vídeo de Natal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Orçamento de Mídia (R$)</label>
              <input
                type="number"
                value={settingsForm.mediaBudget}
                onChange={(e) => setSettingsForm({ ...settingsForm, mediaBudget: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Responsável de Mídia</label>
              <input
                type="text"
                value={settingsForm.responsible}
                onChange={(e) => setSettingsForm({ ...settingsForm, responsible: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Início da Veiculação</label>
              <input
                type="date"
                value={settingsForm.airingStart}
                onChange={(e) => setSettingsForm({ ...settingsForm, airingStart: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Término da Veiculação</label>
              <input
                type="date"
                value={settingsForm.airingEnd}
                onChange={(e) => setSettingsForm({ ...settingsForm, airingEnd: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Plataformas Utilizadas (separadas por vírgula)</label>
              <input
                type="text"
                value={settingsForm.platformsStr}
                onChange={(e) => setSettingsForm({ ...settingsForm, platformsStr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                placeholder="Meta Ads, Google Ads, TikTok..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1">Link do Vídeo Final (YouTube / Drive / Vimeo)</label>
              <input
                type="url"
                value={settingsForm.finalVideoUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, finalVideoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      )}

      {/* The 9 Sequential Steps */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Etapas Sequenciais do Fluxo</h3>

        <div className="space-y-3">
          {christmasVideoWorkflow.steps.map((st) => {
            const isCompleted = st.status === 'concluido';
            const isCurrent = st.status === 'em_andamento';
            const isPending = st.status === 'pendente';

            const isEditingThisStep = editingStepIndex === st.step;

            return (
              <div
                key={st.step}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : isCurrent
                    ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : st.step}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{st.title}</h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isCurrent
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{st.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>Resp: {st.responsible}</span>
                        <span>·</span>
                        <span className="font-mono">Prazo: {st.dueDate}</span>
                        {st.deliverableUrl && (
                          <>
                            <span>·</span>
                            <a
                              href={st.deliverableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              Entregável <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          if (isEditingThisStep) {
                            setEditingStepIndex(null);
                          } else {
                            setEditingStepIndex(st.step);
                            setStepDeliverableUrl(st.deliverableUrl || '');
                            setStepNotes(st.notes || '');
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {isEditingThisStep ? 'Cancelar' : 'Concluir Etapa'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline form to complete step */}
                {isEditingThisStep && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950 p-3.5 rounded-lg space-y-3">
                    <span className="text-xs font-bold text-white block">
                      Registrar Conclusão da Etapa {st.step}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Link do Entregável (opcional)</label>
                        <input
                          type="url"
                          placeholder="https://docs.google.com/..."
                          value={stepDeliverableUrl}
                          onChange={(e) => setStepDeliverableUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Observações da Conclusão</label>
                        <input
                          type="text"
                          placeholder="Ex: Roteiro revisado e validado..."
                          value={stepNotes}
                          onChange={(e) => setStepNotes(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingStepIndex(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Fechar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCompleteStep(st.step)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar e Avançar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
