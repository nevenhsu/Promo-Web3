import type { MantineColorsTuple } from '@mantine/core'

export type MantineColor = 'cyan' | 'green' | 'orange' | 'pink' | 'violet' | 'red' | 'yellow' | 'dark'

export const colors: Record<MantineColor, MantineColorsTuple> = {
  cyan: ['#e5faff', '#d6f7fe', '#c7f4fe', '#b8f2fe', '#a9effe', '#8be9fd', '#7ce6fd', '#6de3fc', '#5ee0fc', '#4fdefc'],
  green: ['#a9fdbe', '#9afcb3', '#8bfca8', '#7dfb9d', '#6efb91', '#50fa7b', '#41fa70', '#32f965', '#23f959', '#14f84e'],
  orange: [
    '#ffe4c8',
    '#ffddb9',
    '#ffd6a9',
    '#ffce9a',
    '#ffc78b',
    '#ffb86c',
    '#ffb15d',
    '#ffa94d',
    '#ffa23e',
    '#ff9a2f',
  ],
  pink: ['#ffd5ed', '#ffc6e7', '#ffb6e0', '#ffa7da', '#ff98d3', '#ff79c6', '#ff6abf', '#ff5ab9', '#ff4bb2', '#ff3cac'],
  violet: [
    '#f2eafe',
    '#e9dbfd',
    '#e0cdfc',
    '#d8befb',
    '#cfb0fb',
    '#bd93f9',
    '#b485f8',
    '#ab76f7',
    '#a268f7',
    '#9a59f6',
  ],
  red: ['#ffb1b1', '#ffa2a2', '#ff9292', '#ff8383', '#ff7474', '#ff5555', '#ff4646', '#ff3636', '#ff2727', '#ff1818'],
  yellow: [
    '#f0f0ed',
    '#fff3ca',
    '#ffe699',
    '#ffd862',
    '#ffcc36',
    '#ffc518',
    '#ffc102',
    '#e3aa00',
    '#ca9700',
    '#af8200',
  ],
  dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#25262b', '#1A1B1E', '#141517', '#101113', '#0B0C0D'],
}
