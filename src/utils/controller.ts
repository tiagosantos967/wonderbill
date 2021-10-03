import express, { Router } from 'express';
import { Service } from './service';

export const expressController = <T>(service: Service<T>): Router => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const result = await service.create(req.body);
      res.send(result)
    } catch( error ) {
      res.statusCode = 500;
      res.send(error || 'Internal Server Error');
    }
  });

  return router;
}