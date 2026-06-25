const OPERATORS = {
  'op-abc': { name: 'ABC Transport Ltd', routes: ['Lagos', 'Abuja', 'Ibadan', 'Kano'] },
  'op-gu001': { name: 'GUO Transport', routes: ['Lagos', 'Abuja', 'Enugu', 'Port Harcourt'] },
};

let cargoBookings = [
  {
    id: 'cgo-001',
    shipperId: 'usr-emeka',
    shipperName: 'Emeka Okonkwo',
    shipperPhone: '08031234567',
    operatorId: 'op-abc',
    operatorName: 'ABC Transport Ltd',
    origin: 'Lagos',
    destination: 'Abuja',
    travelDate: '2026-06-25',
    weightKg: 15.5,
    description: 'Box of electronics — laptop, tablet, charger',
    waybillNo: 'NR-20260625-A7F3',
    status: 'confirmed',
    recipientName: 'Chisom Okafor',
    recipientPhone: '08079876543',
    priceKobo: 550000,
    createdAt: '2026-06-24T08:00:00Z',
    updatedAt: '2026-06-24T08:00:00Z',
  },
  {
    id: 'cgo-002',
    shipperId: 'usr-fatima',
    shipperName: 'Fatima Bello',
    shipperPhone: '08099887766',
    operatorId: 'op-abc',
    operatorName: 'ABC Transport Ltd',
    origin: 'Kano',
    destination: 'Lagos',
    travelDate: '2026-06-26',
    weightKg: 8.0,
    description: 'Kano spices and dried pepper for trade fair',
    waybillNo: 'NR-20260626-B8G4',
    status: 'pending',
    recipientName: 'Amina Suleiman',
    recipientPhone: '08055443322',
    priceKobo: 320000,
    createdAt: '2026-06-24T10:30:00Z',
    updatedAt: '2026-06-24T10:30:00Z',
  },
  {
    id: 'cgo-003',
    shipperId: 'usr-chisom',
    shipperName: 'Chisom Eze',
    shipperPhone: '08044556677',
    operatorId: 'op-gu001',
    operatorName: 'GUO Transport',
    origin: 'Enugu',
    destination: 'Port Harcourt',
    travelDate: '2026-06-27',
    weightKg: 22.0,
    description: 'Construction documents and samples',
    waybillNo: 'NR-20260627-C9H5',
    status: 'in_transit',
    recipientName: 'Emeka Nnamdi',
    recipientPhone: '08033221100',
    priceKobo: 420000,
    createdAt: '2026-06-23T14:00:00Z',
    updatedAt: '2026-06-24T06:00:00Z',
  },
  {
    id: 'cgo-004',
    shipperId: 'usr-david',
    shipperName: 'David Mark',
    shipperPhone: '08011223344',
    operatorId: 'op-abc',
    operatorName: 'ABC Transport Ltd',
    origin: 'Lagos',
    destination: 'Ibadan',
    travelDate: '2026-06-24',
    weightKg: 5.0,
    description: 'Documents and packaged goods',
    waybillNo: 'NR-20260624-D1I6',
    status: 'delivered',
    recipientName: 'Tunde Bakare',
    recipientPhone: '08077665544',
    priceKobo: 150000,
    createdAt: '2026-06-23T09:00:00Z',
    updatedAt: '2026-06-24T12:00:00Z',
  },
];

export class CargoService {

  static async createBooking({ shipperId, shipperName, shipperPhone, operatorId, origin, destination, travelDate, weightKg, description, recipientName, recipientPhone }) {
    const operator = OPERATORS[operatorId];
    if (!operator) throw new Error('Invalid operator');

    if (weightKg <= 0 || weightKg > 500) throw new Error('Weight must be between 1 and 500 kg');

    if (!recipientName || !recipientPhone) throw new Error('Recipient name and phone are required');

    const dateStr = travelDate.replace(/-/g, '');
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const waybillNo = `NR-${dateStr}-${suffix}`;

    const pricePerKg = 20000;
    const priceKobo = Math.round(weightKg * pricePerKg);

    const booking = {
      id: `cgo-${Date.now()}`,
      shipperId,
      shipperName,
      shipperPhone,
      operatorId,
      operatorName: operator.name,
      origin,
      destination,
      travelDate,
      weightKg,
      description,
      waybillNo,
      status: 'pending',
      recipientName,
      recipientPhone,
      priceKobo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cargoBookings.push(booking);
    return booking;
  }

  static async getBookingByWaybill(waybillNo) {
    return cargoBookings.find(b => b.waybillNo === waybillNo) || null;
  }

  static async getBookingById(id) {
    return cargoBookings.find(b => b.id === id) || null;
  }

  static async getUserBookings(userId) {
    return cargoBookings.filter(b => b.shipperId === userId);
  }

  static async getOperatorBookings(operatorId) {
    return cargoBookings.filter(b => b.operatorId === operatorId);
  }

  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);

    const booking = cargoBookings.find(b => b.id === id);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    return booking;
  }

  static async getOperators() {
    return Object.entries(OPERATORS).map(([id, op]) => ({ id, ...op }));
  }
}
