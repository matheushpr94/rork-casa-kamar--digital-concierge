export interface ManualItem {
  id: string;
  title: string;
  body: string[];
  tags: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

export const HOUSE_MANUAL: ManualItem[] = [
  {
    id: 'wifi',
    title: 'Wi-Fi e Internet',
    body: [
      'Conecte-se à nossa rede Wi-Fi para navegar com velocidade e segurança.',
      'SSID: CasaKamara_Guest',
      'Senha: Kamara2024!',
      'A velocidade da internet é de 100 Mbps, ideal para trabalho remoto e streaming.',
      'Em caso de problemas de conexão, reinicie o roteador localizado na sala de estar.',
    ],
    tags: ['internet', 'wifi', 'conexão', 'trabalho'],
    links: [
      {
        label: 'Teste de Velocidade',
        url: 'https://fast.com',
      },
    ],
  },
  {
    id: 'house-rules',
    title: 'Regras da Casa',
    body: [
      'Para garantir uma estadia agradável para todos, pedimos que sigam estas regras:',
      '• Check-in: 15h às 22h | Check-out: até 11h',
      '• Silêncio após 22h nos dias de semana e 23h nos fins de semana',
      '• Não é permitido fumar dentro da propriedade',
      '• Animais de estimação são bem-vindos mediante consulta prévia',
      '• Máximo de 6 pessoas na propriedade',
      '• Festas e eventos não são permitidos',
      '• Mantenha as áreas comuns sempre limpas e organizadas',
    ],
    tags: ['regras', 'normas', 'comportamento', 'horários'],
  },
  {
    id: 'concierge-contact',
    title: 'Contatos e Concierge',
    body: [
      'Nossa equipe está disponível para ajudá-lo durante sua estadia.',
      'Concierge 24h: (11) 99999-9999',
      'Emergências: (11) 88888-8888',
      'Email: contato@casakamara.com.br',
      'Horário de atendimento presencial: 8h às 20h',
      'Para solicitações não urgentes, use o app ou envie mensagem no WhatsApp.',
    ],
    tags: ['contato', 'emergência', 'suporte', 'concierge'],
    links: [
      {
        label: 'WhatsApp Concierge',
        url: 'https://wa.me/5511999999999',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Cozinha e Utensílios',
    body: [
      'A cozinha está totalmente equipada para suas necessidades culinárias.',
      'Eletrodomésticos disponíveis:',
      '• Geladeira com freezer',
      '• Fogão 4 bocas com forno',
      '• Micro-ondas',
      '• Lava-louças',
      '• Cafeteira elétrica',
      '• Liquidificador e processador',
      'Utensílios: panelas, frigideiras, pratos, copos, talheres completos.',
      'Temperos básicos, óleo, sal e açúcar estão disponíveis.',
      'Por favor, lave a louça após o uso ou utilize a lava-louças.',
    ],
    tags: ['cozinha', 'utensílios', 'eletrodomésticos', 'comida'],
  },
  {
    id: 'bbq',
    title: 'Churrasqueira e Área Gourmet',
    body: [
      'Aproveite nossa área gourmet com churrasqueira para momentos especiais.',
      'A churrasqueira é a gás e está sempre pronta para uso.',
      'Utensílios para churrasco estão no armário da área gourmet.',
      'Carvão e acendedor estão disponíveis no depósito.',
      'Mesa para 8 pessoas com vista para o jardim.',
      'Pia e geladeira auxiliar na área gourmet.',
      'Horário de uso: 8h às 22h (respeite os vizinhos).',
      'Após o uso, limpe a churrasqueira e organize os utensílios.',
    ],
    tags: ['churrasqueira', 'churrasco', 'área gourmet', 'externa'],
  },
  {
    id: 'pool-rooftop',
    title: 'Piscina e Rooftop',
    body: [
      'Relaxe em nossa piscina aquecida e aproveite o rooftop com vista panorâmica.',
      'Piscina aquecida disponível 24h (temperatura: 26-28°C).',
      'Toalhas de piscina estão no armário do rooftop.',
      'Espreguiçadeiras e guarda-sol disponíveis.',
      'Chuveiro externo para enxágue.',
      'Bar molhado no rooftop com pia e frigobar.',
      'Vista 360° da cidade - ideal para o pôr do sol.',
      'Crianças devem estar sempre acompanhadas de adultos.',
      'Não é permitido vidro na área da piscina.',
    ],
    tags: ['piscina', 'rooftop', 'vista', 'relaxamento'],
  },
  {
    id: 'air-conditioning',
    title: 'Ar-condicionado e Climatização',
    body: [
      'Todos os ambientes possuem ar-condicionado para seu conforto.',
      'Controles remotos estão em cada quarto e sala.',
      'Temperatura recomendada: 22-24°C.',
      'Para economizar energia, desligue o ar ao sair dos ambientes.',
      'Em caso de problemas, verifique se o disjuntor não desarmou.',
      'Filtros são limpos semanalmente pela equipe de manutenção.',
      'Modo econômico disponível nos controles (botão ECO).',
    ],
    tags: ['ar-condicionado', 'temperatura', 'clima', 'conforto'],
  },
  {
    id: 'laundry',
    title: 'Lavanderia e Roupas',
    body: [
      'Área de serviço completa para cuidar de suas roupas.',
      'Máquina de lavar 12kg com função de secagem.',
      'Sabão em pó, amaciante e alvejante disponíveis.',
      'Varal suspenso e cabides no armário.',
      'Ferro de passar e tábua de passar disponíveis.',
      'Tanque para lavagem manual se necessário.',
      'Horário recomendado: 8h às 20h (evite ruído noturno).',
      'Instruções de uso da máquina estão coladas na parede.',
    ],
    tags: ['lavanderia', 'roupas', 'máquina', 'lavar'],
  },
  {
    id: 'cleaning-towels',
    title: 'Limpeza e Toalhas',
    body: [
      'Mantemos a casa sempre limpa e organizada para seu conforto.',
      'Limpeza completa realizada antes do check-in.',
      'Troca de roupa de cama: a cada 3 dias ou sob solicitação.',
      'Troca de toalhas: diariamente ou conforme necessário.',
      'Kit de limpeza básico disponível no armário da cozinha.',
      'Aspirador de pó no closet do corredor.',
      'Para limpeza adicional, solicite através do app.',
      'Produtos de limpeza ecológicos são utilizados.',
    ],
    tags: ['limpeza', 'toalhas', 'organização', 'higiene'],
  },
  {
    id: 'trash-sustainability',
    title: 'Lixo e Sustentabilidade',
    body: [
      'Ajude-nos a manter o meio ambiente preservado com práticas sustentáveis.',
      'Coleta seletiva: lixeiras separadas na cozinha.',
      '• Azul: papel e papelão',
      '• Amarela: plástico e metal',
      '• Verde: vidro',
      '• Cinza: orgânico',
      'Coleta de lixo: terças, quintas e sábados às 7h.',
      'Evite desperdício de água e energia.',
      'Produtos de limpeza biodegradáveis são preferidos.',
      'Composteira disponível para restos orgânicos.',
    ],
    tags: ['lixo', 'sustentabilidade', 'reciclagem', 'meio ambiente'],
  },
  {
    id: 'security',
    title: 'Segurança e Acesso',
    body: [
      'Sua segurança é nossa prioridade. Conheça os sistemas de proteção.',
      'Portão eletrônico com interfone (código: #1234).',
      'Câmeras de segurança nas áreas externas.',
      'Cofre digital no quarto principal (código personalizado).',
      'Alarme de incêndio em todos os ambientes.',
      'Extintor de incêndio na cozinha e área gourmet.',
      'Saídas de emergência sinalizadas.',
      'Número da polícia: 190 | Bombeiros: 193',
      'Guarde sempre as chaves em local seguro.',
    ],
    tags: ['segurança', 'acesso', 'emergência', 'proteção'],
  },
  {
    id: 'transfers-tours',
    title: 'Transfers e Passeios',
    body: [
      'Explore a cidade com nossas dicas e serviços de transporte.',
      'Transfer do/para aeroporto disponível (solicite com antecedência).',
      'Pontos turísticos próximos:',
      '• Centro histórico: 15 min de carro',
      '• Praia principal: 20 min de carro',
      '• Shopping center: 10 min de carro',
      'Aplicativos recomendados: Uber, 99, iFood.',
      'Estacionamento gratuito na propriedade (2 vagas).',
      'Bicicletas disponíveis para empréstimo.',
      'Mapa turístico disponível na recepção.',
    ],
    tags: ['transporte', 'passeios', 'turismo', 'transfer'],
    links: [
      {
        label: 'Mapa da Região',
        url: 'https://maps.google.com',
      },
    ],
  },
];

export function searchManual(query: string): ManualItem[] {
  if (!query.trim()) return HOUSE_MANUAL;
  
  const searchTerm = query.toLowerCase().trim();
  
  return HOUSE_MANUAL.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    item.body.some(paragraph => paragraph.toLowerCase().includes(searchTerm))
  );
}

export function getManualItem(id: string): ManualItem | undefined {
  return HOUSE_MANUAL.find(item => item.id === id);
}