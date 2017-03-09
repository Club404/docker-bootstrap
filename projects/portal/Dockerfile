FROM mhart/alpine-node:6.2.0

# Install the npm packages
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

ENV APP_DIR=/opt/app
RUN mkdir -p ${APP_DIR} && cp -a /tmp/node_modules ${APP_DIR}
ADD ./server.js ${APP_DIR}/server.js
ADD ./www ${APP_DIR}/www
VOLUME ${APP_DIR}
WORKDIR ${APP_DIR}

RUN cd ${APP_DIR} && npm install

CMD ["node", "server.js"]