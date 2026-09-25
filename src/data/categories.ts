import { CategoryId, CategoryInfo } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  indian_cars: {
    id: 'indian_cars',
    title: 'Indian Cars',
    subtitle: 'Mahindra, Tata, Maruti & More',
    tagline: 'Desi powerhouses and road kings of India',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    iconName: 'Flame',
    accentColor: '#D4AF37'
  },
  luxury_supercars: {
    id: 'luxury_supercars',
    title: 'Luxury & Supercars',
    subtitle: 'Exotics, V12s & Hypercars',
    tagline: 'Engineering masterpieces of Ferrari, Rolls-Royce & Bugatti',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    iconName: 'Crown',
    accentColor: '#E6C86E'
  },
  suvs_offroad: {
    id: 'suvs_offroad',
    title: 'SUVs & Off-Roaders',
    subtitle: '4x4 Beasts & Trail Crushers',
    tagline: 'Conquer mud, sand, and rock with legendary all-terrain rigs',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    iconName: 'Compass',
    accentColor: '#D4AF37'
  },
  evs_future: {
    id: 'evs_future',
    title: 'EVs & Future Tech',
    subtitle: 'Instant Torque & Autonomous Tech',
    tagline: 'The electric revolution from Rimac to Tesla',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    iconName: 'Zap',
    accentColor: '#00E5FF'
  },
  brands_logos: {
    id: 'brands_logos',
    title: 'Brands & Emblems',
    subtitle: 'Heritage, Badges & History',
    tagline: 'Decode automotive legends, logos, and origin stories',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    iconName: 'Shield',
    accentColor: '#AA820A'
  },
  mechanics_tech: {
    id: 'mechanics_tech',
    title: 'Mechanics & Features',
    subtitle: 'Turbos, Transmissions & ADAS',
    tagline: 'Under the hood: pistons, superchargers & suspension wizardry',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    iconName: 'Wrench',
    accentColor: '#D4AF37'
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
