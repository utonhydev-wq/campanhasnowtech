import {
  EditorialPost,
  EditorialContentType,
  EditorialDayOfWeek,
  EditorialPillar,
  EditorialStatus,
  CampaignId,
  CarouselSlide,
} from '../types';

export interface EditorialPillarInfo {
  id: EditorialPillar;
  name: string;
  description: string;
  color: string;
}

export const EDITORIAL_PILLARS: EditorialPillarInfo[] = [
  {
    id: 'educacao_solar',
    name: 'Educação Solar',
    description: 'Explicações didáticas sobre energia fotovoltaica, economia e sustentabilidade.',
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'produtos_kits',
    name: 'Produtos e Kits',
    description: 'Apresentação detalhada dos kits solares homologados e equipamentos.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'vendas_ofertas',
    name: 'Vendas e Ofertas',
    description: 'Divulgação oficial das condições comerciais e promoções aprovadas.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'autoridade_confianca',
    name: 'Autoridade e Confiança',
    description: 'Engenharia, certificações, bastidores da equipe e garantia NowTech.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'interacao',
    name: 'Interação e Dúvidas',
    description: 'Enquetes, caixas de perguntas e respostas às principais dúvidas do público.',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  },
  {
    id: 'prova_social',
    name: 'Prova Social',
    description: 'Projetos instalados, depoimentos de clientes e contas de luz zeradas.',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  },
  {
    id: 'datas_comemorativas',
    name: 'Datas Comemorativas',
    description: 'Feriados, datas sazonais e ganchos temáticos alinhados à marca.',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'conversao',
    name: 'Conversão Direta',
    description: 'Chamadas comerciais diretas para WhatsApp e simulação de economia.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
];

// Helper to determine active campaign by date
export function getCampaignForDate(dateStr: string): CampaignId | 'institucional' {
  if (dateStr >= '2026-10-29' && dateStr <= '2026-11-13') {
    return 'pre-black';
  }
  if (dateStr >= '2026-11-16' && dateStr <= '2026-11-27') {
    return 'black-friday';
  }
  if (dateStr >= '2026-12-10' && dateStr <= '2026-12-30') {
    return 'natal';
  }
  return 'institucional';
}

// Generate automatic schedule between start and end date for Mondays and Thursdays
export function generateEditorialSchedule(
  startDateStr: string = '2026-10-01',
  endDateStr: string = '2026-12-31',
  existingPosts: EditorialPost[] = []
): EditorialPost[] {
  const existingDatesSet = new Set(existingPosts.map((p) => p.scheduledDate));
  const newPosts: EditorialPost[] = [];

  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');

  let current = new Date(start);
  let iteration = 0;

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 = Sun, 1 = Mon, 4 = Thu
    const dateStr = current.toISOString().split('T')[0];

    // Check if it's Monday (1) or Thursday (4)
    if ((dayOfWeek === 1 || dayOfWeek === 4) && !existingDatesSet.has(dateStr)) {
      const isMonday = dayOfWeek === 1;
      const contentType: EditorialContentType = isMonday ? 'post' : 'carrossel';
      const dayType: EditorialDayOfWeek = isMonday ? 'segunda' : 'quinta';
      const campaign = getCampaignForDate(dateStr);

      const post = createPostTemplate(dateStr, dayType, contentType, campaign, iteration);
      newPosts.push(post);
      iteration++;
    }

    // Advance 1 day
    current.setDate(current.getDate() + 1);
  }

  return [...existingPosts, ...newPosts].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate)
  );
}

