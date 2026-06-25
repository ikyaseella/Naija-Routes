-- 002_seed_routes.sql
-- Description: Seeds the database with mock operators, routes, and schedules for Phase 1 MVP.

-- Note: We assume the roles 'traveller', 'agent', 'operator', and 'admin' exist.

BEGIN;

-- 1. Insert Operators
INSERT INTO operators (id, name, registration_no, nin_verified, rating_avg, states_served)
VALUES 
  ('op-guo', 'GUO Transport', 'RC-12345', true, 4.5, ARRAY['Lagos', 'Abuja', 'Enugu', 'Anambra']),
  ('op-abc', 'ABC Transport', 'RC-67890', true, 4.8, ARRAY['Lagos', 'Abuja', 'Rivers']),
  ('op-peace', 'Peace Mass Transit', 'RC-11223', true, 4.2, ARRAY['Enugu', 'Anambra', 'Abuja'])
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Routes
INSERT INTO routes (id, operator_id, origin, destination, origin_state, dest_state, distance_km, duration_hrs)
VALUES 
  ('rt-guo-1', 'op-guo', 'Jibowu, Lagos', 'Utako, Abuja', 'Lagos', 'FCT', 750, 10.5),
  ('rt-guo-2', 'op-guo', 'Jibowu, Lagos', 'Onitsha', 'Lagos', 'Anambra', 480, 8.0),
  ('rt-abc-1', 'op-abc', 'Mazamaza, Lagos', 'Gwagwalada, Abuja', 'Lagos', 'FCT', 740, 11.5),
  ('rt-peace-1', 'op-peace', 'Utako, Abuja', 'Kano', 'FCT', 'Kano', 430, 6.5)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Vehicles
INSERT INTO vehicles (id, operator_id, plate_no, type, seats)
VALUES
  ('veh-guo-1', 'op-guo', 'KJA-123-XY', 'bus', 14), -- Toyota Hiace (Danfo)
  ('veh-guo-2', 'op-guo', 'APP-456-ZZ', 'bus', 14),
  ('veh-abc-1', 'op-abc', 'LSD-987-AA', 'minibus', 15), -- Sprinter
  ('veh-peace-1', 'op-peace', 'ABJ-789-BB', 'coaster', 28)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Schedules (For tomorrow)
INSERT INTO schedules (id, route_id, departure_time, days_of_week, base_price_kobo, vehicle_id, seats_total)
VALUES
  ('sch-guo-1', 'rt-guo-1', CURRENT_DATE + INTERVAL '1 day 06:30:00', ARRAY[1,2,3,4,5,6,7], 1250000, 'veh-guo-1', 14),
  ('sch-abc-1', 'rt-abc-1', CURRENT_DATE + INTERVAL '1 day 07:00:00', ARRAY[1,2,3,4,5,6,7], 1100000, 'veh-abc-1', 15),
  ('sch-guo-2', 'rt-guo-2', CURRENT_DATE + INTERVAL '1 day 09:00:00', ARRAY[1,2,3,4,5,6,7], 900000, 'veh-guo-2', 14),
  ('sch-peace-1', 'rt-peace-1', CURRENT_DATE + INTERVAL '1 day 12:00:00', ARRAY[1,2,3,4,5,6,7], 750000, 'veh-peace-1', 28)
ON CONFLICT (id) DO NOTHING;

COMMIT;
