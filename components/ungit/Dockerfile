FROM node:6-slim

RUN apt-get update && apt-get install -y git ssh --no-install-recommends

RUN npm install ungit -g

RUN useradd ungit -m

USER ungit

VOLUME ["/var/www"]

EXPOSE 8448
ENV SERVICE_NAME ungit
ENV SERVICE_TAGS app
CMD ["ungit", "--no-launchBrowser", "--forcedLaunchPath=/var/www"]