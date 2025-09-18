import Ajv from 'ajv';
import { test, expect } from '@playwright/test';
import { logNote } from '../../utils/logNote';
import * as constants from '../../utils/constants';
import { fetchApiWithRetry } from '../../utils/fetchApiWithRetry';
import { routes as ROUTE_LIST } from '../../utils/constants';

// Initialize Ajv for JSON schema validation
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

test.describe('Calendar Dates API Validation @api-test', () => {
  let apiData: any;

  test.beforeAll(async ({ request }) => {
    apiData = await fetchApiWithRetry(request, 'https://pics.intercitytransit.com/api/calendar_dates');
  });

  // Check Ajv validation
  test('API response matches schema', async () => {
    const validate = ajv.compile(schema);
    const valid = validate(apiData);
    expect.soft(valid).toBeTruthy();
    if (!valid) logNote(`Validation errors: ${JSON.stringify(validate.errors)}`);
  });

  test('has expected date range', async () => {
    const dates = Object.keys(apiData?.dates ?? {}).sort();
    const firstDate = new Date(dates[0]).getTime();
    const lastDate = new Date(dates[dates.length - 1]).getTime();

    expect.soft(firstDate, 'First date should be less than 7 days ago').toBeLessThan(getDate(-7).getTime());
    expect.soft(lastDate, 'Last date should be more than 30 days in the future').toBeGreaterThan(getDate(30).getTime());
    logNote(`Found ${dates.length} dates ranging from ${dates[0]} to ${dates[dates.length - 1]}`);
  });

  test("today's date defines a schedule and service ids", async () => {
    const todayData = apiData?.dates?.[today];
    expect.soft(todayData, "Today's date data should be defined").toBeDefined();
    expect.soft(todayData?.schedule_id, "Today's schedule_id should be defined").toBeDefined();
    expect.soft(todayData?.service_ids.length, "Today's service_ids should have at least one entry").toBeGreaterThan(0);
    logNote(`Today's (${today}) data: ${JSON.stringify(todayData)}`);
  });

  test("each route includes a schedule for today", async () => {
    const todaysSchedule = apiData?.dates?.[today]?.schedule_id?.toString();
    for (const routeId of constants.numericBusRouteIds) {
      const routeSchedules = apiData?.routes?.[routeId]?.schedules;
      const directions = routeSchedules?.[todaysSchedule]?.directions;
      expect.soft(directions, `Route ${routeId} should have directions for schedule ${todaysSchedule}`).toBeDefined();
      logNote(`Route ${routeId} schedule ids: ${Object.keys(routeSchedules ?? {}).join(', ')}`);
    }
  });
});
