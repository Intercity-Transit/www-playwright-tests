import Ajv from 'ajv';
import { test, expect } from '@playwright/test';
import { logNote } from '../../utils/logNote';
import { fetchApiWithRetry } from '../../utils/fetchApiWithRetry';

const ajv = new Ajv();

// Simplified JSON Schema for calendar_dates.json structure
const schema = {
  type: 'object',
  required: ['dates', 'routes'],
  properties: {
    dates: {
      type: 'object',
      patternProperties: {
        '^[0-9]{4}-[0-9]{2}-[0-9]{2}$': {
          type: 'object',
          required: ['schedule_id', 'service_ids'],
          properties: {
            schedule_id: { type: 'integer' },
            service_ids: { type: 'array', items: { type: 'integer' } },
          },
        },
      },
    },
    routes: {
      type: 'object',
      patternProperties: {
        '^[0-9]+$': {
          type: 'object',
          required: ['schedules'],
          properties: {
            schedules: {
              type: 'object',
              patternProperties: {
                '^[0-9]+$': {
                  type: 'object',
                  required: ['directions'],
                  properties: { directions: { type: 'object' } },
                },
              },
            },
          },
        },
      },
    },
  },
};

const getDate = (daysOffset: number = 0): Date => new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
const today = getDate().toISOString().split('T')[0];

test.describe('Calendar Dates API Validation', () => {
  let apiData: any;

  test.beforeEach(async ({ request }) => {
    apiData = await fetchApiWithRetry(request, 'https://pics.intercitytransit.com/api/calendar_dates');
  });

  // Check Ajv validation
  test('API response matches schema', async () => {
    const validate = ajv.compile(schema);
    const valid = validate(apiData);
    expect.soft(valid).toBeTruthy();
    if (!valid) logNote(`Validation errors: ${JSON.stringify(validate.errors)}`);
  });

  // Check date range
  test('has expected date range', async () => {
    const dates = Object.keys(apiData?.dates ?? {}).sort();
    const firstDate = new Date(dates[0]).getTime();
    const lastDate = new Date(dates[dates.length - 1]).getTime();

    expect.soft(firstDate, 'First date should be less than 7 days ago').toBeLessThan(getDate(-7).getTime());
    expect.soft(lastDate, 'Last date should be more than 30 days in the future').toBeGreaterThan(getDate(30).getTime());
    logNote(`Found ${dates.length} dates ranging from ${dates[0]} to ${dates[dates.length - 1]}`);
  });

  // Check routes exist
  test('has information for routes', async () => {
    const routeIds = Object.keys(apiData?.routes ?? {});
    expect.soft(routeIds.length, 'Route count should be greater than 10').toBeGreaterThan(10);
    logNote(`Found ${routeIds.length} routes: ${routeIds.join(', ')}`);

  });

  // Check today's data
  test('today has valid schedule data', async () => {
    const todayData = apiData?.dates?.[today];

    expect.soft(todayData, "Today's date data should be defined").toBeDefined();
    expect.soft(todayData?.schedule_id, "Today's schedule_id should be greater than 0").toBeGreaterThan(0);
    expect.soft(Array.isArray(todayData?.service_ids), "Today's service_ids should be an array").toBeTruthy();
    logNote(`Today's (${today}) data: ${JSON.stringify(todayData)}`);
  });

  // Test the current schedule (changes infrequently)
  test('today has schedule_id 145', async () => {
    const todayData = apiData?.dates?.[today];

    expect.soft(todayData, "Today's data should be defined").toBeDefined();
    expect.soft(todayData?.schedule_id, "Today's schedule_id should be 145").toBe(145);
    logNote(`Today's data: ${JSON.stringify(todayData)}`);
  });

  // Check current schedule has route info
  test('current schedule has route information', async () => {
    const scheduleId = apiData?.dates?.[today]?.schedule_id?.toString();

    const routesWithCurrentSchedule = Object.keys(apiData?.routes ?? {}).filter(
      (routeId) => apiData.routes[routeId].schedules?.[scheduleId]
    );

    expect.soft(routesWithCurrentSchedule.length, 'Current schedule should have route information').toBeGreaterThan(0);
    logNote(`Found these routes with schedule_id ${scheduleId}: ${routesWithCurrentSchedule.join(', ')}`);
  });

  // Check each route has schedules
  test('each route has at least one schedule', async () => {
    const routes = apiData?.routes ?? {};
    const routeIds = Object.keys(routes);

    for (const routeId of routeIds) {
      const route = routes[routeId];
      const scheduleIds = Object.keys(route.schedules ?? {});

      expect.soft(scheduleIds.length, `Route ${routeId} should have at least one schedule`).toBeGreaterThan(0);

      // Check each schedule has directions
      for (const scheduleId of scheduleIds) {
        const schedule = route.schedules[scheduleId];
        expect.soft(schedule?.directions, `Route ${routeId} schedule ${scheduleId} should have directions`).toBeDefined();
        expect.soft(typeof schedule?.directions?.['0'], `Route ${routeId} schedule ${scheduleId} should have direction 0`).toBe('string');
        expect.soft(typeof schedule?.directions?.['1'], `Route ${routeId} schedule ${scheduleId} should have direction 1`).toBe('string');
      }
    }

    logNote(`Validated ${routeIds.length} routes, each having schedules with proper directions`);
  });
});
