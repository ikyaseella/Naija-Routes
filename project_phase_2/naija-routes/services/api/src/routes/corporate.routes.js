import express from 'express';
import { CorporateService } from '../services/corporate.service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const list = await CorporateService.listCorporates();
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const corp = await CorporateService.getCorporate(req.params.id);
    res.json({ success: true, data: corp });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/dashboard', async (req, res, next) => {
  try {
    const dash = await CorporateService.getCorporateDashboard(req.params.id);
    res.json({ success: true, data: dash });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/departments', async (req, res, next) => {
  try {
    const depts = await CorporateService.getDepartments(req.params.id);
    res.json({ success: true, data: depts });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/employees', async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    const employees = await CorporateService.getEmployees(req.params.id, departmentId);
    res.json({ success: true, data: employees });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/policy', async (req, res, next) => {
  try {
    const policy = await CorporateService.getPolicy(req.params.id);
    if (!policy) return res.status(404).json({ error: 'No travel policy configured' });
    res.json({ success: true, data: policy });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.post('/:id/bookings', async (req, res, next) => {
  try {
    const { departmentId, employeeId, scheduleId, route, operator, seats, travelDate, passengerNames } = req.body;
    if (!departmentId || !employeeId || !scheduleId || !seats || !travelDate) {
      return res.status(400).json({ error: 'Missing required fields: departmentId, employeeId, scheduleId, seats, travelDate' });
    }
    const booking = await CorporateService.bulkBook({
      corporateId: req.params.id, departmentId, employeeId, scheduleId, route,
      operator, seats, travelDate, passengerNames,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    if (err.message.includes('policy limit') || err.message.includes('No travel policy')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/bookings', async (req, res, next) => {
  try {
    const { status } = req.query;
    const bookings = await CorporateService.getBookings(req.params.id, status);
    res.json({ success: true, data: bookings });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/invoices', async (req, res, next) => {
  try {
    const invoices = await CorporateService.getInvoices(req.params.id);
    res.json({ success: true, data: invoices });
  } catch (err) {
    if (err.message === 'Corporate account not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/:id/invoices/:invoiceId', async (req, res, next) => {
  try {
    const invoice = await CorporateService.getInvoice(req.params.invoiceId);
    if (invoice.corporate_id !== req.params.id) return res.status(404).json({ error: 'Invoice not found for this corporate' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    if (err.message === 'Invoice not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.patch('/bookings/:bookingId/approve', async (req, res, next) => {
  try {
    const booking = await CorporateService.approveBooking(req.params.bookingId);
    res.json({ success: true, data: booking });
  } catch (err) {
    if (err.message === 'Booking not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('not pending approval')) return res.status(409).json({ error: err.message });
    next(err);
  }
});

router.patch('/bookings/:bookingId/cancel', async (req, res, next) => {
  try {
    const booking = await CorporateService.cancelBooking(req.params.bookingId);
    res.json({ success: true, data: booking });
  } catch (err) {
    if (err.message === 'Booking not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('already cancelled')) return res.status(409).json({ error: err.message });
    next(err);
  }
});

export default router;
