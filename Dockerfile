

FROM quay.io/fentas/nodejs:latest

RUN mkdir /opt
ADD . /opt
RUN \
  cd /opt && \
  chmod +x index.js && \
  npm install

ENTRYPOINT /opt/index.js
