

FROM quay.io/fentas/nodejs:latest
MAINTAINER Jan Guth <jan.guth@gmail.com>

RUN mkdir /opt
COPY . /opt

RUN \
  cd /opt && \
  chmod +x index.js && \
  npm install

EXPOSE 8000
ENTRYPOINT /opt/index.js
