import { Express } from "express";
import {registerMaintenanceController, getMaintenanceByIdController, updateMaintenanceController, deleteMaintenanceController, getMaintenanceController} from "./maintainance.controllers";
import { adminRoleAuth, bothRoleAuth, userRoleAuth, } from '../middleware/bearAuth';

const maintenance = (app: Express) => {
  app.route("/maintenance/register").post(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await registerMaintenanceController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
app.route("/maintenances").get(
  bothRoleAuth,
  async (req, res, next) => {
    try {
      await getMaintenanceController(req, res);
    } catch (error: any) {
      next(error);
    }
  }
);

  app.route("/maintenance/:id").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getMaintenanceByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/maintenance/:id").put(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateMaintenanceController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/maintenance/:id").delete(
      adminRoleAuth,
    async (req, res, next) => {
    try {
      await deleteMaintenanceController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default maintenance;