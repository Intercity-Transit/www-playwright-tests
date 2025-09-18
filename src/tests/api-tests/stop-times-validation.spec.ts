import _ from 'lodash';
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

const getDate = (daysOffset: number = 0): Date => new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (const routeId of constants.numericBusRouteIds) {
  test.describe(`API validation ${routeId} stop times @api-test`, () => {
    let apiData: any;

    test.beforeAll(async ({ request }) => {
      apiData = await fetchApiWithRetry(
        request,
        `https://pics.intercitytransit.com/api/stop_times?route_id=${routeId}`
      );
      // Pause 1 second before moving on
      await sleep(1000);
    });

    test(`response matches basic schema`, async () => {
      const validate = ajv.compile(schema);
      const valid = validate(apiData);
      expect.soft(valid, 'API response should match the basic AJV schema').toBeTruthy();
      if (!valid) logNote(`Validation errors for route ${routeId}: ${JSON.stringify(validate.errors)}`);
    });

    test(`response has correct route_id`, async () => {
      expect
        .soft(String(apiData?.data?.Route?.RouteInfo?.route_id), 'the route info should have correct route_id')
        .toEqual(routeId);
      logNote(`Route ${routeId} info: ${JSON.stringify(apiData?.data?.Route?.RouteInfo)}`);
    });

    test(`stop times includes today`, async () => {
      // Check data.Route.StopTimesTables[0][0].trips["t33E-b4B2-slA"].arrival_time
      const stopTimeTables = _.get(apiData, 'data.Route.StopTimesTables', []);
      const randomTable = _.sample(_.flatten(stopTimeTables));
      const randomTrip = _.sample(_.values(randomTable?.trips));
      const today = getDate().toISOString().split('T')[0];

      expect.soft(randomTrip?.arrival_time?.startsWith(today), 'the route has trips for today').toBeTruthy();
      logNote(`Route ${routeId} random trip tested ${JSON.stringify(randomTrip)}`);
    });
  });
}
