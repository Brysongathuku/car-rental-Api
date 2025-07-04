import db from "../../src/Drizzle/db";
import { InsuranceTable } from "../../src/Drizzle/schema";
import { createInsuranceService, getInsuranceByIdService } from "../../src/insurance/insurance.services"


jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn()
}))




beforeEach(() => {
    jest.clearAllMocks()
})


describe('Insurance service', () => {

    describe('createInsuranceService', () => {
        it('should insert a new insurance', async() => {
            const insurance = {
                carID: 1,
                insuranceProvider: "Britam",
                policyNumber: "AERT234",
                startDate: '2023-01-01',
                endDate: '2023-01-05'
        };

        const insertedInsurance = {insuranceID: 1, ...insurance};
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedInsurance])
            })

        });

        const result = await createInsuranceService(insurance)
        expect(db.insert).toHaveBeenCalledWith(InsuranceTable)
        expect(result).toEqual("Insurance added successfully")



        })


        it("should return null if insertion fails", async() => {

            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockReturnValueOnce([null]) 
                })
            })


        
        })
    })


    

    describe("getinsuranceByIdService", () => {
    it("should return a insurance by ID", async () => {
       const insurance = {
                carID: 1,
                insuranceProvider: "Britam",
                policyNumber: "AERT234",
                startDate: '2023-01-01',
                endDate: '2023-01-05'
        };
        (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(insurance);
        const result = await getInsuranceByIdService(1);
        expect(db.query.InsuranceTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(insurance);
    });

    it('should return null if no insurance is found', async () => {
        (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
        const result = await getInsuranceByIdService(9999);
        expect(result).toBeNull();
    })

})







})