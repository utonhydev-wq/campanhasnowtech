import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  DollarSign,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Layers,
  ChevronDown,
  Columns,
  List,
} from 'lucide-react';
import { useCampaigns } from '../context/CampaignContext';
import { Task, TaskStatus, TaskPriority, CampaignId } from '../types';

interface TasksManagerProps {
  onOpenTaskModal: (task?: Task) => void;
}

export const TasksManager: React.FC<TasksManagerProps> = ({ onOpenTaskModal }) => {
  const { state, updateTask, deleteTask, toggleTaskChecklist } = useCampaigns();
  const { tasks, campaigns, teamMembers } = state;

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filterCampaign !== 'all' && t.campaignId !== filterCampaign) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchAssignee = t.assignee.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = (taskId: string, title: string) => {
    setTaskToDelete({ id: taskId, title });
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await updateTask({
      ...task,
      status: newStatus,
    });
  };

  // Status mapping
  const statusLabels: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    nao_iniciada: { label: 'Não iniciada', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' },
    em_andamento: { label: 'Em andamento', color: 'text-sky-300', bg: 'bg-sky-500/20 border-sky-500/30' },
    aguardando_aprovacao: { label: 'Aguardando aprovação', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/30' },
    concluida: { label: 'Concluída', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/30' },
    cancelada: { label: 'Cancelada', color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/30' },
  };

  const priorityLabels: Record<TaskPriority, { label: string; badge: string }> = {
    baixa: { label: 'Baixa', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    media: { label: 'Média', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    alta: { label: 'Alta', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    critica: { label: 'Crítica', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  };

  const kanbanColumns: TaskStatus[] = [
    'nao_iniciada',
    'em_andamento',
    'aguardando_aprovacao',
    'concluida',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            Controle de Tarefas & Responsáveis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Planejamento operacional, orçamentos, checklists e aprovações para todas as equipes da NowTech Solar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'kanban'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Quadro Kanban"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <button
            onClick={() => onOpenTaskModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tarefas por título, descrição ou responsável..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Clear */}
          {(searchQuery || filterCampaign !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCampaign('all');
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterAssignee('all');
              }}
              className="text-xs text-amber-400 hover:underline shrink-0"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Campanha:</label>
            <select
              value={filterCampaign}
              onChange={(e) => setFilterCampaign(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas as Campanhas</option>
              <option value="pre-black">Pré-Black Friday</option>
              <option value="black-friday">Black Friday Oficial</option>
              <option value="natal">Campanha de Natal</option>
              <option value="geral">Geral / Institucional</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos os Status</option>
              <option value="nao_iniciada">Não iniciada</option>
              <option value="em_andamento">Em andamento</option>
              <option value="aguardando_aprovacao">Aguardando aprovação</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Prioridade:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Responsável:</label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos os Responsáveis</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: LIST MODE */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 text-slate-400">
              <CheckSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">Nenhuma tarefa encontrada com estes filtros.</p>
              <button
                onClick={() => onOpenTaskModal()}
                className="mt-3 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 rounded-lg"
              >
                Cadastrar Nova Tarefa
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const statusCfg = statusLabels[task.status];
              const priorityCfg = priorityLabels[task.priority];
              const completedCount = task.checklist.filter((c) => c.completed).length;
              const totalChecklist = task.checklist.length;
              const checklistPct = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

              return (
                <div
                  key={task.id}
                  className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${priorityCfg.badge}`}>
                          {priorityCfg.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                          {task.campaignId}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    {/* Actions and Status Select */}
                    <div className="flex items-center gap-2 self-start shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                        className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="nao_iniciada">Não iniciada</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="aguardando_aprovacao">Aguardando aprovação</option>
                        <option value="concluida">Concluída</option>
                        <option value="cancelada">Cancelada</option>
                      </select>

                      <button
                        onClick={() => onOpenTaskModal(task)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Editar tarefa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{task.assignee}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-300">{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-400">
                        {task.estimatedBudget > 0 ? `R$ ${task.estimatedBudget.toLocaleString('pt-BR')}` : 'R$ 0,00'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span>{task.fileLinks.length} links / anexos</span>
                    </div>
                  </div>

                  {/* Checklist Section */}
                  {totalChecklist > 0 && (
                    <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">
                          Checklist de Produção ({completedCount} de {totalChecklist} passos)
                        </span>
                        <span className="font-mono text-amber-400 font-bold">{checklistPct}%</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {task.checklist.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-900 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleTaskChecklist(task.id, item.id)}
                              className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500"
                            />
                            <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-300'}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links / Files */}
                  {task.fileLinks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-500 text-[11px]">Arquivos:</span>
                      {task.fileLinks.map((f, i) => (
                        <a
                          key={i}
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-sky-400 rounded border border-slate-800 flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{f.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW: KANBAN MODE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((colStatus) => {
            const colCfg = statusLabels[colStatus];
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);

            return (
              <div key={colStatus} className="rounded-xl bg-slate-950 border border-slate-800 flex flex-col h-[750px]">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colCfg.color.replace('text-', 'bg-')}`} />
                    <span className="text-xs font-bold text-white uppercase">{colCfg.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {colTasks.length}
                  </span>
                </div>

                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500">
                      Nenhuma tarefa nesta coluna
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onOpenTaskModal(task)}
                        className="cursor-pointer p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="px-1.5 py-0.2 bg-slate-950 rounded uppercase">
                            {task.campaignId}
                          </span>
                          <span className="text-amber-300">{task.dueDate}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                          <span className="truncate max-w-[120px]">{task.assignee}</span>
                          <span className="font-mono text-emerald-400">
                            {task.estimatedBudget > 0 ? `R$ ${task.estimatedBudget}` : '—'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Excluir Tarefa</h3>
                <p className="text-xs text-slate-400">Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              Tem certeza que deseja remover permanentemente a tarefa <strong className="text-white">"{taskToDelete.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-medium shadow transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
