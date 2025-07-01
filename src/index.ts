import express from 'express';
import cors from 'cors'; // ✅ Import CORS

import customer from './auth/auth.routers';
import location from './location/location.routers';
import car from './car/car.routers';
import booking from './booking/booking.routers';
import reservation from './reservation/reservation.routers';
import payment from './payment/payment.routers';
import insurance from './insurance/insurance.routers';
import maintenance from './maintainance/maintainance.routers';

const initilizeApp = () => {
  const app = express();

  app.use(cors()); // ✅ Enable CORS for all incoming requests
  app.use(express.json());

  // routes
  customer(app);
  location(app);
  car(app);
  booking(app);
  reservation(app);
  payment(app);
  insurance(app);
  maintenance(app);

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  return app;
};

const app = initilizeApp();
export default app;
