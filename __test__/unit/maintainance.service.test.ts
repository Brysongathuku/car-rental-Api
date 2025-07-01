import {createMaintenanceService,getMaintenanceService,getMaintenanceByIdService,updateMaintenanceService,deleteMaintenanceService} from '../../src/maintainance/maintainance.services';
import db from '../../src/Drizzle/db';
import {MaintenanceTable} from '../../src/Drizzle/schema';
 jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        MaintenanceTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    }
}))
  beforeEach(() => {
    jest.clearAllMocks()
  });
   describe('createMaintenanceService', () => {
    it('should insert a new maintenance record', async () => {
        const maintenance = {
            carID: 1,
            maintenanceDate: '2024-06-01',
            description: 'Oil change',
            cost: '50.00'
        };
        const insertedMaintenance = { maintenanceID: 1, ...maintenance };
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedMaintenance])
            })
        });
        const result = await createMaintenanceService(maintenance);
        expect(db.insert).toHaveBeenCalledWith(MaintenanceTable);
        expect(result).toEqual("Maintenance added successfully");
    });

    it("should return null if insertion fails", async() => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([undefined])
            })
        });
    });
    
    describe("getMaintenanceService", () => {
        it("should return all maintenance records", async() => {
            const maintenances = [
                { maintenanceID: 1, carID: 1, maintenanceDate: '2024-06-01', description: 'Oil change', cost: '50.00' },
                { maintenanceID: 2, carID: 2, maintenanceDate: '2024-06-02', description: 'Tire rotation', cost: '30.00' }
            ];
            (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValue(maintenances);
            const result = await getMaintenanceService();
            expect(result).toEqual(maintenances);
        });
    });

    describe("getMaintenancesByIdService", () => {
        it("should return a maintenance by ID", async () => {
            const maintenance = {
                  maintenanceID: 2, carID: 2, maintenanceDate: '2024-06-02', description: 'Tire rotation', cost: '30.00' 
            };

            (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValue(maintenance);

            const result = await getMaintenanceByIdService(1);
            expect(db.query.MaintenanceTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(maintenance)
        })
        it('should  return null if no car is found',async()=>{
            (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await getMaintenanceByIdService(1);
           
            expect(result).toBeNull();
        })
    });

    describe("updateMaintenanceByIdService", () => {
    it("should update a  maintenance and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(null)
            })
        })
        const result = await updateMaintenanceService(1,        { maintenanceID: 1, carID: 1, maintenanceDate: '2024-06-01', description: 'gear change', cost: '50.00' },)
        expect(db.update).toHaveBeenCalledWith(MaintenanceTable)
        expect(result).toBe("maintenance updated successfully")
    })
})
describe("deleteMaintenanceService", () => {
    it("should delete a maintenance and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockResolvedValueOnce(undefined)
        })
        const result = await deleteMaintenanceService(1);
        expect(db.delete).toHaveBeenCalledWith(MaintenanceTable)
        expect(result).toBe("Car deleted successfully");
    })
})
   
   })