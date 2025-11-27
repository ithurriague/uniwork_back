# Branch Overview

## Main

Primary, stable branch in the repository.  
Protected by: **pull requests**, **peer review rules**, **automated tests**.  
All changes are merged here only after approval and passing checks.

# Run

1. Create configurations: `.env` `.firebase.json`
2. Run containers: `docker compose up -d`
3. Run migrations: `npm run migrate:up`
4. Run seeders: `npm run seed:prod && npm run seed:dev`
5. Optional - Login: `npm run tools:login` this will print a firebase token if both the backend and frontend credentials are valid
6. Optional - Docs: Import postman collection under `doc/uniwork.postman_collection.json`