function createPostTemplate(
  dateStr: string,
  dayOfWeek: EditorialDayOfWeek,
  contentType: EditorialContentType,
  campaign: CampaignId | 'institucional',
  index: number
): EditorialPost {
  const isPost = contentType === 'post';

  let pillar: EditorialPillar = 'educacao_solar';
  let theme = '';
  let objective = '';
  let caption = '';
  let callToAction = 'Clique no link da bio e solicite uma simulação gratuita no WhatsApp da NowTech Solar!';
  let hashtags = '#NowTechSolar #EnergiaSolar #Sustentabilidade #EconomiaNaConta #EnergiaLimpa';
  let slides: CarouselSlide[] | undefined = undefined;
  let carouselTitle = '';
  let carouselCoverText = '';
  let carouselClosingText = '';

  // Contextual templates according to Campaign & Date
  if (campaign === 'pre-black') {
    if (isPost) {
      pillar = 'vendas_ofertas';
      theme = 'Aquecimento Oficial: Pré-Black Friday Solar NowTech';
      objective = 'Gerar expectativa antecipada para o maior aquecimento do ano e atrair contatos.';
      caption = `A Black Friday Solar está chegando: começa o maior aquecimento do ano na NowTech Solar!\n\nSe você quer iniciar 2027 sem se preocupar com as bandeiras tarifárias e o calor do verão, os preparativos para o Lançamento Pré-Black já começaram. Fique de olho nos nossos canais para conferir as condições exclusivas dos kits participantes!\n\nEnvie uma mensagem e receba a lista prioritária!`;
      callToAction = 'Comente "AQUECIMENTO" ou fale conosco pelo link da bio para entrar na lista exclusiva!';
      hashtags = '#PreBlackSolar #NowTechSolar #AquecimentoBlackFriday #EnergiaSolar #BlackFridaySolar2026';
    } else {
      pillar = 'produtos_kits';
      theme = 'Kits Participantes da Pré-Black: 550, 750, 1.000, 1.500 e 2.000';
      objective = 'Apresentar didaticamente a escala de kits participantes e orientar para cada perfil de consumo.';
      carouselTitle = 'Guia dos Kits Participantes da Pré-Black Friday Solar';
      carouselCoverText = 'Qual kit solar da Pré-Black Friday é ideal para o seu imóvel? Arraste para o lado 👉';
      carouselClosingText = 'Os preços e condições promocionais serão liberados oficialmente no dia 29/10/2026!';
      slides = [
        {
          id: 's1',
          slideNumber: 1,
          title: 'Capa: Aquecimento Pré-Black Solar',
          content: 'Chegou o momento de planejar sua independência energética antes do pico de verão.',
        },
        {
          id: 's2',
          slideNumber: 2,
          title: 'Kit 550 & Kit 750',
          content: 'Projetados para residências com consumo moderado e foco em iluminação e eletrodomésticos essenciais.',
        },
        {
          id: 's3',
          slideNumber: 3,
          title: 'Kit 1.000 & Kit 1.500',
          content: 'Ideal para famílias que utilizam ar-condicionado com frequência e desejam zerar até 95% da conta.',
        },
        {
          id: 's4',
          slideNumber: 4,
          title: 'Kit 2.000 Comercial / Alto Padrão',
          content: 'Potência máxima para residências amplas e pequenos comércios manterem a operação sem custos extras.',
        },
        {
          id: 's5',
          slideNumber: 5,
          title: 'Encerramento: Não Perca o Lançamento',
          content: 'Valores promocionais serão revelados com aprovação formal. Fale com nossa equipe comercial!',
        },
      ];
      caption = `Os 5 kits participantes da nossa Pré-Black Friday Solar estão definidos!\n\nDeslize os slides para entender a diferença entre o Kit 550, 750, 1.000, 1.500 e 2.000 e descubra qual atende à média de kWh da sua casa.\n\nLançamento oficial: 29/10/2026 a 13/11/2026.`;
      callToAction = 'Salve este carrossel e chame nossos consultores para avaliar seu padrão de entrada!';
      hashtags = '#KitsSolares #PreBlackFriday #NowTechSolar #EconomiaReal #EnergiaSustentavel';
    }
  } else if (campaign === 'black-friday') {
    if (isPost) {
      pillar = 'conversao';
      theme = 'Black Friday Solar Oficial: FECHOU, GANHOU!';
      objective = 'Destacar a chamada oficial da Black Friday com prêmios imediatos ao fechar contrato.';
      caption = `FECHOU, GANHOU! A Black Friday Solar Oficial da NowTech Solar está no ar!\n\nDe 16 a 27 de novembro de 2026, você não apenas garante o seu sistema fotovoltaico com condições exclusivas, mas também leva premiações especiais na hora do contrato fechado!\n\nSão prêmios pensados para você aproveitar o melhor conforto neste fim de ano. Fale com nosso time agora!`;
      callToAction = 'Toque no link da bio e garanta o seu prêmio antes que o lote disponível termine!';
      hashtags = '#FechouGanhou #BlackFridaySolar #NowTechSolar #PromocaoSolar #PremiosBlackFriday';
    } else {
      pillar = 'vendas_ofertas';
      theme = 'Premiações da Black Friday: Ventilador, Air Fryer e Ar-Condicionado';
      objective = 'Apresentar detalhadamente as premiações oficiais da campanha FECHOU, GANHOU!';
      carouselTitle = 'Premiações Oficiais da Black Friday NowTech: FECHOU, GANHOU!';
      carouselCoverText = 'Fechou seu contrato solar na Black Friday? Veja o que você ganha! 👉';
      carouselClosingText = 'Consulte o regulamento com nossos consultores. Estoque de prêmios limitado!';
      slides = [
        {
          id: 's1',
          slideNumber: 1,
          title: 'Capa: Prêmios Black Friday Solar',
          content: 'Na NowTech Solar, seu investimento em energia solar vem com presentes imediatos para sua casa.',
        },
        {
          id: 's2',
          slideNumber: 2,
          title: 'Prêmio 1: Ventilador de Coluna Turbo',
          content: 'Potência silenciosa para refrescar os ambientes durante as tardes quentes da estação.',
        },
        {
          id: 's3',
          slideNumber: 3,
          title: 'Prêmio 2: Air Fryer Digital 4L',
          content: 'Cozinha prática, moderna e sem óleo para celebrar as refeições de fim de ano.',
        },
        {
          id: 's4',
          slideNumber: 4,
          title: 'Prêmio 3: Ar-Condicionado Inverter 12.000 BTUs',
          content: 'O par perfeito para sua energia solar: use climatização de ponta sem medo da fatura de energia!',
        },
        {
          id: 's5',
          slideNumber: 5,
          title: 'Kits Participantes: 1.000, 2.000 e 3.000',
          content: 'Válido exclusivamente para contratos assinados de 16 a 27 de novembro de 2026.',
        },
      ];
      caption = `Na Black Friday Solar Oficial da NowTech, o lema é direto: FECHOU, GANHOU!\n\nPreparamos um lote exclusivo de Ventiladores, Air Fryers e Ar-Condicionados para premiar os novos clientes que garantirem sua independência energética conosco.\n\nArraste para o lado e veja os detalhes dos prêmios e condições!`;
      callToAction = 'Consulte agora as regras de elegibilidade e feche sua proposta hoje mesmo!';
      hashtags = '#BlackFridayOficial #FechouGanhou #ArCondicionadoGratis #AirFryer #NowTechSolar';
    }
  } else if (campaign === 'natal') {
    if (isPost) {
      pillar = 'datas_comemorativas';
      theme = 'Natal Solar NowTech: Dinâmica Estoura Balão no Showroom';
      objective = 'Convidar os clientes a visitar a loja física e participar do Estoura Balão.';
      caption = `O Natal chegou na NowTech Solar! Venha visitar o nosso showroom e participe da nossa dinâmica ESTOURA BALÃO!\n\nSão mais de 100 balões com descontos exclusivos de até R$ 1.000, brindes solares e isenção de vistoria técnica para quem realizar sua simulação presencial ou assinar contrato.\n\nVenha tomar um café conosco e estourar o seu balão premiado!`;
      callToAction = 'Visite nossa loja central ou agende seu horário pelo WhatsApp no link da bio!';
      hashtags = '#NatalNowTech #EstouraBalao #NatalSolar #ShowroomNowTech #PresenteDeNatal';
    } else {
      pillar = 'educacao_solar';
      theme = 'Economia Solar no Verão: 5 Motivos para Instalar antes do Ano Novo';
      objective = 'Conscientizar sobre o pico de radiação solar no verão e a valorização do imóvel.';
      carouselTitle = '5 Motivos para Instalar Energia Solar antes do Réveillon';
      carouselCoverText = 'Por que Dezembro é o mês mais estratégico para instalar painéis solares? 👉';
      carouselClosingText = 'Dê um presente de mais de 25 anos de economia para o futuro da sua família!';
      slides = [
        {
          id: 's1',
          slideNumber: 1,
          title: 'Capa: O Presente que Dura 25 Anos',
          content: 'Neste Natal, invista no único presente que devolve dinheiro para o seu bolso todos os meses.',
        },
        {
          id: 's2',
          slideNumber: 2,
          title: '1. Pico de Radiação do Verão',
          content: 'Os dias mais longos e ensolarados geram o maior volume de créditos de energia de todo o ano.',
        },
        {
          id: 's3',
          slideNumber: 3,
          title: '2. Ar-Condicionado sem Culpa',
          content: 'Mantenha a casa fresca dia e noite sem o susto da conta no final do mês.',
        },
        {
          id: 's4',
          slideNumber: 4,
          title: '3. Valorização Imediata do Imóvel',
          content: 'Casas com usina solar própria valorizam em média 10% a 15% no mercado imobiliário.',
        },
        {
          id: 's5',
          slideNumber: 5,
          title: '4. Ativação Estoura Balão',
          content: 'Ganhe prêmios instantâneos visitando nossa loja e fechando sua proposta neste mês de Natal.',
        },
      ];
      caption = `Neste Natal, dê para sua família o presente que não quebra, não fica pequeno e dura mais de duas décadas: economia real de energia!\n\nDeslize os slides para ver por que instalar energia solar antes da virada do ano é a melhor decisão financeira para o seu 2027.`;
      callToAction = 'Clique no link da bio e receba um estudo de viabilidade gratuito ainda hoje!';
      hashtags = '#NatalSustentavel #NowTechSolar #EconomiaDeNatal #VeraoSolar #ZeroContaDeLuz';
    }
  } else {
    // Institucional / Regular
    const pillarsCycle: EditorialPillar[] = [
      'educacao_solar',
      'autoridade_confianca',
      'interacao',
      'prova_social',
      'conversao',
    ];
    pillar = pillarsCycle[index % pillarsCycle.length];

    if (isPost) {
      theme = 'Como o Sol Transforma sua Economia Doméstica';
      objective = 'Explicar de forma acessível a redução de até 95% na tarifa de energia.';
      caption = `Você sabia que a energia solar fotovoltaica é hoje o investimento residencial com maior taxa interna de retorno no Brasil?\n\nEnquanto a tarifa das distribuidoras sobe ano após ano com bandeiras amarela e vermelha, quem gera sua própria energia trava seus custos e protege o orçamento da família.\n\nQuer saber quanto o telhado da sua casa pode economizar por ano?`;
      callToAction = 'Envie uma mensagem no direct ou fale pelo link da bio com nosso especialista!';
      hashtags = '#EnergiaSolarBrasil #NowTechSolar #InvestimentoSeguro #Sustentabilidade';
    } else {
      pillar = 'autoridade_confianca';
      theme = 'Passo a Passo da Instalação NowTech: Do Projeto ao Aplicativo';
      objective = 'Demonstrar transparência e segurança técnica para diminuir objeções de compra.';
      carouselTitle = 'Como Funciona a Instalação com a NowTech Solar?';
      carouselCoverText = 'Você sabe o que acontece depois que você assina seu contrato? Arraste e veja! 👉';
      carouselClosingText = 'Equipe própria, engenharia certificada e homologação rápida na concessionária.';
      slides = [
        {
          id: 's1',
          slideNumber: 1,
          title: 'Capa: Processo 100% Descomplicado',
          content: 'A NowTech cuida de tudo: da visita técnica até a troca do medidor na concessionária.',
        },
        {
          id: 's2',
          slideNumber: 2,
          title: 'Etapa 1: Estudo e Projeto de Engenharia',
          content: 'Nossos engenheiros desenham a melhor inclinação e disposição dos módulos no seu telhado.',
        },
        {
          id: 's3',
          slideNumber: 3,
          title: 'Etapa 2: Homologação Formal',
          content: 'Cuidamos de toda a burocracia com a distribuidora de energia da sua região.',
        },
        {
          id: 's4',
          slideNumber: 4,
          title: 'Etapa 3: Instalação Segura em 1 a 2 Dias',
          content: 'Equipe especializada com equipamentos de segurança (NR-10 e NR-35) e fixação estanque.',
        },
        {
          id: 's5',
          slideNumber: 5,
          title: 'Etapa 4: Monitoramento no Celular',
          content: 'Acompanhe em tempo real cada kilowatt gerado na palma da sua mão com nosso aplicativo.',
        },
      ];
      caption = `Instalar energia solar não tem segredo nem dor de cabeça quando você conta com a equipe certa!\n\nNa NowTech Solar, você não se preocupa com papelada ou burocracia técnica. Cuidamos de cada etapa do projeto até o momento em que você vê os créditos gerados no seu aplicativo.\n\nArraste para o lado e conheça nosso fluxo de entrega!`;
      callToAction = 'Gostou do nosso padrão de trabalho? Solicite seu projeto personalizado no link da bio!';
      hashtags = '#EngenhariaSolar #PadraoNowTech #InstalacaoSolar #EnergiaFotovoltaica #Seguranca';
    }
  }

  // Calculate production due date (3 days before scheduled publication)
  const schedDate = new Date(dateStr + 'T00:00:00');
  const dueDateObj = new Date(schedDate);
  dueDateObj.setDate(dueDateObj.getDate() - 3);
  const dueDateStr = dueDateObj.toISOString().split('T')[0];

  return {
    id: `post-${dateStr}-${contentType}`,
    scheduledDate: dateStr,
    dayOfWeek,
    contentType,
    theme,
    objective,
    campaignId: campaign,
    pillar,
    socialNetwork: 'ambos',
    caption,
    callToAction,
    hashtags,
    imageFiles: [],
    responsible: 'Lucas Rocha',
    responsibleRole: 'Designer Gráfico & Redes Sociais',
    dueDate: dueDateStr,
    approvalStatus: 'pendente',
    approvedBy: null,
    approvedAt: null,
    status: 'ideia',
    isManualException: false,
    carouselTitle,
    carouselCoverText,
    carouselClosingText,
    slides,
    results: {
      reach: 0,
      interactions: 0,
      clicks: 0,
      leads: 0,
    },
  };
}
