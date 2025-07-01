import {
  createPaymentService,
  getPaymentService,
  getPaymentByIdService,
  getPaymentsByBookingIdService,
  updatePaymentService,
  deletePaymentService
} from '../../src/payment/payment.services';

import db from '../../src/Drizzle/db';
import { PaymentTable } from '../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';

// Mock the db module
jest.mock('../../src/Drizzle/db', () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    PaymentTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    ReservationTable: {
      findMany: jest.fn(),
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Payment Services', () => {

  describe('createPaymentService', () => {
    it('should insert a new payment record', async () => {
      const payment = {
        paymentID: 1,
        bookingID: 10,
        amount: "100.00",
        paymentDate: "2024-06-01",
        paymentMethod: "Mpesa"
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([payment])
        })
      });

      const result = await createPaymentService(payment);
      expect(db.insert).toHaveBeenCalledWith(PaymentTable);
      expect(result).toBe("Payment added successfully");
    });
  });

  describe('getPaymentService', () => {
    it('should return all payment records', async () => {
      const payments = [
        { paymentID: 1, bookingID: 10, amount: "100.00", paymentDate: "2024-06-01", paymentMethod: "Mpesa" },
        { paymentID: 2, bookingID: 11, amount: "150.00", paymentDate: "2024-06-02", paymentMethod: "Card" }
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce(payments)
      });

      const result = await getPaymentService();
      expect(result).toEqual(payments);
    });
  });

  describe('getPaymentByIdService', () => {
    it('should return a payment by ID', async () => {
      const payment = { paymentID: 1, bookingID: 10, amount: "100.00", paymentDate: "2024-06-01", paymentMethod: "Mpesa" };

      (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValue(payment);

      const result = await getPaymentByIdService(1);
      expect(result).toEqual(payment);
    });

    it('should return null if no payment is found', async () => {
      (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getPaymentByIdService(999);
      expect(result).toBeNull();
    });
  });

  describe('getPaymentsByBookingIdService', () => {
    it('should return payments for a given booking ID', async () => {
      const payments = [
        { paymentID: 1, bookingID: 10, amount: "100.00", paymentDate: "2024-06-01", paymentMethod: "Mpesa" },
        { paymentID: 2, bookingID: 10, amount: "200.00", paymentDate: "2024-06-02", paymentMethod: "Cash" }
      ];

      (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValue(payments);

      const result = await getPaymentsByBookingIdService(10);
      expect(result).toEqual(payments);
    });
  });

  describe('updatePaymentService', () => {
    it('should update a payment and return a success message', async () => {
      const updatedPayment = {
        paymentID: 1,
        bookingID: 10,
        amount: "120.00",
        paymentDate: "2024-06-03",
        paymentMethod: "Mpesa"
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedPayment])
          })
        })
      });

      const result = await updatePaymentService(1, updatedPayment);
      expect(result).toBe("Payment updated successfully");
    });
  });

  describe('deletePaymentService', () => {
    it('should delete a payment and return the deleted payment', async () => {
      const deletedPayment = {
        paymentID: 1,
        bookingID: 10,
        amount: "100.00",
        paymentDate: "2024-06-01",
        paymentMethod: "Mpesa"
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deletedPayment])
        })
      });

      const result = await deletePaymentService(1);
      expect(result).toEqual(deletedPayment);
    });
  });

});
