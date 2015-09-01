FROM quay.io/fentas/nodejs:latest
MAINTAINER Jan Guth <jan.guth@gmail.com>

ENV HOST="0.0.0.0"
ENV CATTLE_ENDPOINT="http://127.0.0.1:8080"
ENV CATTLE_ACCESS=""
ENV CATTLE_SECRET=""

RUN mkdir /opt
COPY . /opt

RUN \
  cd /opt && \
  chmod +x index.js && \
  npm install

EXPOSE 8000
ENTRYPOINT ["/opt/index.js"]
