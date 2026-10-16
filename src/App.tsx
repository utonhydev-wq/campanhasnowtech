/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampaignProvider, useCampaigns } from './context/CampaignContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CampaignDetails } from './components/CampaignDetails';
import { SolarKitsManager } from './components/SolarKitsManager';
import { TasksManager } from './components/TasksManager';
import { AwardsManager } from './components/AwardsManager';
import { CalendarView } from './components/CalendarView';
import { MetricsAnalytics } from './components/MetricsAnalytics';
import { EditorialCalendarManager } from './components/EditorialCalendar/EditorialCalendarManager';

// Modals
import { TaskModal } from './components/Modals/TaskModal';
import { KitPriceModal } from './components/Modals/KitPriceModal';
import { AwardModal } from './components/Modals/AwardModal';
import { AwardDeliveryModal } from './components/Modals/AwardDeliveryModal';
import { CloudSyncModal } from './components/Modals/CloudSyncModal';
import { InstallAppModal } from './components/Modals/InstallAppModal';
import { Task, SolarKit, Award, CampaignId } from './types';
import { Sun, HeartHandshake } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { setSelectedCampaignId, isLoading } = useCampaigns();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modal States
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<SolarKit | undefined>(undefined);

  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | undefined>(undefined);

  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryAwardId, setDeliveryAwardId] = useState<string>('award-ventilador');

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Modal Triggers
  const handleOpenNewTask = () => {
    setEditingTask(undefined);
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task?: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleOpenEditKit = (kit: SolarKit) => {
    setEditingKit(kit);
    setKitModalOpen(true);
  };

  const handleOpenEditAward = (award: Award) => {
    setEditingAward(award);
    setAwardModalOpen(true);
  };

  const handleOpenDelivery = (awardId: string) => {
    setDeliveryAwardId(awardId);
    setDeliveryModalOpen(true);
  };

  const handleSelectCampaignFromDashboard = (slug: CampaignId) => {
    setSelectedCampaignId(slug);
    setCurrentTab('campanhas');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-spin">
          <Sun className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-white tracking-wide">Carregando NowTech Solar...</h2>
          <p className="text-xs text-slate-500 font-mono">Sincronizando campanhas Q4 2026</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewTaskModal={handleOpenNewTask}
        onOpenSyncModal={() => setSyncModalOpen(true)}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigateTab={setCurrentTab}
            onSelectCampaign={handleSelectCampaignFromDashboard}
            onOpenKitModal={(kit) => {
              if (kit) handleOpenEditKit(kit);
              else setCurrentTab('kits');
            }}
            onOpenTaskModal={handleOpenEditTask}
          />
        )}

        {currentTab === 'campanhas' && (
          <CampaignDetails
            onOpenKitModal={handleOpenEditKit}
            onOpenTaskModal={handleOpenEditTask}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'editorial' && <EditorialCalendarManager />}

        {currentTab === 'kits' && (
          <SolarKitsManager onOpenEditKitModal={handleOpenEditKit} />
        )}

        {currentTab === 'tarefas' && (
          <TasksManager onOpenTaskModal={handleOpenEditTask} />
        )}

        {currentTab === 'premiacoes' && (
          <AwardsManager
            onOpenAwardModal={handleOpenEditAward}
            onOpenDeliveryModal={handleOpenDelivery}
          />
        )}

        {currentTab === 'calendario' && <CalendarView />}

        {currentTab === 'indicadores' && <MetricsAnalytics />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-xs text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">NowTech Solar</span>
            <span>·</span>
            <span>Sistema Integrado de Gestão de Campanhas (Outubro a Dezembro de 2026)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Pré-Black: 29/10 a 13/11</span>
            <span>·</span>
            <span>Black Oficial: 16/11 a 27/11</span>
            <span>·</span>
            <span>Natal: 10/12 a 30/12</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {taskModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(undefined);
          }}
        />
      )}

      {kitModalOpen && editingKit && (
        <KitPriceModal
          kit={editingKit}
          onClose={() => {
            setKitModalOpen(false);
            setEditingKit(undefined);
          }}
        />
      )}

      {awardModalOpen && editingAward && (
        <AwardModal
          award={editingAward}
          onClose={() => {
            setAwardModalOpen(false);
            setEditingAward(undefined);
          }}
        />
      )}

      {deliveryModalOpen && (
        <AwardDeliveryModal
          awardId={deliveryAwardId}
          onClose={() => setDeliveryModalOpen(false)}
        />
      )}

      {syncModalOpen && (
        <CloudSyncModal onClose={() => setSyncModalOpen(false)} />
      )}

      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CampaignProvider>
      <MainAppContent />
    </CampaignProvider>
  );
}
