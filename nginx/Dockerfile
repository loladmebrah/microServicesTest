FROM nginx:alpine
LABEL maintainer="Andres Vasquez" \
      version="1.0"
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY /conf/*.conf /etc/nginx/conf.d/
