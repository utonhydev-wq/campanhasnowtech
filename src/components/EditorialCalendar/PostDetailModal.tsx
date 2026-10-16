import React, { useState } from 'react';
import {
  X,
  Calendar,
  Layers,
  FileText,
  User,
  Clock,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import {
  EditorialPost,
  EditorialContentType,
  EditorialDayOfWeek,
  EditorialPillar,
  EditorialStatus,
  EditorialSocialNetwork,
  CampaignId,
} from '../../types';
import { useCampaigns } from '../../context/CampaignContext';
import { EDITORIAL_PILLARS, getCampaignForDate } from '../../services/editorialService';

interface PostDetailModalProps {
  post: EditorialPost;
  onClose: () => void;
  onOpenCarouselEditor?: (post: EditorialPost) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onOpenCarouselEditor,
}) => {
  const { updateEditorialPost, deleteEditorialPost, state } = useCampaigns();
  const { teamMembers } = useCampaigns().state;

  const [scheduledDate, setScheduledDate] = useState(post.scheduledDate);
  const [contentType, setContentType] = useState<EditorialContentType>(post.contentType);
  const [theme, setTheme] = useState(post.theme);
  const [objective, setObjective] = useState(post.objective);
  const [campaignId, setCampaignId] = useState<CampaignId | 'institucional'>(post.campaignId);
  const [pillar, setPillar] = useState<EditorialPillar>(post.pillar);
  const [socialNetwork, setSocialNetwork] = useState<EditorialSocialNetwork>(post.socialNetwork);
  const [caption, setCaption] = useState(post.caption);
  const [callToAction, setCallToAction] = useState(post.callToAction);
  const [hashtags, setHashtags] = useState(post.hashtags);
  const [responsible, setResponsible] = useState(post.responsible);
  const [dueDate, setDueDate] = useState(post.dueDate);
  const [status, setStatus] = useState<EditorialStatus>(post.status);
  const [approvalStatus, setApprovalStatus] = useState(post.approvalStatus);
  const [publishedLink, setPublishedLink] = useState(post.publishedLink || '');
  const [notes, setNotes] = useState(post.notes || '');

  // Manual Exception check
  const dateObj = new Date(scheduledDate + 'T00:00:00');
  const dayOfWeekIndex = dateObj.getDay(); // 1 = Seg, 4 = Qui
  const isStandardDay = dayOfWeekIndex === 1 || dayOfWeekIndex === 4;
  const computedDayOfWeek: EditorialDayOfWeek =
    dayOfWeekIndex === 1 ? 'segunda' : dayOfWeekIndex === 4 ? 'quinta' : 'outro';

  const [isManualException, setIsManualException] = useState(!isStandardDay || post.isManualException);
  const [exceptionJustification, setExceptionJustification] = useState(post.exceptionJustification || '');

  // Metrics
  const [reach, setReach] = useState(post.results?.reach || 0);
  const [interactions, setInteractions] = useState(post.results?.interactions || 0);
  const [clicks, setClicks] = useState(post.results?.clicks || 0);
  const [leads, setLeads] = useState(post.results?.leads || 0);

  const [copiedCaption, setCopiedCaption] = useState(false);

  const handleCopy = () => {
    const full = `${caption}\n\n${callToAction}\n\n${hashtags}`;
    navigator.clipboard.writeText(full);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleApprove = () => {
    setApprovalStatus('aprovado');
    if (status === 'aguardando_aprovacao' || status === 'ideia' || status === 'em_revisao') {
      setStatus('aprovado');
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteEditorialPost(post.id);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStandardDay && !exceptionJustification.trim()) {
      setFormError('Esta publicação está marcada fora de Segunda ou Quinta-feira. Por favor, preencha a justificativa da exceção manual.');
      return;
    }

    await updateEditorialPost({
      ...post,
      scheduledDate,
      dayOfWeek: computedDayOfWeek,
      contentType,
      theme,
      objective,
      campaignId,
      pillar,
      socialNetwork,
      caption,
      callToAction,
      hashtags,
      responsible,
      dueDate,
      status,
      approvalStatus,
      approvedBy: approvalStatus === 'aprovado' ? post.approvedBy || 'Beatriz Lima (Coord. Marketing)' : null,
      approvedAt: approvalStatus === 'aprovado' ? post.approvedAt || new Date().toISOString() : null,
      publishedLink,
      notes,
      isManualException: !isStandardDay || isManualException,
      exceptionJustification: !isStandardDay || isManualException ? exceptionJustification : undefined,
      results: {
        reach,
        interactions,
        clicks,
        leads,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-6 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                contentType === 'post'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {contentType === 'post' ? 'POST' : 'CARR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                  {computedDayOfWeek === 'segunda'
                    ? 'Segunda-feira · Post da Semana'
                    : computedDayOfWeek === 'quinta'
                    ? 'Quinta-feira · Carrossel de Fotos'
                    : 'Exceção Manual'}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-400">{scheduledDate}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Detalhes da Publicação Editorial
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {contentType === 'carrossel' && onOpenCarouselEditor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCarouselEditor(post);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Editor de Slides</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{formError}</span>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              Fechar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Top row: Date, Format, Day warning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Data Programada *</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => {
                  setScheduledDate(e.target.value);
                  const newCamp = getCampaignForDate(e.target.value);
                  setCampaignId(newCamp);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Formato de Conteúdo</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as EditorialContentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="post">Post Individual (Segunda-feira)</option>
                <option value="carrossel">Carrossel de Fotos (Quinta-feira)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Rede Social</label>
              <select
                value={socialNetwork}
                onChange={(e) => setSocialNetwork(e.target.value as EditorialSocialNetwork)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="ambos">Instagram & Facebook</option>
                <option value="instagram">Apenas Instagram</option>
                <option value="facebook">Apenas Facebook</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>

          {/* Standard Day Validation / Exception Alert */}
          {isStandardDay ? (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {dayOfWeekIndex === 1
                  ? 'Data validada: Segunda-feira reservada para Post da Semana (Regra Oficial).'
                  : 'Data validada: Quinta-feira reservada para Carrossel de Fotos (Regra Oficial).'}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Exceção Manual da Frequência Padrão</span>
              </div>
              <p className="text-[11px] text-slate-300">
                A data selecionada não é uma Segunda-feira nem uma Quinta-feira. A política editorial da NowTech Solar exige o registro de uma justificativa formal para exceções.
              </p>
              <input
                type="text"
                placeholder="Justificativa da publicação fora da regra (ex: Anúncio extraordinário, feriado comercial)..."
                value={exceptionJustification}
                onChange={(e) => setExceptionJustification(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 rounded p-2 text-xs text-white"
                required
              />
            </div>
          )}

          {/* Theme & Objective */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Tema Central *</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Objetivo Comercial / Estratégico</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            />
          </div>

          {/* Campaign & Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Campanha Vinculada</label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="pre-black">Pré-Black Friday Solar (29/10 a 13/11)</option>
                <option value="black-friday">Black Friday Oficial - Fechou Ganhou (16 a 27/11)</option>
                <option value="natal">Campanha de Natal NowTech (10 a 30/12)</option>
                <option value="institucional">Institucional / Calendário Regular</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Pilar Editorial Oficial</label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as EditorialPillar)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {EDITORIAL_PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption, CTA, Hashtags */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-400 font-medium">Legenda da Publicação</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copiado!' : 'Copiar Texto Completo'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Chamada para Ação (CTA)</label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Hashtags</label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Responsibility, Deadlines and Production Workflow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Responsável</label>
              <select
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Prazo Produção</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Status de Fluxo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EditorialStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="ideia">Ideia / Planejado</option>
                <option value="em_producao">Em Produção</option>
                <option value="em_revisao">Em Revisão</option>
                <option value="aguardando_aprovacao">Aguardando Aprovação</option>
                <option value="aprovado">Aprovado</option>
                <option value="agendado">Agendado</option>
                <option value="publicado">Publicado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Aprovação Gestão</label>
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold uppercase border ${
                    approvalStatus === 'aprovado'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {approvalStatus}
                </span>
                {approvalStatus !== 'aprovado' && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="p-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30"
                    title="Aprovar formalmente conteúdo"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Published Link & Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Link da Publicação Realizada</label>
              <input
                type="url"
                placeholder="https://instagram.com/p/..."
                value={publishedLink}
                onChange={(e) => setPublishedLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Observações</label>
              <input
                type="text"
                placeholder="Notas da equipe ou ajustes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          {/* Performance indicators when available */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
              Resultados da Publicação (Quando Publicado)
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-slate-400 text-[10px] block">Alcance</label>
                <input
                  type="number"
                  value={reach}
                  onChange={(e) => setReach(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] block">Interações</label>
                <input
                  type="number"
                  value={interactions}
                  onChange={(e) => setInteractions(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] block">Cliques no Link</label>
                <input
                  type="number"
                  value={clicks}
                  onChange={(e) => setClicks(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] block">Leads Gerados</label>
                <input
                  type="number"
                  value={leads}
                  onChange={(e) => setLeads(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white font-mono text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-300">Tem certeza?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors"
                >
                  Confirmar Exclusão
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-slate-400 hover:text-white px-1"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Publicação</span>
              </button>
            )}

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
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Salvar Conteúdo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
