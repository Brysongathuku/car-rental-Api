import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIMaintenance, MaintenanceTable } from "../Drizzle/schema";

export const createMaintenanceService = async (maintenance: TIMaintenance) => {
  await db.insert(MaintenanceTable).values(maintenance).returning();
  return "Maintenance added successfully";
};

export const getMaintenanceService = async () => {
  const maintenances = await db.query.MaintenanceTable.findMany();
  return maintenances;
};

export const getMaintenanceByIdService = async (id: number) => {
  const maintenances = await db.query.MaintenanceTable.findFirst({
    where: eq(MaintenanceTable.maintenanceID, id),
  });
  return maintenances;
};

export const updateMaintenanceService = async (id: number, maintenance: TIMaintenance) => {
  await db.update(MaintenanceTable).set(maintenance).where(eq(MaintenanceTable.maintenanceID, id))
  return "maintenance updated successfully";
};

export const deleteMaintenanceService = async (id: number) => {
  const deleted = await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceID, id))
  return "Car deleted successfully";
};