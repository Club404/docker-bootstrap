FROM scratch

ENV WWW_DIR=/tmp/www

ADD ./bin /bin
ADD ./www ${WWW_DIR}
VOLUME ${WWW_DIR}

CMD ["/bin/start"]