import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckSquare, Calendar, User, DollarSign, Paperclip } from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';
import { Task, TaskPriority, TaskStatus, CampaignId, TaskChecklistItem, TaskFileLink } from '../../types';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { addTask, updateTask, state } = useCampaigns();
  const { teamMembers } = state;

  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [campaignId, setCampaignId] = useState<CampaignId | 'geral'>(task?.campaignId || 'pre-black');
  const [assignee, setAssignee] = useState(task?.assignee || teamMembers[0]?.name || 'Carlos Mendes');
  const [assigneeRole, setAssigneeRole] = useState(task?.assigneeRole || teamMembers[0]?.role || 'Gestor Comercial');
  const [startDate, setStartDate] = useState(task?.startDate || '2026-10-14');
  const [dueDate, setDueDate] = useState(task?.dueDate || '2026-10-28');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'alta');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'nao_iniciada');
  const [estimatedBudget, setEstimatedBudget] = useState<number>(task?.estimatedBudget || 0);
  const [actualBudget, setActualBudget] = useState<number>(task?.actualBudget || 0);
  const [notes, setNotes] = useState(task?.notes || '');
  const [category, setCategory] = useState<Task['category']>(task?.category || 'geral');

  // Checklist
  const [checklist, setChecklist] = useState<TaskChecklistItem[]>(task?.checklist || []);
  const [newChecklistText, setNewChecklistText] = useState('');

  // File Links
  const [fileLinks, setFileLinks] = useState<TaskFileLink[]>(task?.fileLinks || []);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');

  const handleAssigneeChange = (name: string) => {
    setAssignee(name);
    const member = teamMembers.find((m) => m.name === name);
    if (member) setAssigneeRole(member.role);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: `c-${Date.now()}`,
        text: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklist(checklist.filter((c) => c.id !== id));
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !newFileUrl.trim()) return;
    setFileLinks([
      ...fileLinks,
      {
        name: newFileName.trim(),
        url: newFileUrl.trim(),
        type: 'drive',
      },
    ]);
    setNewFileName('');
    setNewFileUrl('');
  };

  const handleRemoveFile = (index: number) => {
    setFileLinks(fileLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && task) {
      await updateTask({
        ...task,
        title,
        description,
        campaignId,
        assignee,
        assigneeRole,
        startDate,
        dueDate,
        priority,
        status,
        estimatedBudget,
        actualBudget,
        checklist,
        notes,
        fileLinks,
        category,
      });
    } else {
      await addTask({
        title,
        description,
        campaignId,
        assignee,
        assigneeRole,
        startDate,
        dueDate,
        priority,
        status,
        estimatedBudget,
        actualBudget,
        checklist,
        notes,
        fileLinks,
        category,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              {isEditing ? 'Editar Tarefa Operacional' : 'Cadastrar Nova Tarefa'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Título da Atividade *</label>
            <input
              type="text"
              placeholder="Ex: Impressão dos Panfletos da Black Friday..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Descrição Detalhada</label>
            <textarea
              rows={2}
              placeholder="Instruções de execução, objetivos e orientações..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Campanha Vinculada</label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="pre-black">Pré-Black Friday Solar</option>
                <option value="black-friday">Black Friday Oficial</option>
                <option value="natal">Campanha de Natal</option>
                <option value="geral">Geral / Institucional</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="panfleto">Panfleto / Material Gráfico</option>
                <option value="influenciador">Ação com Influenciador</option>
                <option value="video_trafego">Vídeo & Tráfego Pago</option>
                <option value="acao_loja">Ação em Loja / Showroom</option>
                <option value="acao_rua">Ação na Rua / Blitz</option>
                <option value="social_media">Redes Sociais</option>
                <option value="aprovacao_comercial">Aprovação Comercial</option>
                <option value="premiacao">Controle de Premiação</option>
                <option value="geral">Geral</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Responsável</label>
              <select
                value={assignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Data Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Prazo de Entrega</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Status Atual</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="nao_iniciada">Não iniciada</option>
                <option value="em_andamento">Em andamento</option>
                <option value="aguardando_aprovacao">Aguardando aprovação</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Orçamento Previsto (R$)</label>
              <input
                type="number"
                step="0.01"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Orçamento Realizado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={actualBudget}
                onChange={(e) => setActualBudget(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          {/* Checklist Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-300 block">Itens de Checklist ({checklist.length})</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar novo item de checklist..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80"
                >
                  <span className="text-slate-300">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              placeholder="Notas internas..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              {isEditing ? 'Salvar Tarefa' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
