import {
  createLocationService,
  getLocationService,
  getLocationByIdService,
  getLocationWithCarsService,
  updateLocationService,
  deleteLocationService
} from '../../src/location/location.services';

import db from '../../src/Drizzle/db';
import { LocationTable } from '../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';

// Mock db
jest.mock('../../src/Drizzle/db', () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    LocationTable: {
      findFirst: jest.fn()
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Location Services', () => {

  describe('createLocationService', () => {
    it('should create a location and return success message', async () => {
      const location = {
        locationID: 1,
        locationName: "Meru Center",
        address: "Meru Town",
        contactNumber: "0700000000"
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([location])
        })
      });

      const result = await createLocationService(location);
      expect(db.insert).toHaveBeenCalledWith(LocationTable);
      expect(result).toBe("Location added successfully");
    });
  });

  describe('getLocationService', () => {
    it('should return all locations', async () => {
      const locations = [
        { locationID: 1, locationName: "Meru", address: "Meru Town", contactNumber: "0700000000" },
        { locationID: 2, locationName: "Nairobi", address: "CBD", contactNumber: "0711000000" }
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValueOnce(locations)
      });

      const result = await getLocationService();
      expect(result).toEqual(locations);
    });
  });

  describe('getLocationByIdService', () => {
    it('should return a location by ID', async () => {
      const location = {
        locationID: 1,
        locationName: "Meru",
        address: "Meru Town",
        contactNumber: "0700000000"
      };

      (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValue(location);

      const result = await getLocationByIdService(1);
      expect(result).toEqual(location);
    });

    it('should return null if location not found', async () => {
      (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getLocationByIdService(99);
      expect(result).toBeNull();
    });
  });

  describe('getLocationWithCarsService', () => {
    it('should return a location with its cars', async () => {
      const locationWithCars = {
        locationName: "Meru",
        address: "Meru Town",
        contactNumber: "0700000000",
        cars: [
          {
            carID: 1,
            carModel: "Toyota",
            color: "White",
            rentalRate: "1000.00",
            availability: true
          }
        ]
      };

      (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValue(locationWithCars);

      const result = await getLocationWithCarsService(1);
      expect(result).toEqual(locationWithCars);
    });
  });

  describe('updateLocationService', () => {
    it('should update a location and return success message', async () => {
      const updated = {
        locationName: "Updated Center",
        address: "Updated Address",
        contactNumber: "0722000000"
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updated])
          })
        })
      });

      const result = await updateLocationService(1, updated);
      expect(result).toBe("Location updated successfully");
    });
  });

  describe('deleteLocationService', () => {
    it('should delete a location and return deleted object', async () => {
      const deleted = {
        locationID: 1,
        locationName: "Deleted Center",
        address: "Somewhere",
        contactNumber: "0700000000"
      };

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([deleted])
        })
      });

      const result = await deleteLocationService(1);
      expect(result).toEqual(deleted);
    });
  });

});
