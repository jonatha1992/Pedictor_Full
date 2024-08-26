
-- Insert dummy data into Users table
INSERT INTO users (name, email, password)
VALUES 
('Juan Pérez', 'juan.perez@example.com', 'password123'),
('Ana Gómez', 'ana.gomez@example.com', 'password123'),
('Luis Martínez', 'luis.martinez@example.com', 'password123'),
('María Rodríguez', 'maria.rodriguez@example.com', 'password123'),
('Carlos Fernández', 'carlos.fernandez@example.com', 'password123');

-- Insert dummy data into Licenses table
INSERT INTO licenses (key, date_expiration, user_id)
VALUES 
('ABC123', '2025-12-31', 1),
('DEF456', '2024-11-30', 2),
('GHI789', '2026-01-01', 3),
('JKL012', '2023-09-15', 4),
('MNO345', '2025-06-30', 5);

-- Insert dummy data into Reports table
INSERT INTO reports (user_id, game, game_datetime, predicted, total_hits, predicted_hits, 
    v1l, v2l, v3l, v4l, numbers_to_predict, previous_numbers, neighbor_count, game_limit, probability, effectiveness, 
    roulette, description)
VALUES 
(1, 'Roulette 1', '2023-07-21 10:00:00', 100, 50, 25, 5, 3, 2, 1, 10, 5, 3, 100, 0.8, 0.75, 'RouletteX', 'Test report 1'),
(2, 'Roulette 2', '2023-07-22 11:00:00', 150, 75, 35, 10, 5, 3, 2, 12, 6, 4, 120, 0.85, 0.8, 'RouletteY', 'Test report 2'),
(3, 'Roulette 3', '2023-07-23 12:00:00', 200, 100, 50, 15, 8, 4, 3, 15, 8, 5, 140, 0.9, 0.85, 'RouletteZ', 'Test report 3'),
(4, 'Roulette 4', '2023-07-24 13:00:00', 120, 60, 30, 7, 4, 2, 1, 9, 4, 3, 110, 0.75, 0.7, 'RouletteA', 'Test report 4'),
(5, 'Roulette 5', '2023-07-25 14:00:00', 180, 90, 45, 12, 6, 3, 2, 11, 5, 4, 130, 0.8, 0.75, 'RouletteB', 'Test report 5');