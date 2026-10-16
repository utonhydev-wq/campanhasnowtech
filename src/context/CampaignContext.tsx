import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  StoreState,
  Campaign,
  SolarKit,
  Task,
  Award,
  AwardDelivery,
  ChristmasPamphlet,
  BalloonAction,
  ChristmasVideoWorkflow,
  CampaignMetrics,
  CalendarEvent,
  TeamMember,
  CampaignId,
  EditorialPost,
  EditorialStatus,
  CarouselSlide,
} from '../types';
import { initialStoreState } from '../data/initialData';
import { storageService } from '../services/storageService';
import { generateEditorialSchedule } from '../services/editorialService';

interface CampaignContextType {
  state: StoreState;
  isLoading: boolean;
  selectedCampaignId: CampaignId | 'all';
  setSelectedCampaignId: (id: CampaignId | 'all') => void;
  syncStatus: { isServerConnected: boolean; lastSynced: string | null };

  // Kits actions
  updateSolarKit: (kit: SolarKit) => Promise<void>;
  updateMultipleKits: (kits: SolarKit[]) => Promise<void>;

  // Tasks actions
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskChecklist: (taskId: string, checklistId: string) => Promise<void>;

  // Awards actions
  updateAward: (award: Award) => Promise<void>;
  addAwardDelivery: (awardId: string, delivery: Omit<AwardDelivery, 'id'>) => Promise<void>;

  // Christmas actions
  updateChristmasPamphlet: (pamphlet: Partial<ChristmasPamphlet>) => Promise<void>;
  updateBalloonAction: (action: Partial<BalloonAction>) => Promise<void>;
  updateChristmasVideoWorkflow: (workflow: Partial<ChristmasVideoWorkflow>) => Promise<void>;
  advanceVideoStep: (stepNumber: number, deliverableUrl?: string, notes?: string) => Promise<void>;

  // Metrics actions
  updateMetrics: (metric: CampaignMetrics) => Promise<void>;

  // Calendar actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateCalendarEvent: (event: CalendarEvent) => Promise<void>;
  deleteCalendarEvent: (eventId: string) => Promise<void>;

  // Editorial Calendar actions
  addEditorialPost: (post: Omit<EditorialPost, 'id'>) => Promise<void>;
  updateEditorialPost: (post: EditorialPost) => Promise<void>;
  deleteEditorialPost: (postId: string) => Promise<void>;
  generateAutoEditorialSchedule: (startDate?: string, endDate?: string) => Promise<void>;
  changeEditorialStatus: (postId: string, status: EditorialStatus, notes?: string) => Promise<void>;
  approveEditorialPost: (postId: string, approvedBy: string) => Promise<void>;
  reorderCarouselSlides: (postId: string, slides: CarouselSlide[]) => Promise<void>;

  // Data management
  resetToDefaults: () => Promise<void>;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => Promise<{ success: boolean; error?: string }>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(initialStoreState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<CampaignId | 'all'>('all');
  const [syncStatus, setSyncStatus] = useState<{ isServerConnected: boolean; lastSynced: string | null }>({
    isServerConnected: true,
    lastSynced: null,
  });

  // Load store on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const loaded = await storageService.loadStore();
        if (mounted) {
          setState(loaded);
          setSyncStatus(storageService.getSyncStatus());
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading initial store:', err);
        if (mounted) setIsLoading(false);
      }
    };

    init();

