#!/bin/bash
ADMIN_EMAIL=ben@mindsparkdigitallabs.com ADMIN_PASSWORD=C.c.f.c.10 npx dotenv -e .env.local -- tsx src/scripts/seed-blog-data-auth.ts