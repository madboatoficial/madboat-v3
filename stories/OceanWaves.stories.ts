import type { Meta, StoryObj } from '@storybook/react'
import { OceanWaves } from '../packages/ui/src/animations/OceanWaves'

const meta = {
  title: 'Animations/OceanWaves',
  component: OceanWaves,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'ocean',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    intensity: {
      control: {
        type: 'range',
        min: 0.1,
        max: 2,
        step: 0.1,
      },
      description: 'Intensidade das ondas',
    },
    speed: {
      control: {
        type: 'range',
        min: 0.5,
        max: 3,
        step: 0.1,
      },
      description: 'Velocidade da animação',
    },
    opacity: {
      control: {
        type: 'range',
        min: 0.1,
        max: 1,
        step: 0.1,
      },
      description: 'Opacidade das ondas',
    },
  },
} satisfies Meta<typeof OceanWaves>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    intensity: 1,
    speed: 1,
    opacity: 0.6,
  },
}

export const Calm: Story = {
  args: {
    intensity: 0.3,
    speed: 0.7,
    opacity: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ondas calmas para fundos sutis',
      },
    },
  },
}

export const Storm: Story = {
  args: {
    intensity: 2,
    speed: 2.5,
    opacity: 0.8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ondas intensas para momentos dramáticos',
      },
    },
  },
}

export const Gentle: Story = {
  args: {
    intensity: 0.8,
    speed: 1.2,
    opacity: 0.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ondas gentis para áreas de conteúdo',
      },
    },
  },
}