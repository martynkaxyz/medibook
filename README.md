# MediBook 🏥
System rezerwacji wizyt lekarskich online

## Demo
- **Frontend:** https://medibook-amber.vercel.app
- **Backend API:** https://medibook-production-c1ec.up.railway.app/api/health

## Stos technologiczny
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express
- Baza danych: PostgreSQL 16

## Wymagania systemowe
- Node.js v20 LTS
- PostgreSQL 16
- npm 9+

## Instalacja

### 1. Klonowanie repozytorium
```
git clone https://github.com/martynkaxyz/medibook.git
cd medibook
```

### 2. Backend
```
cd backend
npm install
cp .env.example .env
```

### 3. Frontend
```
cd ../frontend
npm install
```

## Konfiguracja .env
Stwórz plik `backend/.env` na podstawie `backend/.env.example`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medibook
DB_USER=postgres
DB_PASS=TWOJE_HASLO
JWT_SECRET=min_32_znakowy_losowy_string
PORT=3000
```

## Baza danych
```
psql -U postgres -c "CREATE DATABASE medibook;"
psql -U postgres -d medibook -f database/schema.sql
psql -U postgres -d medibook -f database/seed.sql
```

## Uruchomienie

### Backend (port 3000)
```
cd backend
npm run dev
```

### Frontend (port 5173)
```
cd frontend
npm run dev
```

Otwórz: http://localhost:5173

## Dane testowe
| Rola | Email | Hasło |
|------|-------|-------|
| Admin | admin@medibook.pl | Admin123! |
| Lekarz | nela.wysocka@medibook.pl | Doctor123! |
| Pacjent | maja.lewandowska@gmail.com | Patient123! |