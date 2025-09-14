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
  '62A',
  '62B',
  '64',
  '65',
  '66',
  '67',
  '68',
  '94',
  'ONE', // aka 100
] as const;

/**
 * Type for bus route numbers
 */
export type BusRoute = (typeof BUS_ROUTES)[string];

/**
 * Collection of basic pages used for testing common page elements
 */
export const basicPagesCollection = [
  '/',
  '/about-us/news-and-alerts',
  '/agency/community-advisory-committee/meetings',
  '/agency/transit-authority/meetings',
  '/bus/accessible-services',
  '/contact',
  '/employment',
  '/how-to-ride/parks-by-bus',
  '/how-to-ride/safety-and-rules',
  '/plan-your-trip/routes',
  '/plan-your-trip/routes/41',
] as const;
