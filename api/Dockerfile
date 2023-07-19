FROM denoland/deno:alpine-1.34.3 as builder

WORKDIR /target
COPY . /target/
RUN deno bundle --no-check main.ts main.bundle.ts


FROM denoland/deno:distroless-1.34.3 as runner

WORKDIR /target
COPY --from=builder /target/main.bundle.ts .

LABEL org.opencontainers.image.source="https://github.com/do3-2023/fzo-kube"

CMD ["run", "--allow-env", "--allow-net", "main.bundle.ts"]
