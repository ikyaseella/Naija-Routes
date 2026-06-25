const CITIES = {
  lagos:     { name: 'Lagos',     lat: 6.5244,  lng: 3.3792 },
  abuja:     { name: 'Abuja',     lat: 9.0765,  lng: 7.3986 },
  ibadan:    { name: 'Ibadan',    lat: 7.3775,  lng: 3.9470 },
  kano:      { name: 'Kano',      lat: 12.0022, lng: 8.5920 },
  enugu:     { name: 'Enugu',     lat: 6.4483,  lng: 7.5132 },
  ph:        { name: 'Port Harcourt', lat: 4.8156, lng: 7.0498 },
  onitsha:   { name: 'Onitsha',   lat: 6.1411,  lng: 6.7859 },
  benin:     { name: 'Benin City', lat: 6.3350, lng: 5.6037 },
};

const FLEET = {
  'op-abc': [
    { id: 'veh-001', plate: 'LSD-481-KA', model: 'Toyota Hiace', route: ['lagos', 'abuja'], driver: 'Chidi Okafor' },
    { id: 'veh-002', plate: 'GGE-204-BD', model: 'Toyota Hiace', route: ['lagos', 'ibadan'], driver: 'Musa Bello' },
    { id: 'veh-003', plate: 'ABJ-119-XY', model: 'Mercedes Sprinter', route: ['abuja', 'kano'], driver: 'Suleiman Yusuf' },
    { id: 'veh-004', plate: 'LAG-775-WZ', model: 'Toyota Coaster', route: ['lagos', 'enugu'], driver: 'Emeka Nwosu' },
    { id: 'veh-005', plate: 'KNO-336-RT', model: 'Mercedes Sprinter', route: ['kano', 'abuja'], driver: 'Amina Hassan' },
  ],
  'op-gu001': [
    { id: 'veh-006', plate: 'ENU-510-MN', model: 'Toyota Hiace', route: ['enugu', 'onitsha'], driver: 'Ifeanyi Obi' },
    { id: 'veh-007', plate: 'PHC-829-QP', model: 'Toyota Coaster', route: ['ph', 'benin'], driver: 'David Mark' },
  ],
};

function interpolate(routeId, progress) {
  const coords = FLEET['op-abc'].concat(FLEET['op-gu001']).find(v => v.id === routeId);
  if (!coords || !coords.route) return null;
  const from = CITIES[coords.route[0]];
  const to = CITIES[coords.route[1]];
  if (!from || !to) return null;
  return {
    lat: from.lat + (to.lat - from.lat) * progress,
    lng: from.lng + (to.lng - from.lng) * progress,
  };
}

const VEHICLE_STATUSES = ['moving', 'stopped', 'arrived', 'departed', 'offline'];

export class TrackingService {

  static async getVehicleLocation(vehicleId) {
    const allVehicles = FLEET['op-abc'].concat(FLEET['op-gu001']);
    const vehicle = allVehicles.find(v => v.id === vehicleId);
    if (!vehicle) return null;

    const progress = Math.min(1, Math.max(0, ((Date.now() % 86400000) / 86400000) * 1.3 % 1));
    const pos = interpolate(vehicleId, progress);
    if (!pos) return null;

    const statusIndex = Math.floor((Date.now() / 120000) % VEHICLE_STATUSES.length);
    const status = VEHICLE_STATUSES[statusIndex];
    const speed = status === 'moving' ? Math.floor(40 + Math.random() * 40) : 0;

    return {
      vehicleId: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      driver: vehicle.driver,
      route: vehicle.route.map(c => CITIES[c].name),
      lat: pos.lat,
      lng: pos.lng,
      speedKmh: speed,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  static async getOperatorFleet(operatorId) {
    const vehicles = FLEET[operatorId] || [];
    const fleet = await Promise.all(vehicles.map(async (v) => {
      return this.getVehicleLocation(v.id);
    }));
    const counts = { moving: 0, stopped: 0, arrived: 0, departed: 0, offline: 0 };
    fleet.forEach(v => { if (v) counts[v.status]++; });
    return { fleet: fleet.filter(Boolean), counts };
  }

  static async getTrackingHistory(vehicleId, minutes = 30) {
    const vehicle = FLEET['op-abc'].concat(FLEET['op-gu001']).find(v => v.id === vehicleId);
    if (!vehicle) return [];

    const now = Date.now();
    const interval = 60000;
    const points = Math.floor(minutes * 60 * 1000 / interval);
    const history = [];

    const route = vehicle.route;
    const from = CITIES[route[0]];
    const to = CITIES[route[1]];

    for (let i = points; i >= 0; i--) {
      const time = new Date(now - i * interval);
      const baseProgress = ((time.getHours() * 60 + time.getMinutes()) / 1440) * 1.3 % 1;
      const jitter = (Math.random() - 0.5) * 0.002;
      history.push({
        lat: from.lat + (to.lat - from.lat) * baseProgress + jitter,
        lng: from.lng + (to.lng - from.lng) * baseProgress + jitter,
        speedKmh: Math.floor(30 + Math.random() * 50),
        eventType: i % 5 === 0 ? 'stopped' : 'moving',
        recordedAt: time.toISOString(),
      });
    }
    return history;
  }

  static async getAllActiveVehicles() {
    const all = FLEET['op-abc'].concat(FLEET['op-gu001']);
    const locations = await Promise.all(all.map(v => this.getVehicleLocation(v.id)));
    return locations.filter(Boolean);
  }
}
