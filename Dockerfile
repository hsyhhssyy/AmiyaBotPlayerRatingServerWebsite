FROM nginx:latest

RUN rm -rf /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html

# 配置完全路由，供vue使用
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]