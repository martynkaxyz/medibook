-- Dane testowe MediBook

-- Uzytkownicy (4 rekordy)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@medibook.pl', '$2b$12$W5LVqwAngyHjWVkTTo45HuE73hL7RFVVGNy506vucQEVm21GHZ4Cu', 'Admin', 'MediBook', 'admin'),
('nela.wysocka@medibook.pl', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Nela', 'Wysocka', 'doctor'),
('maja.lewandowska@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Maja', 'Lewandowska', 'patient'),
('jan.kowalski@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Jan', 'Kowalski', 'patient'),
('anna.nowak@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Anna', 'Nowak', 'patient'),
('piotr.wisniewski@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Piotr', 'Wisniewski', 'patient');

-- Doktor (1 rekord)
INSERT INTO doctors (user_id, specialty) VALUES (2, 'Medycyna ogólna');

-- Uslugi (3 rekordy)
INSERT INTO services (name, duration_minutes, is_active) VALUES
('Konsultacja ogólna', 30, true),
('Badanie EKG', 30, true),
('Badanie kontrolne', 45, true);

-- Sloty (20 rekordow)
INSERT INTO time_slots (doctor_id, slot_date, start_time, end_time) VALUES
(1, '2026-06-01', '10:00', '10:30'),
(1, '2026-06-01', '11:00', '11:30'),
(1, '2026-06-01', '12:00', '12:45'),
(1, '2026-06-05', '09:00', '09:30'),
(1, '2026-06-05', '10:00', '10:30'),
(1, '2026-06-10', '09:00', '09:30'),
(1, '2026-06-10', '11:00', '11:30'),
(1, '2026-06-16', '11:00', '11:30'),
(1, '2026-06-16', '12:00', '12:45'),
(1, '2026-06-23', '14:00', '14:30'),
(1, '2026-06-23', '15:00', '15:30'),
(1, '2026-07-02', '09:00', '09:30'),
(1, '2026-07-07', '11:00', '11:30'),
(1, '2026-07-14', '10:00', '10:30'),
(1, '2026-07-16', '09:00', '09:30'),
(1, '2026-07-16', '11:00', '11:30'),
(1, '2026-07-21', '10:00', '10:30'),
(1, '2026-07-24', '09:00', '09:30'),
(1, '2026-07-28', '14:00', '14:30'),
(1, '2026-07-30', '10:00', '10:30');

-- Rezerwacje (6 rekordow)
INSERT INTO appointments (patient_id, slot_id, status, notes) VALUES
(3, 1, 'confirmed', null),
(3, 2, 'pending', null),
(4, 4, 'confirmed', null),
(5, 6, 'cancelled', null),
(6, 8, 'completed', null),
(3, 10, 'pending', null);

-- Uslugi przy rezerwacjach (6 rekordow)
INSERT INTO appointment_services (appointment_id, service_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 3),
(5, 2),
(6, 1);