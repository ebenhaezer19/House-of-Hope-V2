import express from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Payment routes working',
    timestamp: new Date().toISOString()
  });
});

// CRUD routes
router.get('/', paymentController.getPayments);
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router;