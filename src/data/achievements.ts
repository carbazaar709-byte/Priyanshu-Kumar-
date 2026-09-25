import { Achievement, LeaderboardPlayer } from '../types';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lap',
    title: 'First Lap',
    description: 'Complete your first automotive quiz challenge.',
    icon: 'Flag',
    unlocked: false
  },
  {
    id: 'flawless_victory',
    title: 'Pole Position',
    description: 'Score a perfect 10/10 in any quiz category.',
    icon: 'Trophy',
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 5 questions with more than 10 seconds remaining on the clock.',
    icon: 'Zap',
    unlocked: false
  },
  {
    id: 'desi_gearhead',
    title: 'Desi Gearhead',
    description: 'Master the Indian Cars category with >80% accuracy.',
    icon: 'Flame',
    unlocked: false
  },
  {
    id: 'v12_connoisseur',
    title: 'V12 Connoisseur',
    description: 'Score 100 points or more in Luxury & Supercars.',
    icon: 'Crown',
    unlocked: false
  },
  {
    id: 'ev_pioneer',
    title: 'Electric Pioneer',
    description: 'Pass the EVs & Future Tech challenge on Hard difficulty.',
    icon: 'BatteryCharging',
    unlocked: false
  },
  {
    id: 'centurion_racer',
    title: 'Grand Prix Legend',
    description: 'Accumulate over 500 total points across all modes.',
    icon: 'Award',
    unlocked: false
  }
];

export const INITIAL_LEADERBOARD: Record<'daily' | 'weekly' | 'allTime', LeaderboardPlayer[]> = {
  daily: [
    {
      id: 'lb-d-1',
      username: 'Apex_Vettel',
      avatar: '🏎️',
      score: 180,
      accuracy: 95,
      rank: 1,
      badge: 'Formula Ace',
      carTitle: 'Porsche 911 GT3 RS'
    },
    {
      id: 'lb-d-2',
      username: 'DesiTorque',
      avatar: '🚙',
      score: 160,
      accuracy: 90,
      rank: 2,
      badge: 'Thar Champion',
      carTitle: 'Mahindra Thar 4x4'
    },
    {
      id: 'lb-d-3',
      username: 'RimacRider',
      avatar: '⚡',
      score: 150,
      accuracy: 88,
      rank: 3,
      badge: 'EV Voltmaster',
      carTitle: 'Rimac Nevera'
    },
    {
      id: 'lb-d-4',
      username: 'TurboRaj',
      avatar: '🔥',
      score: 130,
      accuracy: 82,
      rank: 4,
      badge: 'Street Tuner',
      carTitle: 'Tata Safari Dark'
    },
    {
      id: 'lb-d-5',
      username: 'V16_Chiron',
      avatar: '👑',
      score: 110,
      accuracy: 78,
      rank: 5,
      badge: 'Hyper Driver',
      carTitle: 'Bugatti Chiron'
    }
  ],
  weekly: [
    {
      id: 'lb-w-1',
      username: 'ScuderiaKaran',
      avatar: '🏎️',
      score: 840,
      accuracy: 96,
      rank: 1,
      badge: 'Maranello Master',
      carTitle: 'Ferrari 812 Competizione'
    },
    {
      id: 'lb-w-2',
      username: 'DriftKing99',
      avatar: '🏁',
      score: 790,
      accuracy: 92,
      rank: 2,
      badge: 'Apex Predator',
      carTitle: 'Nissan GT-R Nismo'
    },
    {
      id: 'lb-w-3',
      username: 'NexaSpeed',
      avatar: '🚗',
      score: 710,
      accuracy: 89,
      rank: 3,
      badge: 'Desi Racer',
      carTitle: 'Maruti Jimny 4x4'
    },
    {
      id: 'lb-w-4',
      username: 'G_Wagon_King',
      avatar: '🛡️',
      score: 650,
      accuracy: 84,
      rank: 4,
      badge: 'Trail Boss',
      carTitle: 'Mercedes-AMG G63'
    },
    {
      id: 'lb-w-5',
      username: 'CyberTrucker',
      avatar: '⚡',
      score: 590,
      accuracy: 81,
      rank: 5,
      badge: 'Tech Pilot',
      carTitle: 'Tesla Cybertruck'
    }
  ],
  allTime: [
    {
      id: 'lb-a-1',
      username: 'Senna_Tribute',
      avatar: '🏆',
      score: 3420,
      accuracy: 98,
      rank: 1,
      badge: 'Motorsport God',
      carTitle: 'McLaren F1 LM'
    },
    {
      id: 'lb-a-2',
      username: 'TunedByGhost',
      avatar: '🏎️',
      score: 2980,
      accuracy: 94,
      rank: 2,
      badge: 'Track Legend',
      carTitle: 'Koenigsegg Jesko'
    },
    {
      id: 'lb-a-3',
      username: 'OffroadBhartiya',
      avatar: '🚙',
      score: 2640,
      accuracy: 91,
      rank: 3,
      badge: 'Dakar Veteran',
      carTitle: 'Toyota Land Cruiser GR'
    },
    {
      id: 'lb-a-4',
      username: 'StigTwin',
      avatar: '⚡',
      score: 2210,
      accuracy: 87,
      rank: 4,
      badge: 'Top Gear Master',
      carTitle: 'Pagani Zonda R'
    },
    {
      id: 'lb-a-5',
      username: 'TataTitan',
      avatar: '🔥',
      score: 1950,
      accuracy: 85,
      rank: 5,
      badge: 'Indigenous Pioneer',
      carTitle: 'Tata Sierra EV Concept'
    }
  ]
};
