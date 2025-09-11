/**
 * Bus route numbers used throughout the Intercity Transit system
 */
export const BUS_ROUTES = [
  '12',
  '13',
  '14',
  '21',
  '41',
  '42',
  '45',
  '47',
  '48',
  '60',
  '64',
  '65',
  '66',
  '67',
  '68',
  '94',
  'ONE',
  '62A',
  '62B',
] as const;

/**
 * Type for bus route numbers
 */
export type BusRoute = (typeof BUS_ROUTES)[string];
