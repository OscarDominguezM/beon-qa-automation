import { test, expect } from '@playwright/test';
import { BookingClient } from '../../Api/BookingClient';
import { apiAdmin, newBooking, updatedCheckout, Booking } from '../../Fixtures/testData';

// Each step depends on the one before it (token -> id -> update -> delete),
// so these tests run in order and stop at the first failure.
test.describe.configure({ mode: 'serial' });

test.describe('Booking lifecycle', () => {
  let client: BookingClient;
  let token: string;
  let bookingId: number;
  let currentBooking: Booking;
  let disposeRequest: (() => Promise<void>) | undefined;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext({
      baseURL: test.info().project.use.baseURL,
      extraHTTPHeaders: test.info().project.use.extraHTTPHeaders,
    });
    client = new BookingClient(request);
    disposeRequest = () => request.dispose();
  });

  test.afterAll(async () => {
    await disposeRequest?.();
  });

  test('1. generates an auth token', async () => {
    token = await client.createToken(apiAdmin.username, apiAdmin.password);
    expect(token).toBeTruthy();
  });

  test('2. creates a booking', async () => {
    const response = await client.createBooking(newBooking);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(newBooking);

    bookingId = body.bookingid;
    currentBooking = body.booking;
  });

  test('3. reads the booking by id', async () => {
    const response = await client.getBooking(bookingId);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(currentBooking);
  });

  test('4. updates the checkout date', async () => {
    const changes: Booking = {
      ...currentBooking,
      bookingdates: { ...currentBooking.bookingdates, checkout: updatedCheckout },
    };

    const response = await client.updateBooking(bookingId, changes, token);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(changes);

    // Confirm the change was stored, not just echoed back.
    const stored = await (await client.getBooking(bookingId)).json();
    expect(stored.bookingdates.checkout).toBe(updatedCheckout);
    currentBooking = changes;
  });

  test('5. deletes the booking', async () => {
    const response = await client.deleteBooking(bookingId, token);
    expect(response.status()).toBe(201);

    const lookup = await client.getBooking(bookingId);
    expect(lookup.status()).toBe(404);
  });
});