    // Listen to changes from other tabs or server sync
    const unsubscribe = storageService.subscribe((updated) => {
      if (mounted) {
        setState(updated);
        setSyncStatus(storageService.getSyncStatus());
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const saveAndSetState = useCallback(async (updater: (prev: StoreState) => StoreState) => {
    setState((prev) => {
      const next = updater(prev);
      storageService.saveStore(next).then(() => {
        setSyncStatus(storageService.getSyncStatus());
      });
      return next;
    });
  }, []);

  // Kit Actions
  const updateSolarKit = useCallback(async (kit: SolarKit) => {
    await saveAndSetState((prev) => ({
      ...prev,
      solarKits: prev.solarKits.map((k) => (k.id === kit.id ? kit : k)),
    }));
  }, [saveAndSetState]);

  const updateMultipleKits = useCallback(async (kits: SolarKit[]) => {
    const kitMap = new Map(kits.map((k) => [k.id, k]));
    await saveAndSetState((prev) => ({
      ...prev,
      solarKits: prev.solarKits.map((k) => (kitMap.has(k.id) ? kitMap.get(k.id)! : k)),
    }));
  }, [saveAndSetState]);

  // Tasks Actions
  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    await saveAndSetState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  }, [saveAndSetState]);

  const updateTask = useCallback(async (task: Task) => {
    await saveAndSetState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  }, [saveAndSetState]);

  const deleteTask = useCallback(async (taskId: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  }, [saveAndSetState]);

  const toggleTaskChecklist = useCallback(async (taskId: string, checklistId: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((item) =>
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        );
        return { ...t, checklist: updatedChecklist };
      }),
    }));
  }, [saveAndSetState]);

  // Awards Actions
  const updateAward = useCallback(async (award: Award) => {
    await saveAndSetState((prev) => ({
      ...prev,
      awards: prev.awards.map((a) => (a.id === award.id ? award : a)),
    }));
  }, [saveAndSetState]);

  const addAwardDelivery = useCallback(async (awardId: string, deliveryData: Omit<AwardDelivery, 'id'>) => {
    const newDelivery: AwardDelivery = {
      ...deliveryData,
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    await saveAndSetState((prev) => ({
      ...prev,
      awards: prev.awards.map((a) => {
        if (a.id !== awardId) return a;
        const newDelivered = a.stockDelivered + 1;
        const newStock = Math.max(0, a.quantityAvailable - newDelivered);
        return {
          ...a,
          stockCurrent: newStock,
          stockDelivered: newDelivered,
          deliveries: [newDelivery, ...a.deliveries],
        };
      }),
    }));
  }, [saveAndSetState]);

  // Christmas Actions
  const updateChristmasPamphlet = useCallback(async (pamphletData: Partial<ChristmasPamphlet>) => {
    await saveAndSetState((prev) => ({
      ...prev,
      christmasPamphlet: { ...prev.christmasPamphlet, ...pamphletData },
    }));
  }, [saveAndSetState]);

  const updateBalloonAction = useCallback(async (actionData: Partial<BalloonAction>) => {
    await saveAndSetState((prev) => ({
      ...prev,
      balloonAction: { ...prev.balloonAction, ...actionData },
    }));
  }, [saveAndSetState]);

  const updateChristmasVideoWorkflow = useCallback(async (workflowData: Partial<ChristmasVideoWorkflow>) => {
    await saveAndSetState((prev) => ({
      ...prev,
      christmasVideoWorkflow: { ...prev.christmasVideoWorkflow, ...workflowData },
    }));
  }, [saveAndSetState]);

  const advanceVideoStep = useCallback(async (stepNumber: number, deliverableUrl?: string, notes?: string) => {
    await saveAndSetState((prev) => {
      const current = prev.christmasVideoWorkflow;
      const updatedSteps = current.steps.map((st) => {
        if (st.step === stepNumber) {
          return {
            ...st,
            status: 'concluido' as const,
            deliverableUrl: deliverableUrl || st.deliverableUrl,
            notes: notes ? `${st.notes ? st.notes + ' | ' : ''}${notes}` : st.notes,
          };
        }
        if (st.step === stepNumber + 1) {
          return { ...st, status: 'em_andamento' as const };
        }
        return st;
      });
      return {
        ...prev,
        christmasVideoWorkflow: {
          ...current,
          currentStep: Math.min(9, stepNumber + 1),
          steps: updatedSteps,
        },
      };
    });
  }, [saveAndSetState]);

  // Metrics Actions
  const updateMetrics = useCallback(async (metric: CampaignMetrics) => {
    await saveAndSetState((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m) => (m.campaignId === metric.campaignId ? metric : m)),
    }));
  }, [saveAndSetState]);

  // Calendar Actions
  const addCalendarEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    await saveAndSetState((prev) => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, newEvent],
    }));
  }, [saveAndSetState]);

  const updateCalendarEvent = useCallback(async (event: CalendarEvent) => {
    await saveAndSetState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map((e) => (e.id === event.id ? event : e)),
    }));
  }, [saveAndSetState]);

  const deleteCalendarEvent = useCallback(async (eventId: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e) => e.id !== eventId),
    }));
  }, [saveAndSetState]);

  // Editorial Posts Actions
  const addEditorialPost = useCallback(async (postData: Omit<EditorialPost, 'id'>) => {
    const newPost: EditorialPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: [...(prev.editorialPosts || []), newPost].sort((a, b) =>
        a.scheduledDate.localeCompare(b.scheduledDate)
      ),
    }));
  }, [saveAndSetState]);

  const updateEditorialPost = useCallback(async (post: EditorialPost) => {
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: (prev.editorialPosts || []).map((p) => (p.id === post.id ? post : p)),
    }));
  }, [saveAndSetState]);

  const deleteEditorialPost = useCallback(async (postId: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: (prev.editorialPosts || []).filter((p) => p.id !== postId),
    }));
  }, [saveAndSetState]);

  const generateAutoEditorialSchedule = useCallback(async (startDate: string = '2026-10-01', endDate: string = '2026-12-31') => {
    await saveAndSetState((prev) => {
      const existing = prev.editorialPosts || [];
      const updated = generateEditorialSchedule(startDate, endDate, existing);
      return {
        ...prev,
        editorialPosts: updated,
      };
    });
  }, [saveAndSetState]);

  const changeEditorialStatus = useCallback(async (postId: string, status: EditorialStatus, notes?: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: (prev.editorialPosts || []).map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          status,
          notes: notes ? (p.notes ? `${p.notes} | ${notes}` : notes) : p.notes,
        };
      }),
    }));
  }, [saveAndSetState]);

  const approveEditorialPost = useCallback(async (postId: string, approvedBy: string) => {
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: (prev.editorialPosts || []).map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          approvalStatus: 'aprovado',
          approvedBy,
          approvedAt: new Date().toISOString(),
          status: p.status === 'aguardando_aprovacao' || p.status === 'ideia' || p.status === 'em_revisao'
            ? 'aprovado'
            : p.status,
        };
      }),
    }));
  }, [saveAndSetState]);

  const reorderCarouselSlides = useCallback(async (postId: string, slides: CarouselSlide[]) => {
    await saveAndSetState((prev) => ({
      ...prev,
      editorialPosts: (prev.editorialPosts || []).map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          slides,
        };
      }),
    }));
  }, [saveAndSetState]);

  // Reset and JSON export/import
  const resetToDefaults = useCallback(async () => {
    const reset = await storageService.resetToDefaults();
    setState(reset);
    setSyncStatus(storageService.getSyncStatus());
  }, []);

  const exportDataJson = useCallback(() => {
    return storageService.exportDataJson(state);
  }, [state]);

  const importDataJson = useCallback(async (jsonStr: string) => {
    try {
      const imported = storageService.importDataJson(jsonStr);
      await storageService.saveStore(imported);
      setState(imported);
      setSyncStatus(storageService.getSyncStatus());
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Falha ao importar arquivo JSON',
      };
    }
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        state,
        isLoading,
        selectedCampaignId,
        setSelectedCampaignId,
        syncStatus,
        updateSolarKit,
        updateMultipleKits,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskChecklist,
        updateAward,
        addAwardDelivery,
        updateChristmasPamphlet,
        updateBalloonAction,
        updateChristmasVideoWorkflow,
        advanceVideoStep,
        updateMetrics,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        addEditorialPost,
        updateEditorialPost,
        deleteEditorialPost,
        generateAutoEditorialSchedule,
        changeEditorialStatus,
        approveEditorialPost,
        reorderCarouselSlides,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
