FROM alpine:3.4

ENV NODE_ENV "production"
ENV WWW_DIR "/usr/local/shuttle/dist/"
ENV SSL_PREFIX "/etc/letsencrypt/live/shuttlenote.com/"
ENV SSL_KEY_FILE "privkey.pem"
ENV SSL_CERT_FILE "fullchain.pem"
ENV JWT_TOKEN_FILE "/usr/local/shuttle/data/ssl/jwttoken.txt"
ENV EMAIL_TOKEN_FILE "/usr/local/shuttle/data/ssl/emailtoken.txt"

WORKDIR /usr/local/shuttle
ADD . /usr/local/shuttle
ADD data/letsencrypt /etc/letsencrypt/live/shuttlenote.com
RUN apk update \
    && apk add --no-cache --virtual .build-deps g++ gcc git make \
    && apk add certbot nodejs supervisor \
    && mkdir /usr/local/shuttle/dist \
    && npm install -g node-gyp webpack@1.13.3 \
    && npm install --production \
    && npm run productiondist \
    && npm cache clean \
    && npm uninstall -g npm \
    && apk del .build-deps

EXPOSE 80 443

CMD supervisord -c /usr/local/shuttle/supervisord.conf

