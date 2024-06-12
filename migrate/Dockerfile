FROM migrate/migrate:v4.17.1

RUN mkdir -p /migrations
COPY ./migrations /migrations

CMD ["sh", "-c", "migrate -path=/migrations/ -database postgres://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_DATABASE}?sslmode=disable up"]
