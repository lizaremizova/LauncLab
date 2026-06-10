# LaunchLab

LaunchLab ir platforma studentiem, jaunajiem speciālistiem un projektu autoriem, kas palīdz atrast komandas biedrus, publicēt projektus un veidot sadarbību starp cilvēkiem ar dažādām prasmēm.

## Projekta apraksts

Sistēmas mērķis ir izveidot vidi, kur lietotāji var:

- Reģistrēties un autorizēties sistēmā;
- Izveidot savu profilu;
- Publicēt projektus;
- Meklēt interesējošus projektus;
- Atrast komandas biedrus;
- Sazināties ar citiem lietotājiem.

## Izmantotās tehnoloģijas

### Frontend

- React
- CSS 

### Backend

- Laravel
- PHP
- MySQL

## Projekta struktūra

```
launchlab/
│
├── app/
├── routes/
├── database/
├── public/
│
├── frontend/
│   └── vite-project/
│       ├── src/
│       ├── public/
│       └── package.json
│
└── README.md
```

## Sistēmas uzstādīšana

### 1. Repozitorija klonēšana

```bash
git clone https://github.com/lizaremizova/LauncLab.git
cd LauncLab
```

### 2. Backend uzstādīšana

Instalēt Laravel atkarības:

```bash
composer install
```

Izveidot `.env` failu:

```bash
cp .env.example .env
```

Ģenerēt aplikācijas atslēgu:

```bash
php artisan key:generate
```

Veikt datubāzes migrācijas:

```bash
php artisan migrate
```

Palaist Laravel serveri:

```bash
php artisan serve
```

Backend būs pieejams:

```
http://127.0.0.1:8000
```

### 3. Frontend uzstādīšana

Pāriet uz frontend direktoriju:

```bash
cd frontend/vite-project
```

Instalēt atkarības:

```bash
npm install
```

Palaist izstrādes serveri:

```bash
npm run dev
```

Frontend būs pieejams:

```
http://localhost:5173
```

## Datubāze

Projektā tiek izmantota MySQL datubāze.

Pirms sistēmas palaišanas nepieciešams:

1. Izveidot datubāzi MySQL serverī;
2. Norādīt pieslēguma parametrus `.env` failā:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=launchlab
DB_USERNAME=root
DB_PASSWORD=
```

## Funkcionalitāte

### Lietotāji

- Reģistrācija
- Autorizācija
- Profila pārvaldība

### Projekti

- Projekta izveide
- Projektu apskate
- Projektu meklēšana

### Komandas

- Komandas biedru meklēšana
- Pieteikšanās projektam
- Sadarbības organizēšana
