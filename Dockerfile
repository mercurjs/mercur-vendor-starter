FROM node:lts-alpine AS builder

WORKDIR /app

COPY . /app/

RUN corepack enable
RUN yarn

RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]