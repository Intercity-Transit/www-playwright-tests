import Ajv from 'ajv';
import { test, expect } from '@playwright/test';
import { logNote } from '../../utils/logNote';
import * as constants from '../../utils/constants';
import { fetchApiWithRetry } from '../../utils/fetchApiWithRetry';

// Initialize Ajv for JSON schema validation
const ajv = new Ajv();

// Top level schema for stop_times.json
const schema = {
  type: 'object',
  required: ['data', 'status'],
  properties: {
    data: {
      type: 'object',
      required: ['Route'],
      properties: {
        Route: {
          type: 'object',
          required: ['MapInfo', 'Directions', 'StopTimesTables'],
          properties: {
            MapInfo: {
              type: 'object',
              required: ['Shapes'],
              properties: {
                Shapes: { type: 'object' },
              },
            },
            Directions: { type: 'object' },
            StopTimesTables: { type: 'array' },
          },
        },
      },
    },
    status: { type: 'string' },
  },
};

const routeIds = constants.numericBusRouteIds.slice(0, 3);
const getDate = (daysOffset: number = 0): Date => new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
const today = getDate().toISOString().split('T')[0];

test.describe.serial('Stop Times API Validation @api-test', () => {
  const apiDataMap: Record<string, any> = {};

  test.beforeAll(async ({ request }) => {
    for (const routeId of routeIds) {
      if (!apiDataMap[routeId]) {
        apiDataMap[routeId] = await fetchApiWithRetry(
          request,
          `https://pics.intercitytransit.com/api/stop_times?route_id=${routeId}`
        );
      }
    }
  });

  for (const routeId of routeIds) {
    test(`Route ${routeId}: API response matches schema`, async () => {
      const apiData = apiDataMap[routeId];
      const validate = ajv.compile(schema);
      const valid = validate(apiData);
      expect.soft(valid).toBeTruthy();
      if (!valid) logNote(`Validation errors for route ${routeId}: ${JSON.stringify(validate.errors)}`);
    });

    test(`Route ${routeId} stop times tables includes today`, async () => {
      const apiData = apiDataMap[routeId];
      const trips = apiData?.data?.Route?.StopTimesTables?.[0]?.[0]?.trips;
      expect.soft(trips, 'the route has trips defined').toBeDefined();

      // Handle trips as object (not array)
      const randomTrip = trips && typeof trips === 'object' ? trips[Object.keys(trips)[0]] : null;
      expect.soft(randomTrip?.arrival_time?.startsWith(today), 'the route has trips for today').toBeTruthy();
      logNote(`Route ${routeId} random trip tested ${JSON.stringify(randomTrip)}`);
    });
  }
});
