export type Category = 'todos' | 'casal' | 'igor' | 'adriana' | 'especial';

export type FrameStyle = 'baroque-gold' | 'imperial-silver' | 'rococo-filigree' | 'minimal-brass';

export type ViewMode = 'carousel' | 'gallery' | 'book';

export interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'casal' | 'igor' | 'adriana' | 'especial';
  date: string;
  location: string;
  src: string;
  description: string;
  isFavorite?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  quote?: string;
}
