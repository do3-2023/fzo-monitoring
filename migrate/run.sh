migrate \
    -path /migrations/ \
    -database postgres://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}?sslmode=disable \
    up
