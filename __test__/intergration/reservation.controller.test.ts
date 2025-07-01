import request from "supertest";
import express from "express";

import * as PaymentService from "../../src/payment/payment.services";
import {
  registerPaymentController,
  getPaymentController,
  getPaymentByIdController,
  getPaymentsByBookingIdController,
  updatePaymentController,
  deletePaymentController,
} from "../../src/payment/payment.controllers";

// Minimal express app for testing
const app = express();
app.use(express.json());

app.post("/payments", registerPaymentController as any);
app.get("/payments", getPaymentController as any);
app.get("/payments/:id", getPaymentByIdController as any);
app.get("/payments/booking/:bookingID", getPaymentsByBookingIdController as any);
app.put("/payments/:id", updatePaymentController as any);
app.delete("/payments/:id", deletePaymentController as any);

// Mock payment service
jest.mock("../../src/payment/payment.services");

describe("Payment Controller", () => {
  // Create
  test("POST /payments should create a new payment", async () => {
    const newPayment = {
      bookingID: 101,
      amount: "150.00",
      paymentDate: "2025-06-10",
      paymentMethod: "Credit Card",
    };

    (PaymentService.createPaymentService as jest.Mock).mockResolvedValue({
      paymentID: 1,
      ...newPayment,
    });

    const res = await request(app).post("/payments").send(newPayment);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: {
        paymentID: 1,
        ...newPayment,
      },
    });
  });

  // Get all
  test("GET /payments should return all payments", async () => {
    (PaymentService.getPaymentService as jest.Mock).mockResolvedValue([
      {
        paymentID: 1,
        bookingID: 101,
        amount: "150.00",
        paymentDate: "2025-06-10",
        paymentMethod: "Credit Card",
      },
    ]);

    const res = await request(app).get("/payments");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Get by ID
  test("GET /payments/:id should return one payment", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({
      paymentID: 1,
      bookingID: 101,
      amount: "150.00",
      paymentDate: "2025-06-10",
      paymentMethod: "Credit Card",
    });

    const res = await request(app).get("/payments/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        paymentID: 1,
        bookingID: 101,
        amount: "150.00",
        paymentDate: "2025-06-10",
        paymentMethod: "Credit Card",
      },
    });
  });

  // Get by bookingID
  test("GET /payments/booking/:bookingID should return payments", async () => {
    (PaymentService.getPaymentsByBookingIdService as jest.Mock).mockResolvedValue([
      {
        paymentID: 1,
        bookingID: 101,
        amount: "150.00",
        paymentDate: "2025-06-10",
        paymentMethod: "Credit Card",
      },
    ]);

    const res = await request(app).get("/payments/booking/101");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Update
  test("PUT /payments/:id should update a payment", async () => {
    const updatedPayment = {
      bookingID: 101,
      amount: "180.00",
      paymentDate: "2025-06-11",
      paymentMethod: "M-Pesa",
    };

    (PaymentService.updatePaymentService as jest.Mock).mockResolvedValue(true);

    const res = await request(app).put("/payments/1").send(updatedPayment);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Payment updated successfully" });
  });

  // Delete
  test("DELETE /payments/:id should delete a payment", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(true);
    (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(true);

    const res = await request(app).delete("/payments/1");

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  // Not found (GET)
  test("GET /payments/:id should return 404 if payment not found", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/payments/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Payment not found" });
  });

  // Not found (DELETE)
  test("DELETE /payments/:id should return 404 if payment not found", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete("/payments/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Payment not found" });
  });

  // 500 errors
  test("GET /payments should return 500 if service fails", async () => {
    (PaymentService.getPaymentService as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const res = await request(app).get("/payments");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Fetch failed" });
  });

  test("POST /payments should return 500 if service fails", async () => {
    (PaymentService.createPaymentService as jest.Mock).mockRejectedValue(new Error("Create failed"));

    const res = await request(app).post("/payments").send({
      bookingID: 101,
      amount: "150.00",
      paymentDate: "2025-06-10",
      paymentMethod: "Card",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Create failed" });
  });

  test("PUT /payments/:id should return 500 if service fails", async () => {
    (PaymentService.updatePaymentService as jest.Mock).mockRejectedValue(new Error("Update failed"));

    const res = await request(app).put("/payments/1").send({
      amount: "190.00",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Update failed" });
  });

  test("DELETE /payments/:id should return 500 if service fails", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(true);
    (PaymentService.deletePaymentService as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    const res = await request(app).delete("/payments/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Delete failed" });
  });
});
