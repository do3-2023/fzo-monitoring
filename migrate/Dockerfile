FROM migrate/migrate:v4.17.1

RUN mkdir -p /migrations
COPY ./migrations /migrations
COPY ./run.sh /run.sh

ENTRYPOINT ["/bin/sh"]
CMD ["run.sh"]
