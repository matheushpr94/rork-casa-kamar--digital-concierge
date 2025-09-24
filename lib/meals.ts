import type { MealItem } from '@/types/api';

export const MEAL_ITEMS: MealItem[] = [
  // Café da Manhã
  {
    id: 'bf_tapioca',
    name: 'Tapioca com queijo coalho',
    description: 'Leve e sem glúten, com queijo coalho derretido',
    imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop',
    category: 'breakfast',
  },
  {
    id: 'bf_paoqueijo',
    name: 'Pão de queijo',
    description: 'Clássico mineiro, crocante por fora, macio por dentro',
    imageUrl: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=400&h=300&fit=crop',
    category: 'breakfast',
  },
  {
    id: 'bf_cuscuz',
    name: 'Cuscuz nordestino',
    description: 'Milho flocado, manteiga e ovos mexidos',
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-3746b6a1b2a6?w=400&h=300&fit=crop',
    category: 'breakfast',
  },
  {
    id: 'bf_bolomilho',
    name: 'Bolo de milho',
    description: 'Fofinho e aromático',
    imageUrl: 'https://images.unsplash.com/photo-1514512364185-4c2b3f36f02b?w=400&h=300&fit=crop',
    category: 'breakfast',
  },
  {
    id: 'bf_ovoscoalho',
    name: 'Ovos mexidos com queijo coalho',
    description: 'Proteico para começar o dia',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    category: 'breakfast',
  },

  // Petiscos
  {
    id: 'sn_bolinhobacalhau',
    name: 'Bolinho de bacalhau',
    description: 'Clássico português, crocante',
    imageUrl: 'https://images.unsplash.com/photo-1604908554050-0896a6d7f1b6?w=400&h=300&fit=crop',
    category: 'snacks',
  },
  {
    id: 'sn_pastelcarne',
    name: 'Pastel de carne',
    description: 'Massa fina e recheio suculento',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
    category: 'snacks',
  },
  {
    id: 'sn_acaraje',
    name: 'Acarajé',
    description: 'Baiano, com vatapá e camarão',
    imageUrl: 'https://images.unsplash.com/photo-1604908176986-2d7f5b0e5e0a?w=400&h=300&fit=crop',
    category: 'snacks',
  },
  {
    id: 'sn_mandiocafrita',
    name: 'Mandioca frita',
    description: 'Sequinha e dourada',
    imageUrl: 'https://images.unsplash.com/photo-1625944527988-3a7b5b5b5c35?w=400&h=300&fit=crop',
    category: 'snacks',
  },
  {
    id: 'sn_queijocoalho',
    name: 'Queijo coalho na brasa',
    description: 'Com melaço ou mel',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    category: 'snacks',
  },
  {
    id: 'sn_bolinharroz',
    name: 'Bolinho de arroz',
    description: 'Crocante e cremoso',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-8a5d68f52cdd?w=400&h=300&fit=crop',
    category: 'snacks',
  },

  // Almoço
  {
    id: 'ln_moqueca',
    name: 'Moqueca de peixe',
    description: 'Peixe, leite de coco e dendê',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-8b7b2a2d5fe7?w=400&h=300&fit=crop',
    category: 'lunch',
  },
  {
    id: 'ln_feijoada',
    name: 'Feijoada',
    description: 'Feijão preto e carnes',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43f0b6b2c41c?w=400&h=300&fit=crop',
    category: 'lunch',
  },
  {
    id: 'ln_baiaod2',
    name: 'Baião de dois',
    description: 'Arroz, feijão verde e queijo coalho',
    imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop',
    category: 'lunch',
  },
  {
    id: 'ln_estrogonofe',
    name: 'Estrogonofe de frango',
    description: 'Creme suave, batata palha',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&h=300&fit=crop',
    category: 'lunch',
  },
  {
    id: 'ln_bobo',
    name: 'Bobó de camarão',
    description: 'Creme de mandioca com camarão',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    category: 'lunch',
  },

  // Jantar
  {
    id: 'dn_churrasco',
    name: 'Churrasco misto',
    description: 'Carnes selecionadas, farofa e vinagrete',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    category: 'dinner',
  },
  {
    id: 'dn_arrozpato',
    name: 'Arroz de pato',
    description: 'Sabor intenso',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    category: 'dinner',
  },
  {
    id: 'dn_galinhada',
    name: 'Galinhada',
    description: 'Arroz, frango e açafrão',
    imageUrl: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=300&fit=crop',
    category: 'dinner',
  },
  {
    id: 'dn_escondidinho',
    name: 'Escondidinho de carne seca',
    description: 'Purê de mandioca cremoso',
    imageUrl: 'https://images.unsplash.com/photo-1601050690583-5e9b6a1d9d9b?w=400&h=300&fit=crop',
    category: 'dinner',
  },
  {
    id: 'dn_peixefarofa',
    name: 'Peixe assado com farofa',
    description: 'Leve e aromático',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    category: 'dinner',
  },
];

export const MEAL_LIMITS = {
  breakfast: 1,
  snacks: 2,
  lunch: 1,
  dinner: 1,
} as const;

export const MEAL_CATEGORY_NAMES = {
  breakfast: 'Café da Manhã',
  snacks: 'Petiscos',
  lunch: 'Almoço',
  dinner: 'Jantar',
} as const;

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomMealsByCategory(category: keyof typeof MEAL_LIMITS, count: number): MealItem[] {
  const categoryMeals = MEAL_ITEMS.filter(meal => meal.category === category);
  const shuffled = shuffleArray(categoryMeals);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateDayMeals(): { [K in keyof typeof MEAL_LIMITS]: MealItem[] } {
  return {
    breakfast: getRandomMealsByCategory('breakfast', 5),
    snacks: getRandomMealsByCategory('snacks', 6),
    lunch: getRandomMealsByCategory('lunch', 5),
    dinner: getRandomMealsByCategory('dinner', 5),
  };
}

export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}