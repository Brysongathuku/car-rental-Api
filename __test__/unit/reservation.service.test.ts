import{
    createReservationService,
    getReservationService, getReservationByIdService,
    getReservationsByCustomerIdService,updateReservationService,deleteReservationService } from "../../src/reservation/reservation.services";

import db from "../../src/Drizzle/db"
import { ReservationTable,TIReservation } from "../../src/Drizzle/schema"

// Mock the modules 
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        ReservationTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Reservation Service", () => {
    describe("createReservationService", () => {
        it("should insert a reservation and return success message", async () => {
            const reservation = {
      
                customerID: 1,
                carID: 2,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-10",
                returnDate: "2024-06-15",
               
            };
            
            const insertedReservation = { reservationID: 1, ...reservation};
            
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedReservation])
                })
            });

            const result = await createReservationService(reservation);
            expect(db.insert).toHaveBeenCalledWith(ReservationTable);
            expect(result).toEqual("reservation added successfully");
        });

        it("should return null if insertion fails", async () => {
          

            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([undefined])
                })
            })

           
        });
    });
    describe("getReservationService", () => {
        it("should return all reservations", async () => {
            const reservations = [
                { reservationID: 1, customerID: 1, carID: 2, reservationDate: "2024-06-01", pickupDate: "2024-06-10", returnDate: "2024-06-15" },
                { reservationID: 2, customerID: 2, carID: 3, reservationDate: "2024-06-02", pickupDate: "2024-06-11", returnDate: "2024-06-16" }
            ];

            (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValue(reservations);

            const result = await getReservationService();
            expect(db.query.ReservationTable.findMany).toHaveBeenCalled();
            expect(result).toEqual(reservations);
        });
    });
    describe("getReservationByIdService", () => {
        it("should return a reservation by ID", async () => {
            const reservation = {
                reservationID: 1,
                customerID: 1,
                carID: 2,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-10",
                returnDate: "2024-06-15"
            };

            (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValue(reservation);

            const result = await getReservationByIdService(1);
            expect(db.query.ReservationTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(reservation)
        })
        it('should  return null if no car is found',async()=>{
            (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await getReservationByIdService(1);
           
            expect(result).toBeNull();
        })
    });

    describe("getReservationsByCustomerIdService", () => {
        it("should return reservations by customer ID", async () => {
            const reservations = [
                { reservationID: 1, customerID: 1, carID: 2, reservationDate: "2024-06-01", pickupDate: "2024-06-10", returnDate: "2024-06-15" },
                { reservationID: 2, customerID: 1, carID: 3, reservationDate: "2024-06-02", pickupDate: "2024-06-11", returnDate: "2024-06-16" }
            ];

            (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValue(reservations);

            const result = await getReservationsByCustomerIdService(1);
          
            expect(result).toEqual(reservations);
        });
    });
    describe("updateReservationService", () => {
        it("should update a reservation and return success message", async () => {
            const reservation = {
                customerID: 1,
                carID: 2,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-10",
                returnDate: "2024-06-15"
            };

            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce([reservation])
                })
            });

            const result = await updateReservationService(1, reservation);
            expect(db.update).toHaveBeenCalledWith(ReservationTable);
            expect(result).toEqual("Reservation updated successfully");
        });
    });
    describe("deleteReservationService", () => {
        it("should delete a reservation by ID and return the deleted reservation", async () => {
            const deletedReservation = {
                reservationID: 1,
                customerID: 1,
                carID: 2,
                reservationDate: "2024-06-01",
                pickupDate: "2024-06-10",
                returnDate: "2024-06-15"
            };

            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([deletedReservation])
                })
            });

            const result = await deleteReservationService(1);
            expect(db.delete).toHaveBeenCalledWith(ReservationTable);
            expect(result).toEqual("Reservation deleted successfully");
        });
    });

});