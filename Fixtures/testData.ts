// Static test data shared by the UI and API suites.

export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
} as const;

export const checkoutInfo = {
  firstName: 'Jane',
  lastName: 'Tester',
  postalCode: '45000',
};

export const apiAdmin = { username: 'admin', password: 'password123' };

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export const newBooking: Booking = {
  firstname: 'Jane',
  lastname: 'Tester',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

export const updatedCheckout = '2026-12-10';
