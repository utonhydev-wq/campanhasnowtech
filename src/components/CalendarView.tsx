import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  Lock,
  Trash2,
  Edit2,
  CheckCircle2,
  ListFilter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { CalendarEvent, CampaignId } from '../types';

export const CalendarView: React.FC = () => {
  const { state, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useCampaigns();
  const { calendarEvents, campaigns, tasks } = state;

  // Selected Month (0 = Oct, 1 = Nov, 2 = Dec 2026)
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 9 = October in JS (0-indexed)
  const [calendarViewType, setCalendarViewType] = useState<'month' | 'list'>('month');
  const [showAddModal, setShowAddModal] = useState(false);

  // Reference Date: 2026-10-13
  const refDateStr = '2026-10-13';

  const [newEventForm, setNewEventForm] = useState<{
    title: string;
    date: string;
    campaignId: CampaignId | 'geral';
    type: CalendarEvent['type'];
    responsible: string;
    notes: string;
  }>({
    title: '',
    date: '2026-10-25',
    campaignId: 'pre-black',
    type: 'reuniao',
    responsible: 'Carlos Mendes',
    notes: '',
  });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim() || !newEventForm.date) return;

    await addCalendarEvent({
      ...newEventForm,
      isOfficial: false,
      status: 'pendente',
    });

    setShowAddModal(false);
    setNewEventForm({
      title: '',
      date: '2026-10-25',
      campaignId: 'pre-black',
      type: 'reuniao',
      responsible: 'Carlos Mendes',
      notes: '',
    });
  };

  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const handleDeleteEvent = async (event: CalendarEvent) => {
    if (event.isOfficial) {
      setSecurityWarning('Aviso de Segurança: Datas oficiais de campanhas não podem ser alteradas ou excluídas sem autorização formal da diretoria.');
      setTimeout(() => setSecurityWarning(null), 6000);
      return;
    }
    setEventToDelete(event);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete) {
      await deleteCalendarEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  // Helper for generating monthly grid
  const daysInMonth = new Date(2026, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(2026, selectedMonth, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Group events by date string "2026-MM-DD"
  const getEventsForDay = (day: number) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const fullDate = `2026-${monthStr}-${dayStr}`;

    return calendarEvents.filter((e) => e.date === fullDate);
  };

  // Check if a date falls inside the 3 official campaigns
  const getCampaignForDate = (dateStr: string) => {
    return campaigns.find((c) => dateStr >= c.startDate && dateStr <= c.endDate);
  };

  // Type styling
  const typeColors: Record<CalendarEvent['type'], string> = {
    lancamento: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    encerramento: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    gravacao: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    aprovacao: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    impressao: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    reuniao: 'bg-slate-800 text-slate-300 border-slate-700',
    acao_presencial: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    publicacao: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    marco: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            Calendário Integrado de Campanhas & Atividades
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Planejamento cronológico do Q4 2026. Datas oficiais protegidas e cadastro de marcos intermediários.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setCalendarViewType('month')}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                calendarViewType === 'month' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grade Mensal
            </button>
            <button
              onClick={() => setCalendarViewType('list')}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                calendarViewType === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lista de Marcos
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Marco</span>
          </button>
        </div>
      </div>

      {securityWarning && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{securityWarning}</span>
          </div>
          <button
            onClick={() => setSecurityWarning(null)}
            className="text-slate-400 hover:text-white text-xs px-2"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Official Campaigns Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className={`p-4 rounded-xl bg-slate-900 border ${
              camp.slug === 'pre-black'
                ? 'border-amber-500/30'
                : camp.slug === 'black-friday'
                ? 'border-emerald-500/30'
                : 'border-sky-500/30'
            } flex items-center justify-between`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Data Oficial Protegida
              </span>
              <h3 className="text-sm font-bold text-white">{camp.name}</h3>
              <p className="text-xs font-mono font-semibold text-amber-300">
                {camp.startDate} a {camp.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW: MONTHLY GRID */}
      {calendarViewType === 'month' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {/* Month Navigator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                {monthNames[selectedMonth]} de 2026
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                (Hoje no sistema: 13/10/2026)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={selectedMonth <= 9}
                onClick={() => setSelectedMonth(Math.max(9, selectedMonth - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={selectedMonth >= 11}
                onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                title="Próximo Mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold text-slate-400 pb-2">
            <div>DOM</div>
            <div>SEG</div>
            <div>TER</div>
            <div>QUA</div>
            <div>QUI</div>
            <div>SEX</div>
            <div>SÁB</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {blankDays.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[110px] rounded-lg bg-slate-950/40 border border-slate-800/40 p-2" />
            ))}

            {daysArray.map((day) => {
              const monthStr = String(selectedMonth + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const fullDate = `2026-${monthStr}-${dayStr}`;

              const isToday = fullDate === refDateStr;
              const activeCampaign = getCampaignForDate(fullDate);
              const dayEvents = getEventsForDay(day);

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[110px] rounded-lg border p-2 flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40'
                      : activeCampaign
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/70 border-slate-800/60'
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

                    {activeCampaign && (
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded truncate max-w-[60px] ${
                          activeCampaign.slug === 'pre-black'
                            ? 'bg-amber-500/20 text-amber-300'
                            : activeCampaign.slug === 'black-friday'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                        title={activeCampaign.name}
                      >
                        {activeCampaign.badge.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Day Events */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-[75px]">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => handleDeleteEvent(evt)}
                        title={`${evt.title} (${evt.responsible})`}
                        className={`text-[10px] p-1 rounded font-medium border truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                          typeColors[evt.type] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {evt.isOfficial && <Lock className="w-2.5 h-2.5 inline mr-1" />}
                        {evt.title}
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500 font-mono text-right">
                    {dayEvents.length > 0 ? `${dayEvents.length} marco(s)` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: TIMELINE LIST */}
      {calendarViewType === 'list' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Cronograma Completo de Marcos & Datas</h2>

          <div className="space-y-2.5">
            {calendarEvents
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0">
                      {evt.date.split('-').reverse().join('/')}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                        {evt.isOfficial && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Oficial
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase border ${
                            typeColors[evt.type]
                          }`}
                        >
                          {evt.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        {evt.notes || 'Sem observações adicionais.'} · <strong className="text-slate-300">Resp: {evt.responsible}</strong>
                      </p>
                    </div>
                  </div>

                  {!evt.isOfficial && (
                    <button
                      onClick={() => handleDeleteEvent(evt)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Excluir marco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              <span>Cadastrar Novo Marco Intermediário</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Título do Evento / Marco</label>
                <input
                  type="text"
                  placeholder="Ex: Reunião de Alinhamento com Gráfica..."
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Data (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tipo de Marco</label>
                  <select
                    value={newEventForm.type}
                    onChange={(e) => setNewEventForm({ ...newEventForm, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="reuniao">Reunião</option>
                    <option value="aprovacao">Aprovação</option>
                    <option value="gravacao">Gravação</option>
                    <option value="impressao">Impressão</option>
                    <option value="acao_presencial">Ação Presencial</option>
                    <option value="publicacao">Publicação</option>
                    <option value="marco">Marco Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Campanha Vinculada</label>
                  <select
                    value={newEventForm.campaignId}
                    onChange={(e) => setNewEventForm({ ...newEventForm, campaignId: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="pre-black">Pré-Black Friday</option>
                    <option value="black-friday">Black Friday Oficial</option>
                    <option value="natal">Campanha de Natal</option>
                    <option value="geral">Geral / Institucional</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Responsável</label>
                  <input
                    type="text"
                    value={newEventForm.responsible}
                    onChange={(e) => setNewEventForm({ ...newEventForm, responsible: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={newEventForm.notes}
                  onChange={(e) => setNewEventForm({ ...newEventForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  placeholder="Instruções ou pauta..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Salvar Marco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Event Dialog */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Remover Marco do Calendário</h3>
                <p className="text-xs text-slate-400">Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              Tem certeza que deseja remover o marco <strong className="text-white">"{eventToDelete.title}"</strong> agendado para <span className="font-mono text-amber-300">{eventToDelete.date}</span>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteEvent}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-medium shadow transition-colors"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
