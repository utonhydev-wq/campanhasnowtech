export type CampaignId = 'pre-black' | 'black-friday' | 'natal';

export type TaskStatus =
  | 'nao_iniciada'
  | 'em_andamento'
  | 'aguardando_aprovacao'
  | 'concluida'
  | 'cancelada';

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'critica';

export interface Campaign {
  id: string;
  name: string;
  slug: CampaignId;
  officialCall: string;
  badge: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  accentColor: string;
  kitsList: string[];
}

export interface SolarKit {
  id: string;
  campaignId: CampaignId;
  name: string; // e.g., "Kit 550", "Kit 750", "Kit 1.000", etc.
  originalPrice: number | null; // null represents "A definir"
  promotionalPrice: number | null; // null represents "A definir"
  discountReais: number | null;
  discountPercent: number | null;
  paymentConditions: string; // "A definir" initially
  offerValidity: string; // "A definir" or specific date
  approvalStatus: 'pendente' | 'aprovado' | 'em_revisao' | 'a_definir';
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string;
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskFileLink {
  name: string;
  url: string;
  type: 'drive' | 'figma' | 'canva' | 'doc' | 'video' | 'other';
}

export interface Task {
  id: string;
  campaignId: CampaignId | 'geral';
  title: string;
  description: string;
  assignee: string;
  assigneeRole: string;
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedBudget: number;
  actualBudget: number;
  checklist: TaskChecklistItem[];
  notes: string;
  fileLinks: TaskFileLink[];
  category:
    | 'panfleto'
    | 'influenciador'
    | 'video_trafego'
    | 'acao_loja'
    | 'acao_rua'
    | 'social_media'
    | 'aprovacao_comercial'
    | 'premiacao'
    | 'geral';
}

export interface AwardDelivery {
  id: string;
  customerName: string;
  contractNumber: string;
  kitPurchased: string;
  deliveryDate: string;
  deliveredBy: string;
  status: 'entregue' | 'pendente';
}

export interface Award {
  id: string;
  name: string; // "Ventilador", "Air fryer", "Ar-condicionado"
  description: string;
  category: string;
  quantityAvailable: number;
  stockCurrent: number;
  stockDelivered: number;
  unitCost: number | null; // null represents "A definir"
  eligibilityCriteria: string; // "A definir pela gestão"
  promotionRules: string; // "A definir e aprovar pela gestão"
  rulesApproved: boolean;
  responsible: string;
  deliveryStatus:
    | 'planejado'
    | 'em_aquisicao'
    | 'em_estoque'
    | 'distribuicao_ativa'
    | 'concluido';
  deliveries: AwardDelivery[];
}

export interface ChristmasPamphlet {
  id: string;
  materialName: string;
  promotionalText: string;
  participatingKits: string;
  pricesAndConditions: string;
  responsibleCreation: string;
  deadlineDelivery: string;
  reviewStatus: 'em_elaboracao' | 'em_revisao' | 'aprovado' | 'rejeitado';
  finalFileLink: string;
  printStatus: 'nao_iniciado' | 'em_orcamento' | 'em_impressao' | 'impresso';
  distributionStatus:
    | 'nao_iniciado'
    | 'planejada'
    | 'em_distribuicao'
    | 'concluida';
  quantityOrdered: number;
  notes: string;
}

export interface BalloonPrize {
  id: string;
  name: string;
  quantityAvailable: number;
  quantityAwarded: number;
}

export interface BalloonActionLog {
  id: string;
  date: string;
  action: string;
  doneBy: string;
}

export interface BalloonAction {
  id: string;
  description: string;
  location: string;
  dateTime: string;
  responsible: string;
  balloonQuantity: number;
  prizes: BalloonPrize[];
  participationRules: string;
  rulesApproved: boolean;
  requiredMaterials: string[];
  estimatedBudget: number;
  actualBudget: number;
  executionStatus:
    | 'planejamento'
    | 'preparativos'
    | 'regras_aprovadas'
    | 'em_andamento'
    | 'concluida';
  preparationsLog: BalloonActionLog[];
  finalResults: {
    participantsCount: number;
    balloonsPopped: number;
    leadsGenerated: number;
    contractsClosed: number;
    notes: string;
  } | null;
}

export interface VideoProductionStep {
  step: number;
  title: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  responsible: string;
  dueDate: string;
  notes: string;
  deliverableUrl?: string;
}

export interface ChristmasVideoWorkflow {
  id: string;
  currentStep: number;
  steps: VideoProductionStep[];
  mediaBudget: number;
  platforms: string[];
  airingPeriod: {
    start: string;
    end: string;
  };
  responsible: string;
  finalVideoUrl: string;
}

export interface ChannelPerformance {
  channel: string;
  investment: number;
  reach: number;
  leads: number;
  contacts: number;
  sales: number;
  revenue: number;
}

export interface CampaignMetrics {
  campaignId: CampaignId;
  paidTrafficInvestment: number;
  reach: number;
  views: number;
  leads: number;
  commercialContacts: number;
  salesClosed: number;
  revenue: number;
  channelBreakdown: ChannelPerformance[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  campaignId: CampaignId | 'geral';
  type:
    | 'lancamento'
    | 'encerramento'
    | 'gravacao'
    | 'aprovacao'
    | 'impressao'
    | 'reuniao'
    | 'acao_presencial'
    | 'publicacao'
    | 'marco';
  responsible: string;
  isOfficial: boolean; // Protect official campaign dates from tampering
  status: 'pendente' | 'em_andamento' | 'concluido' | 'atrasado';
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Marketing' | 'Comercial' | 'Diretoria' | 'Operações';
  email: string;
  phone: string;
  avatarColor: string;
}

export type EditorialContentType = 'post' | 'carrossel';
export type EditorialDayOfWeek = 'segunda' | 'quinta' | 'outro';

export type EditorialPillar =
  | 'educacao_solar'
  | 'produtos_kits'
  | 'vendas_ofertas'
  | 'autoridade_confianca'
  | 'interacao'
  | 'prova_social'
  | 'datas_comemorativas'
  | 'conversao';

export type EditorialStatus =
  | 'ideia'
  | 'em_producao'
  | 'em_revisao'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'agendado'
  | 'publicado'
  | 'cancelado';

export type EditorialSocialNetwork = 'instagram' | 'facebook' | 'ambos' | 'linkedin';

export interface CarouselSlide {
  id: string;
  slideNumber: number;
  title: string;
  content: string;
  notes?: string;
  imageUrl?: string;
}

export interface EditorialPostResults {
  reach: number;
  interactions: number;
  clicks: number;
  leads: number;
}

export interface EditorialPost {
  id: string;
  scheduledDate: string; // YYYY-MM-DD
  dayOfWeek: EditorialDayOfWeek;
  contentType: EditorialContentType;
  theme: string;
  objective: string;
  campaignId: CampaignId | 'institucional';
  pillar: EditorialPillar;
  socialNetwork: EditorialSocialNetwork;
  caption: string;
  callToAction: string;
  hashtags: string;
  imageFiles: string[];
  responsible: string;
  responsibleRole?: string;
  dueDate: string;
  approvalStatus: 'pendente' | 'em_revisao' | 'aprovado' | 'rejeitado';
  approvedBy?: string | null;
  approvedAt?: string | null;
  status: EditorialStatus;
  publishedLink?: string;
  notes?: string;
  isManualException: boolean;
  exceptionJustification?: string;
  // Specific to Carousel (Thursday)
  carouselTitle?: string;
  carouselCoverText?: string;
  carouselClosingText?: string;
  slides?: CarouselSlide[];
  // Performance
  results?: EditorialPostResults;
}

export interface StoreState {
  version: number;
  lastUpdated: string;
  campaigns: Campaign[];
  solarKits: SolarKit[];
  tasks: Task[];
  awards: Award[];
  christmasPamphlet: ChristmasPamphlet;
  balloonAction: BalloonAction;
  christmasVideoWorkflow: ChristmasVideoWorkflow;
  metrics: CampaignMetrics[];
  calendarEvents: CalendarEvent[];
  teamMembers: TeamMember[];
  editorialPosts: EditorialPost[];
}

