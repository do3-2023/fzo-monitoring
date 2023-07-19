FROM denoland/deno:distroless-1.34.3

WORKDIR /target
COPY main.ts /target/main.ts

LABEL org.opencontainers.image.source="https://github.com/do3-2023/fzo-kube"

CMD ["run", "--allow-env", "--allow-net", "--allow-sys", "main.ts"]
