import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Server,
  Smartphone,
  Laptop,
  Copy,
  Check,
} from 'lucide-react';
import { useCampaigns } from '../../context/CampaignContext';

interface CloudSyncModalProps {
  onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({ onClose }) => {
  const { syncStatus, exportDataJson, importDataJson, resetToDefaults } = useCampaigns();

  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nowtech-solar-campanhas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const jsonStr = exportDataJson();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importDataJson(content);
        if (res.success) {
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          setImportError(res.error || 'Erro ao importar arquivo');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImportText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const res = await importDataJson(importJsonText.trim());
    if (res.success) {
      setImportSuccess(true);
      setImportError(null);
      setImportJsonText('');
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError(res.error || 'Erro na validação do JSON');
    }
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await resetToDefaults();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Sincronização & Persistência Multi-Dispositivo</h2>
              <span className="text-[11px] font-mono text-slate-400">NowTech Solar · Nuvem & Backup</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            syncStatus.isServerConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}
        >
          <Server className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <span>Status: {syncStatus.isServerConnected ? 'Servidor & Nuvem Conectados' : 'Modo Local Ativo'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-300">
              {syncStatus.isServerConnected
                ? 'Todos os dispositivos conectados ao mesmo endereço compartilham e sincronizam os dados em tempo real através da API persistente.'
                : 'Os dados estão sendo salvos com segurança no armazenamento do navegador local.'}
            </p>
            {syncStatus.lastSynced && (
              <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                Última sincronização: {new Date(syncStatus.lastSynced).toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        {/* Multi-Device Architecture explanation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-sky-400" />
            <span>Compartilhamento entre Celulares e Computadores:</span>
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            O sistema opera com persistência híbrida em duas camadas: a API REST no backend grava o estado em disco compartilhado e o client-side sincroniza automaticamente via WebSocket/BroadcastChannel.
          </p>
        </div>

        {/* Backup Export / Import */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Backup & Exportação Completa
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={handleDownloadBackup}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Baixar Arquivo JSON</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2 font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
            </button>
          </div>

          <div className="pt-2">
            <label className="text-[11px] text-slate-400 block mb-1">Restaurar de arquivo (.json):</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
            />
          </div>

          {importSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Dados importados e sincronizados com sucesso!</span>
            </div>
          )}

          {importError && (
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{importError}</span>
            </div>
          )}
        </div>

        {/* Reset Danger Zone */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-rose-400 font-semibold block">Restaurar Dados de Fábrica</span>
            <span className="text-slate-500 text-[11px]">Voltar para os dados originais oficiais de 2026</span>
          </div>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirmar Redefinição</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
