import { courses } from './courses';

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // accent color for the category
  bgGradient: string; // gradient for the card
  courseCount: number;
  levels: string[];
  instructors: string[];
  featuredCourseSlug?: string;
}

function getCategoryData(categoryName: string) {
  const categoryCourses = courses.filter(c => c.category === categoryName);
  const uniqueLevels = [...new Set(categoryCourses.map(c => c.level))];
  const uniqueInstructors = [...new Set(categoryCourses.map(c => c.instructor))];
  return {
    courseCount: categoryCourses.length,
    levels: uniqueLevels,
    instructors: uniqueInstructors,
    featuredCourseSlug: categoryCourses[0]?.slug,
  };
}

export const categoryList: Category[] = [
  {
    slug: 'celik-yapi-tasarimi',
    name: 'Çelik Yapı Tasarımı',
    description: 'TBDY 2018 standartlarında çelik yapı tasarımı, birleşim detayları, depreme dayanıklı çelik sistemler ve performansa dayalı tasarım eğitimleri.',
    icon: 'Columns3',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 100%)',
    ...getCategoryData('Çelik Yapı Tasarımı'),
  },
  {
    slug: 'betonarme-yapi',
    name: 'Betonarme Yapı',
    description: 'Betonarme yapı tasarımı, kolon-kiriş-döşeme hesapları, depreme dayanıklı betonarme sistemler ve mevcut yapı değerlendirme eğitimleri.',
    icon: 'Building2',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.04) 100%)',
    ...getCategoryData('Betonarme Yapı'),
  },
  {
    slug: 'performans-analizi',
    name: 'Performans Analizi',
    description: 'Performansa dayalı tasarım, doğrusal olmayan analiz yöntemleri, plastik mafsal modelleri ve mevcut yapı değerlendirme prosedürleri.',
    icon: 'BarChart3',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 100%)',
    ...getCategoryData('Performans Analizi'),
  },
  {
    slug: 'ahsap-yapi',
    name: 'Ahşap Yapı',
    description: 'Yapısal ahşap tasarım, CLT/GLT modern ahşap malzemeler, birleşim tasarımı, yangın dayanımı ve sürdürülebilir yapı tasarımı eğitimleri.',
    icon: 'TreePine',
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%)',
    ...getCategoryData('Ahşap Yapı'),
  },
  {
    slug: 'bim',
    name: 'BIM',
    description: 'Bina Bilgi Modelleme standartları, 3D yapısal modelleme, çakışma kontrolü, 4D/5D BIM uygulamaları ve proje yönetimi entegrasyonu.',
    icon: 'Box',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.04) 100%)',
    ...getCategoryData('BIM'),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryList.find(c => c.slug === slug);
}
