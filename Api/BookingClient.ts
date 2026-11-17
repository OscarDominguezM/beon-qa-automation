import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../Fixtures/testData';

/**
 * Thin wrapper over the Restful-Booker endpoints.
 * It only sends requests and returns the raw response; assertions stay in the tests.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', { data: { username, password } });
    const body = await response.json();
    if (!body.token) {
      throw new Error(`Auth failed (${response.status()}): ${JSON.stringify(body)}`);
    }
    return body.token;
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  updateBooking(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: this.authHeader(token),
    });
  }

  deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeader(token) });
  }

  // Restful-Booker expects the token as a cookie, not as a Bearer header.
  private authHeader(token: string) {
    return { Cookie: `token=${token}` };
  }
}
