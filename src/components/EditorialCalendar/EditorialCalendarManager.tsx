import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Layers,
  FileText,
  Plus,
  RefreshCw,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Copy,
  Check,
  Share2,
  List,
  Columns,
  Grid3X3,
  Sparkles,
} from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';
import {
  EditorialPost,
  EditorialContentType,
  EditorialStatus,
  EditorialPillar,
  CampaignId,
} from '../../types';
import { EDITORIAL_PILLARS } from '../../services/editorialService';
import { EditorialKPIs } from './EditorialKPIs';
import { PostDetailModal } from './PostDetailModal';
import { CarouselBuilderModal } from './CarouselBuilderModal';

export const EditorialCalendarManager: React.FC = () => {
  const {
    state,
    generateAutoEditorialSchedule,
    updateEditorialPost,
    approveEditorialPost,
    changeEditorialStatus,
  } = useCampaigns();

  const posts = state.editorialPosts || [];
  const currentDateRef = '2026-10-13';

  // View Mode: 'month' | 'week' | 'list'
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 9 = Outubro, 10 = Nov, 11 = Dez

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');

  // Modals
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<EditorialPost | null>(null);
  const [selectedPostForCarousel, setSelectedPostForCarousel] = useState<EditorialPost | null>(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    if (filterCampaign !== 'all' && p.campaignId !== filterCampaign) return false;
    if (filterFormat !== 'all' && p.contentType !== filterFormat) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterPillar !== 'all' && p.pillar !== filterPillar) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTheme = p.theme.toLowerCase().includes(q);
      const matchCaption = p.caption.toLowerCase().includes(q);
      const matchResp = p.responsible.toLowerCase().includes(q);
      if (!matchTheme && !matchCaption && !matchResp) return false;
    }
    return true;
  });

  const [scheduleNotification, setScheduleNotification] = useState<string | null>(null);

  const handleGenerateSchedule = async () => {
    await generateAutoEditorialSchedule('2026-10-01', '2026-12-31');
    setScheduleNotification('Programação automática de Segundas e Quintas-feiras gerada com sucesso para todo o Q4 2026!');
    setTimeout(() => setScheduleNotification(null), 5000);
  };

  const handleMarkPublished = async (post: EditorialPost) => {
    await updateEditorialPost({
      ...post,
      status: 'publicado',
      publishedLink: post.publishedLink || 'https://instagram.com/nowtechsolar',
    });
    setScheduleNotification(`Publicação de ${post.scheduledDate} marcada como "Publicada"!`);
    setTimeout(() => setScheduleNotification(null), 4000);
  };

  const handleQuickApprove = async (post: EditorialPost) => {
    await approveEditorialPost(post.id, 'Beatriz Lima (Coord. Marketing)');
    setScheduleNotification(`Conteúdo de ${post.scheduledDate} aprovado formalmente!`);
    setTimeout(() => setScheduleNotification(null), 4000);
  };

  // Month grid calculations
  const daysInMonth = new Date(2026, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(2026, selectedMonth, 1).getDay(); // 0 = Dom
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getPostsForDay = (day: number) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const fullDate = `2026-${monthStr}-${dayStr}`;
    return filteredPosts.filter((p) => p.scheduledDate === fullDate);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
              PLANEJAMENTO DE REDES SOCIAIS
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300 font-medium">Instagram, Facebook & Canais NowTech</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            Calendário Editorial & Agendamento de Conteúdo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Frequência obrigatória: <strong className="text-sky-300">Segunda-feira (Post da Semana)</strong> e <strong className="text-amber-300">Quinta-feira (Carrossel de Fotos)</strong>, integrado às campanhas oficiais.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            title="Gera automaticamente todas as segundas e quintas sem duplicar"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sincronizar Recorrência</span>
          </button>

          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setSelectedPostForDetail({
                id: `post-${Date.now()}`,
                scheduledDate: '2026-10-19',
                dayOfWeek: 'segunda',
                contentType: 'post',
                theme: 'Novo Conteúdo Editorial',
                objective: 'Engajamento e captação comercial',
                campaignId: 'institucional',
                pillar: 'educacao_solar',
                socialNetwork: 'ambos',
                caption: 'Escreva a legenda...',
                callToAction: 'Fale com a NowTech Solar no link da bio!',
                hashtags: '#NowTechSolar #EnergiaSolar',
                imageFiles: [],
                responsible: 'Lucas Rocha',
                dueDate: '2026-10-16',
                approvalStatus: 'pendente',
                status: 'ideia',
                isManualException: false,
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Publicação</span>
          </button>
        </div>
      </div>

      {scheduleNotification && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scheduleNotification}</span>
          </div>
          <button
            onClick={() => setScheduleNotification(null)}
            className="text-slate-400 hover:text-white text-xs px-2"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Official Frequency Rule Sticky Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-amber-500/20">
            <CalendarIcon className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                LEMBRETE MANDATÓRIO
              </span>
              <span className="text-xs font-bold text-white">
                Publicações Fixas: Apenas Segundas e Quintas-feiras
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              No calendário editorial da NowTech Solar, as publicações ocorrem exclusivamente às{' '}
              <strong className="text-sky-300 font-semibold">Segundas-feiras (Post da Semana)</strong> e às{' '}
              <strong className="text-amber-300 font-semibold">Quintas-feiras (Carrossel de Fotos)</strong>. Demais dias não possuem postagens de linha padrão, mantendo foco total na qualidade e nas campanhas de 2026.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-300 font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Seg: Post Semanal</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Qui: Carrossel</span>
          </div>
        </div>
      </div>

      {/* Editorial KPIs Dashboard */}
      <EditorialKPIs posts={posts} currentDateRef={currentDateRef} />

      {/* Filter and View Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por tema, legenda ou responsável..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'month' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Mês</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'week' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Semana</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Campanha:</label>
            <select
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas as Campanhas</option>
              <option value="pre-black">Pré-Black Friday Solar</option>
              <option value="black-friday">Black Friday Oficial</option>
              <option value="natal">Campanha de Natal</option>
              <option value="institucional">Institucional</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Formato Editorial:</label>
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos os Formatos</option>
              <option value="post">Segunda: Post Individual</option>
              <option value="carrossel">Quinta: Carrossel de Fotos</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Pilar de Conteúdo:</label>
            <select
              value={filterPillar}
              onChange={(e) => setFilterPillar(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos os 8 Pilares</option>
              {EDITORIAL_PILLARS.map((pil) => (
                <option key={pil.id} value={pil.id}>
                  {pil.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Status da Produção:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos os Status</option>
              <option value="ideia">Ideia / Planejado</option>
              <option value="em_producao">Em Produção</option>
              <option value="em_revisao">Em Revisão</option>
              <option value="aguardando_aprovacao">Aguardando Aprovação</option>
              <option value="aprovado">Aprovado</option>
              <option value="agendado">Agendado</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: MONTH GRID */}
      {viewMode === 'month' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                {monthNames[selectedMonth]} de 2026
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                (Hoje: 13/10/2026)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={selectedMonth <= 9}
                onClick={() => setSelectedMonth(Math.max(9, selectedMonth - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={selectedMonth >= 11}
                onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers with highlighted Mon (Seg) and Thu (Qui) */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold pb-2">
            <div className="text-slate-500">DOM</div>
            <div className="text-sky-400 bg-sky-950/40 py-1 rounded">SEG (POST)</div>
            <div className="text-slate-500">TER</div>
            <div className="text-slate-500">QUA</div>
            <div className="text-amber-400 bg-amber-950/40 py-1 rounded">QUI (CARR)</div>
            <div className="text-slate-500">SEX</div>
            <div className="text-slate-500">SÁB</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {blankDays.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[120px] rounded-lg bg-slate-950/40 border border-slate-800/40 p-2" />
            ))}

            {daysArray.map((day) => {
              const monthStr = String(selectedMonth + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const fullDate = `2026-${monthStr}-${dayStr}`;

              const isToday = fullDate === currentDateRef;
              const dateObj = new Date(fullDate + 'T00:00:00');
              const dayOfWeek = dateObj.getDay();
              const isMonday = dayOfWeek === 1;
              const isThursday = dayOfWeek === 4;

              const dayPosts = getPostsForDay(day);

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[125px] rounded-lg border p-2 flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                      : isMonday
                      ? 'bg-slate-950 border-sky-900/50 hover:border-sky-700'
                      : isThursday
                      ? 'bg-slate-950 border-amber-900/50 hover:border-amber-700'
                      : 'bg-slate-950/60 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono font-bold ${
                        isToday ? 'text-amber-400 font-extrabold' : 'text-slate-300'
                      }`}
                    >
                      {day}
                      {isToday && <span className="text-[9px] uppercase ml-1">Hoje</span>}
                    </span>

                    {isMonday && (
                      <span className="text-[9px] font-mono font-bold text-sky-400">Post</span>
                    )}
                    {isThursday && (
                      <span className="text-[9px] font-mono font-bold text-amber-400">Carrossel</span>
                    )}
                  </div>

                  {/* Day Posts cards */}
                  <div className="space-y-1.5 my-1 overflow-y-auto max-h-[85px]">
                    {dayPosts.map((p) => {
                      const isCarousel = p.contentType === 'carrossel';
                      const isPublished = p.status === 'publicado';

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (isCarousel) {
                              setSelectedPostForCarousel(p);
                            } else {
                              setSelectedPostForDetail(p);
                            }
                          }}
                          className={`p-1.5 rounded text-[10px] font-medium border cursor-pointer transition-all hover:scale-[1.02] space-y-0.5 ${
                            isPublished
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                              : isCarousel
                              ? 'bg-amber-950/70 border-amber-500/40 text-amber-200'
                              : 'bg-sky-950/70 border-sky-500/40 text-sky-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold uppercase tracking-wider text-[9px] truncate max-w-[80px]">
                              {isCarousel ? 'Carrossel' : 'Post'}
                            </span>
                            <span className="text-[8px] font-mono uppercase">
                              {p.status}
                            </span>
                          </div>
                          <p className="line-clamp-2 leading-tight text-white font-medium">
                            {p.theme}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {dayPosts.length === 0 && (
                    <div className="flex-1 flex items-center justify-center my-2">
                      {!isMonday && !isThursday ? (
                        <span className="text-[10px] text-slate-600 font-mono italic">
                          Sem publicação
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400/70 font-mono">
                          {isMonday ? 'Post livre' : 'Carrossel livre'}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500 font-mono text-right">
                    {dayPosts.length > 0 ? `${dayPosts.length} pub` : !isMonday && !isThursday ? 'Folga' : 'Disponível'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: WEEKLY SPLIT VIEW */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              Visualização focada no par editorial semanal: Segunda (Post) e Quinta (Carrossel).
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {filteredPosts.length} publicações programadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Segundas-feiras (Posts) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sky-400">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white uppercase">Segundas-feiras · Posts da Semana</h3>
                </div>
                <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30">
                  {filteredPosts.filter((p) => p.contentType === 'post').length}
                </span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredPosts
                  .filter((p) => p.contentType === 'post')
                  .map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {post.scheduledDate.split('-').reverse().join('/')}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase border ${
                            post.status === 'publicado'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{post.theme}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{post.caption}</p>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Resp: {post.responsible}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedPostForDetail(post)}
                            className="text-sky-400 hover:underline font-semibold"
                          >
                            Editar
                          </button>
                          {post.status !== 'publicado' && (
                            <button
                              onClick={() => handleMarkPublished(post)}
                              className="text-emerald-400 hover:underline font-semibold"
                            >
                              Publicar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: Quintas-feiras (Carrosséis) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400">
                  <Layers className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white uppercase">Quintas-feiras · Carrosséis de Fotos</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                  {filteredPosts.filter((p) => p.contentType === 'carrossel').length}
                </span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredPosts
                  .filter((p) => p.contentType === 'carrossel')
                  .map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {post.scheduledDate.split('-').reverse().join('/')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          {post.slides?.length || 4} slides
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{post.theme}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {post.carouselCoverText || post.caption}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Resp: {post.responsible}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPostForCarousel(post)}
                            className="text-amber-400 hover:underline font-semibold"
                          >
                            Editor Slides
                          </button>
                          <button
                            onClick={() => setSelectedPostForDetail(post)}
                            className="text-slate-300 hover:underline"
                          >
                            Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: HIGH-DENSITY LIST */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Data / Dia</th>
                <th className="py-3 px-4 font-semibold">Formato</th>
                <th className="py-3 px-4 font-semibold">Tema Central</th>
                <th className="py-3 px-4 font-semibold">Pilar</th>
                <th className="py-3 px-4 font-semibold">Campanha</th>
                <th className="py-3 px-4 font-semibold">Responsável</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPosts.map((post) => {
                const isCarousel = post.contentType === 'carrossel';
                const isOverdue = post.scheduledDate < currentDateRef && post.status !== 'publicado';

                return (
                  <tr key={post.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">
                          {post.scheduledDate.split('-').reverse().join('/')}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded uppercase ${
                            post.dayOfWeek === 'segunda'
                              ? 'text-sky-400 bg-sky-950/60'
                              : post.dayOfWeek === 'quinta'
                              ? 'text-amber-400 bg-amber-950/60'
                              : 'text-slate-400 bg-slate-800'
                          }`}
                        >
                          {post.dayOfWeek}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                          isCarousel
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                        }`}
                      >
                        {isCarousel ? 'Carrossel' : 'Post'}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate font-medium text-white" title={post.theme}>
                      {post.theme}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {EDITORIAL_PILLARS.find((p) => p.id === post.pillar)?.name || post.pillar}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800 uppercase">
                        {post.campaignId}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {post.responsible}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          post.status === 'publicado'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isOverdue
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isOverdue ? 'Atrasado' : post.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isCarousel ? (
                          <button
                            onClick={() => setSelectedPostForCarousel(post)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 rounded"
                          >
                            Slides ({post.slides?.length || 4})
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedPostForDetail(post)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                          >
                            Editar
                          </button>
                        )}

                        {post.status !== 'publicado' && (
                          <button
                            onClick={() => handleMarkPublished(post)}
                            className="px-2 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 rounded"
                            title="Confirmar publicação veiculada"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
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
      )}

      {/* Modals */}
      {selectedPostForDetail && (
        <PostDetailModal
          post={selectedPostForDetail}
          onClose={() => setSelectedPostForDetail(null)}
          onOpenCarouselEditor={(p) => setSelectedPostForCarousel(p)}
        />
      )}

      {selectedPostForCarousel && (
        <CarouselBuilderModal
          post={selectedPostForCarousel}
          onClose={() => setSelectedPostForCarousel(null)}
        />
      )}
    </div>
  );
};
