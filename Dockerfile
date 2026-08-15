# Tiranga Taar — static site, served by nginx
FROM nginx:1.27-alpine

# custom nginx config (gzip, cache headers, SPA-safe fallback)
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# site files
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
