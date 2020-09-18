FROM ubuntu:18.04
WORKDIR /opt/
COPY ./ServerBalance /opt/
CMD ['./ServerBalance']
