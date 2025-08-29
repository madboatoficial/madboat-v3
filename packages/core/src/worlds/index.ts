export interface World {
  id: string
  name: string
  description: string
  icon: string
  access_level: 'gratuito' | 'premium' | 'produtos_pagos'
}

export const WORLDS: Record<string, World> = {
  alma: {
    id: 'alma',
    name: 'Método A.L.M.A.',
    description: 'Autenticidade e Estratégia de Negócios',
    icon: '🧭',
    access_level: 'gratuito'
  },
  vortex: {
    id: 'vortex',
    name: 'Método Vórtice', 
    description: 'Construção de Audiência Autêntica',
    icon: '🌀',
    access_level: 'premium'
  },
  odisseia: {
    id: 'odisseia',
    name: 'Odisseia DEV',
    description: 'Progressão em IA para Desenvolvedores', 
    icon: '🚀',
    access_level: 'produtos_pagos'
  }
}