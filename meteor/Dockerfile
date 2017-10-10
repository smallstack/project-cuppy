FROM node:4.8

ENV APP_DIR /home/app

# extract bundle
RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}
ADD ./meteor.tar.gz .

# install meteor dependencies
WORKDIR ${APP_DIR}/bundle/programs/server
RUN npm install

# install runtime dependencies
RUN npm install -g forever


CMD forever --minUptime 1000 --spinSleepTime 1000 ${APP_DIR}/bundle/main.js

EXPOSE 8080