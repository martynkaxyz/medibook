-- Dane testowe MediBook
-- Hash ponizej odpowiada haslu: Test1234!

-- Uzytkownicy (20 rekordow)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@medibook.pl',         '$2b$12$W5LVqwAngyHjWVkTTo45HuE73hL7RFVVGNy506vucQEVm21GHZ4Cu', 'Admin',     'MediBook',     'admin'),
('nela.wysocka@medibook.pl',  '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Nela',      'Wysocka',      'doctor'),
('maja.lewandowska@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Maja',      'Lewandowska',  'patient'),
('jan.kowalski@gmail.com',    '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Jan',       'Kowalski',     'patient'),
('anna.nowak@gmail.com',      '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Anna',      'Nowak',        'patient'),
('piotr.wisniewski@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Piotr',     'Wisniewski',   'patient'),
('katarzyna.wojcik@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Katarzyna', 'Wójcik',       'patient'),
('tomasz.kaminski@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Tomasz',    'Kamiński',     'patient'),
('agnieszka.zielinska@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy','Agnieszka','Zielińska',  'patient'),
('marek.szymanski@gmail.com', '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Marek',     'Szymański',    'patient'),
('ewa.dabrowska@gmail.com',   '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Ewa',       'Dąbrowska',    'patient'),
('robert.wozniak@gmail.com',  '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Robert',    'Woźniak',      'patient'),
('monika.kozlowska@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Monika',    'Kozłowska',    'patient'),
('lukasz.jankowski@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Łukasz',    'Jankowski',    'patient'),
('barbara.mazur@gmail.com',   '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Barbara',   'Mazur',        'patient'),
('adam.wojcik@gmail.com',     '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Adam',      'Wójcik',       'patient'),
('zofia.krawczyk@gmail.com',  '$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Zofia',     'Krawczyk',     'patient'),
('krzysztof.piotrowsk@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy','Krzysztof','Piotrowski', 'patient'),
('magdalena.grabowska@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy','Magdalena','Grabowska',  'patient'),
('pawel.nowakowski@gmail.com','$2b$12$0kgV56r9nqAaY9Q3CQ0uge3vb1dwkeYdQQT8tJ6qCFlK6GhNnPoiy', 'Paweł',     'Nowakowski',   'patient');

-- Doktor (1 rekord)
INSERT INTO doctors (user_id, specialty) VALUES (2, 'Medycyna ogólna');

-- Uslugi (5 rekordow)
INSERT INTO services (name, duration_minutes, is_active) VALUES
('Konsultacja ogólna',  30, true),
('Badanie EKG',         30, true),
('Badanie kontrolne',   45, true),
('Pomiar ciśnienia',    15, true),
('Konsultacja online',  20, true);

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

-- Rezerwacje (20 rekordow)
INSERT INTO appointments (patient_id, slot_id, status, notes) VALUES
(3,  1,  'confirmed',  null),
(3,  2,  'pending',    null),
(4,  4,  'confirmed',  null),
(5,  6,  'cancelled',  null),
(6,  8,  'completed',  null),
(3,  10, 'pending',    null),
(7,  3,  'confirmed',  null),
(8,  5,  'pending',    null),
(9,  7,  'confirmed',  null),
(10, 9,  'completed',  null),
(11, 11, 'cancelled',  null),
(12, 12, 'confirmed',  null),
(13, 13, 'pending',    null),
(14, 14, 'confirmed',  null),
(15, 15, 'completed',  null),
(16, 16, 'pending',    null),
(17, 17, 'confirmed',  null),
(18, 18, 'cancelled',  null),
(19, 19, 'pending',    null),
(20, 20, 'confirmed',  null);

-- Oznacz zajete sloty jako niedostepne
UPDATE time_slots SET is_available = false
WHERE id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20);

-- Uslugi przy rezerwacjach (20 rekordow)
INSERT INTO appointment_services (appointment_id, service_id) VALUES
(1,  1),
(2,  2),
(3,  1),
(4,  3),
(5,  2),
(6,  1),
(7,  4),
(8,  1),
(9,  3),
(10, 2),
(11, 5),
(12, 1),
(13, 4),
(14, 2),
(15, 3),
(16, 1),
(17, 5),
(18, 2),
(19, 1),
(20, 3);
