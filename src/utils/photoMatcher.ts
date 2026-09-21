import { PhotoItem } from '../types';

type PhotoCategory = PhotoItem['category'];

interface KnownMeta {
  key: string;
  match: (name: string) => boolean;
  title: string;
  subtitle: string;
  category: PhotoCategory;
  date: string;
  location: string;
  description: string;
  quote?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  isFavorite?: boolean;
}

const KNOWN_METAS: KnownMeta[] = [
  {
    key: 'WA0056',
    match: (n) => n.includes('WA0056'),
    title: 'O Sim Mais Lindo',
    subtitle: 'O Noivado & O Buquê de Rosas',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Jantar Romântico à Luz de Velas',
    description: 'Um momento inesquecível de promessa e amor eterno: a aliança brilhando e o abraço caloroso sob o perfume de rosas vermelhas.',
    quote: 'Para sempre começa com um simples e radiante sim.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0041',
    match: (n) => n.includes('WA0041'),
    title: 'Sintonia Perfeita em Branco',
    subtitle: 'Harmonia & Cumplicidade',
    category: 'casal',
    date: '18 de Setembro, 2026',
    location: 'Ensaio em Estúdio',
    description: 'A serenidade de duas almas que caminham na mesma direção, celebrando a leveza e a pureza do companheirismo diário.',
    quote: 'Quando o coração encontra a sua paz, tudo se ilumina.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0005',
    match: (n) => n.includes('WA0005'),
    title: 'Corações Entrelaçados',
    subtitle: 'Alegria em Vermelho',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Ensaio Temático de Amor',
    description: 'Sorrisos espontâneos e blusas combinando com coração: o aconchego de quem ama com leveza e autenticidade.',
    quote: 'O amor verdadeiro é aquele que faz rir até com os olhos.',
    aspectRatio: 'square',
    isFavorite: true,
  },
  {
    key: 'WA0030',
    match: (n) => n.includes('WA0030'),
    title: 'Sob o Céu do Nosso Amor',
    subtitle: 'O Coração nas Nuvens',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Ao Ar Livre',
    description: 'Mãos unidas desenhando o símbolo do amor infinito contra o azul sereno do céu.',
    quote: 'Nenhum horizonte é distante demais quando sonhamos juntos.',
    aspectRatio: 'landscape',
    isFavorite: false,
  },
  {
    key: 'WA0026',
    match: (n) => n.includes('WA0026'),
    title: 'Luzes de Natal & Calor no Coração',
    subtitle: 'Tempo de Aconchego',
    category: 'casal',
    date: 'Dezembro, 2026',
    location: 'Lar Doce Lar',
    description: 'A atmosfera dourada das luzes natalinas refletindo o carinho e o abraço mais seguro do mundo.',
    quote: 'O melhor presente que a vida me deu tem o seu abraço.',
    aspectRatio: 'landscape',
    isFavorite: true,
  },
  {
    key: 'WA0043',
    match: (n) => n.includes('WA0043'),
    title: 'Tarde Ensolarada no Jardim',
    subtitle: 'Passeio & Brisa Leve',
    category: 'casal',
    date: '18 de Setembro, 2026',
    location: 'Resort & Natureza',
    description: 'A cumplicidade de uma tarde sob palmeiras e sol quente, vestidos de verão e cheios de boas conversas.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0025',
    match: (n) => n.includes('WA0025'),
    title: 'Conexão em Preto & Branco',
    subtitle: 'Elegância & Ternura',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Sessão Fotográfica Minimalista',
    description: 'A cumplicidade acolhedora com blusas escuras de coração, traduzindo intimidade e carinho.',
    aspectRatio: 'landscape',
    isFavorite: false,
  },
  {
    key: 'WA0018',
    match: (n) => n.includes('WA0018'),
    title: 'Selfie de Felicidade Pura',
    subtitle: 'Nossa Rotina Especial',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Momentos do Cotidiano',
    description: 'A espontaneidade de um clique no meio do dia, registrando a alegria de estar sempre por perto.',
    aspectRatio: 'landscape',
    isFavorite: false,
  },
  {
    key: 'WA0029',
    match: (n) => n.includes('WA0029'),
    title: 'Bordados de Afeto',
    subtitle: 'Branco Puro com Toque Rubro',
    category: 'casal',
    date: '19 de Setembro, 2026',
    location: 'Estúdio de Luz Natural',
    description: 'Um pequeno detalhe no peito que resume a grandiosidade do sentimento que une o casal.',
    aspectRatio: 'landscape',
    isFavorite: false,
  },
  {
    key: 'WA0032',
    match: (n) => n.includes('WA0032'),
    title: 'Jesus Meu Salvador',
    subtitle: 'Fé Gravada na Areia',
    category: 'especial',
    date: '19 de Setembro, 2026',
    location: 'Beira-Mar',
    description: 'Ensaio fotográfico à beira-mar traçando um coração na areia molhada com mensagem de fé e gratidão.',
    quote: 'A fé sustenta cada passo e abençoa cada união.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0033',
    match: (n) => n.includes('WA0033'),
    title: 'Pôr do Sol Dourado no Mar',
    subtitle: 'A Serenidade do Ensaio',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Praia ao Entardecer',
    description: 'O perfil sereno contemplando o pôr do sol no horizonte marítimo, banhada pelos raios âmbar e lavanda.',
    quote: 'A beleza da alma resplandece na tranquilidade do entardecer.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0036',
    match: (n) => n.includes('WA0036'),
    title: 'Rosa Magenta & Pétalas Vivas',
    subtitle: 'Elegância e Graça',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Ensaio Floral de Gala',
    description: 'Vestido fluido segurando um buquê suntuoso de rosas em harmonia com sua beleza encantadora.',
    quote: 'Florescer com doçura e autenticidade.',
    aspectRatio: 'square',
    isFavorite: true,
  },
  {
    key: 'WA0037-flores',
    match: (n) => n.includes('WA0037') && (n.includes('0919') || n.includes('flores') || !n.includes('0918')),
    title: 'Jardim de Rosas Carmesim',
    subtitle: 'Sorriso Entre as Flores',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Gramado Florido',
    description: 'Deitada sobre a relva verde cercada de rosas vermelhas desabrochadas, com um sorriso radiante.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0038',
    match: (n) => n.includes('WA0038'),
    title: 'Olhar Radiante & Tons Quentes',
    subtitle: 'Close-Up de Beleza & Luz',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Estúdio Golden Hour',
    description: 'Iluminação impecável realçando os olhos expressivos e a serenidade do sorriso da modelo.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0039',
    match: (n) => n.includes('WA0039'),
    title: 'Charme & Sofisticação em Preto',
    subtitle: 'Elegância Clássica',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Sessão Noir',
    description: 'A delicadeza do repouso nos braços e a elegância atemporal de um blazer preto refinado.',
    aspectRatio: 'square',
    isFavorite: false,
  },
  {
    key: 'WA0047',
    match: (n) => n.includes('WA0047'),
    title: 'Brisa Marítima & Brilho Dourado',
    subtitle: 'Espetáculo na Praia',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Litoral Paradisíaco',
    description: 'Vestido preto drapeado com fenda esvoaçante e detalhes luminosos sobre areias brancas.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0049',
    match: (n) => n.includes('WA0049'),
    title: 'Estilo Moderno & Denim Couture',
    subtitle: 'Atitude & Beleza',
    category: 'modelo',
    date: '19 de Setembro, 2026',
    location: 'Espaço Fashion',
    description: 'Corset jeans com acabamento em strass brilhante e cinto de fivela solar, unindo modernidade e atitude.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0076',
    match: (n) => n.includes('WA0076'),
    title: 'Retrato Clássico em Preto & Branco',
    subtitle: 'Foco, Visão & Firmeza',
    category: 'modelo',
    date: '15 de Setembro, 2026',
    location: 'Estúdio Retratista Master',
    description: 'Luz e sombra magistrais em terno escuro, destacando o olhar reflexivo e a serenidade da maturidade.',
    quote: 'A elegância é a postura com que se encara a vida.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0082',
    match: (n) => n.includes('WA0082'),
    title: 'Enquadrando o Destino',
    subtitle: 'A Perspectiva do Fotógrafo',
    category: 'modelo',
    date: '15 de Setembro, 2026',
    location: 'Noite Urbana Iluminada',
    description: 'Gesto criativo em gola alta preta emoldurando a visão, com bokeh de luzes noturnas ao fundo.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0084',
    match: (n) => n.includes('WA0084'),
    title: 'Viagem a Milão — Piazza del Duomo',
    subtitle: 'Catedral Gótica & História',
    category: 'especial',
    date: '15 de Setembro, 2026',
    location: 'Milão, Itália',
    description: 'A grandiosidade dos detalhes em mármore da Catedral de Milão compondo o cenário de um dia memorável.',
    aspectRatio: 'portrait',
    isFavorite: true,
  },
  {
    key: 'WA0054',
    match: (n) => n.includes('WA0054'),
    title: 'Aviação Executiva & Novos Horizontes',
    subtitle: 'Lounge VIP ao Pôr do Sol',
    category: 'modelo',
    date: '16 de Setembro, 2026',
    location: 'Terminal Executivo Privado',
    description: 'Traje alinhado com óculos de lentes degradê e a pista de decolagem anunciando novos destinos.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0001',
    match: (n) => n.includes('WA0001'),
    title: 'Companhia Leal & Momentos Espontâneos',
    subtitle: 'Tarde com o Felino Laranja',
    category: 'especial',
    date: '17 de Setembro, 2026',
    location: 'Estúdio Terracota',
    description: 'O contraste da serenidade do modelo com a curiosidade travessa do gato ruivo em primeiro plano.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0013',
    match: (n) => n.includes('WA0013'),
    title: 'Dupla Exposição — Vinho & Natureza',
    subtitle: 'Arte Surrealista & Essência',
    category: 'especial',
    date: '17 de Setembro, 2026',
    location: 'Galeria Conceitual',
    description: 'Composição artística unindo a degustação de um bom vinho e a imensidão verde de florestas secretas.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0009',
    match: (n) => n.includes('WA0009'),
    title: 'Aconchego & Sorriso Sincero',
    subtitle: 'Tons de Esmeralda & Âmbar',
    category: 'modelo',
    date: '18 de Setembro, 2026',
    location: 'Ambiente Lounge',
    description: 'Um retrato caloroso em gola alta preta com iluminação suave em tons de cobre e turquesa.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
  {
    key: 'WA0037-inovacao',
    match: (n) => n.includes('WA0037') && (n.includes('0918') || n.includes('inovacao') || n.includes('estudio')),
    title: 'Inovação & Criatividade',
    subtitle: 'Tecnologia com Alma',
    category: 'modelo',
    date: '18 de Setembro, 2026',
    location: 'Espaço de Criação',
    description: 'Polo branca traduzindo paixão pelo futuro, conexão, estética e inteligência.',
    aspectRatio: 'portrait',
    isFavorite: false,
  },
];

/**
 * Matches a filename to its corresponding poetic metadata in the Studio IA album
 */
export function matchPhotoMetadata(fileName: string, index = 0): Partial<PhotoItem> {
  const match = KNOWN_METAS.find((item) => item.match(fileName));

  if (match) {
    return {
      title: match.title,
      subtitle: match.subtitle,
      category: match.category,
      date: match.date,
      location: match.location,
      description: match.description,
      quote: match.quote,
      aspectRatio: match.aspectRatio || 'portrait',
      isFavorite: match.isFavorite ?? false,
    };
  }

  // Fallback heuristic
  const cleanName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\bIMG\b/gi, 'Foto')
    .replace(/\bWA\d+\b/gi, 'Momento')
    .trim();

  let category: PhotoCategory = 'casal';
  const lower = fileName.toLowerCase();
  if (lower.includes('modelo') || lower.includes('ensaio') || lower.includes('retrato') || lower.includes('noiva') || lower.includes('noivo')) {
    category = 'modelo';
  } else if (lower.includes('alianca') || lower.includes('jesus') || lower.includes('ceu') || lower.includes('especial')) {
    category = 'especial';
  }

  return {
    title: cleanName || `Momento Studio IA ${index + 1}`,
    subtitle: 'Memória Eterna',
    category,
    date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    location: 'Álbum Studio IA',
    description: `Registro fotográfico adicionado com amor ao álbum Studio IA (${fileName}).`,
    aspectRatio: 'portrait',
    isFavorite: false,
  };
}
