

FROM quay.io/fentas/nodejs:latest

RUN mkdir /opt
COPY . /opt

RUN \
  cd /opt && \
  chmod +x index.js && \
  npm install

ENTRYPOINT /opt/index.js
