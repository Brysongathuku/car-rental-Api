import { createBookingService, getBookingService, getBookingByIdService, updateBookingService, deleteBookingService } from "../../src/booking/booking.services"
import db from "../../src/Drizzle/db"
import {BookingsTable} from "../../src/Drizzle/schema";


// Mock the modules 
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        BookingsTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Booking Service", () => {
    describe("createBookingService", () => {
        it("should insert a booking and return success message", async () => {
            const booking = {
                customerID: 1,
                carID: 2,
                rentalStartDate: "2024-06-01",
                rentalEndDate: "2024-06-10",
                totalAmount: "100.00"
            };
            
            const insertedBooking = { bookingID: 1, ...booking };
            
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedBooking])
                })
            });

            const result = await createBookingService(booking);
            expect(db.insert).toHaveBeenCalledWith(BookingsTable);
            expect(result).toEqual(booking);
        });

        it("should return null if insertion fails", async () => {
          

            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([undefined])
                })
            })

           
        });
    });

    describe("getBookingService", () => {
        it("should return all bookings", async () => {
            const bookings = [
                { 
                    bookingID: 1, 
                    customerID: 1, 
                    carID: 2, 
                    rentalStartDate: "2024-06-01", 
                    rentalEndDate: "2024-06-10", 
                    totalAmount: "100.00" 
                },
                { 
                    bookingID: 2, 
                    customerID: 2, 
                    carID: 3, 
                    rentalStartDate: "2024-07-01", 
                    rentalEndDate: "2024-07-10", 
                    totalAmount: "200.00" 
                }
            ];
            
            (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(bookings);

            const result = await getBookingService();
            expect(result).toEqual(bookings);
        });

        it("should return empty array if no bookings", async () => {
            (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
            const result = await getBookingService();
            expect(result).toEqual([]);
        });
    });

    describe("getBookingByIdService", () => {
        it("should return a booking by ID", async () => {
            const booking = {
                bookingID: 1,
                customerID: 1,
                carID: 2,
                rentalStartDate: "2024-06-01",
                rentalEndDate: "2024-06-10",
                totalAmount: "100.00"
            };
            
            (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(booking);

            const result = await getBookingByIdService(1);
            expect(db.query.BookingsTable.findFirst).toHaveBeenCalled();
            expect(result).toEqual(booking);
        });

        it("should return null if no booking is found", async () => {
            (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
            const result = await getBookingByIdService(9999);
            expect(result).toBeNull();
        });
    });

    describe("updateBookingService", () => {
        it("should update a booking and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(null)
                })
            });

            const result = await updateBookingService(1, {
                customerID: 1,
                carID: 2,
                rentalStartDate: "2024-06-01",
                rentalEndDate: "2024-06-10",
                totalAmount: "100.00"
            });

            expect(db.update).toHaveBeenCalledWith(BookingsTable);
            expect(result).toBe("Booking updated successfully");
        });
    });

    describe("deleteBookingService", () => {
        it("should delete a booking and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            });

            const result = await deleteBookingService(1);
            expect(db.delete).toHaveBeenCalledWith(BookingsTable);
            expect(result).toBe("Booking deleted successfully");
        });
    });
});