FROM alpine:latest AS builder

WORKDIR /hugo
RUN apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community git hugo && \
  git clone https://github.com/taoofshawn/shawndo.com.git /hugo && \
  hugo

FROM nginx:latest AS runner
COPY --from=builder /hugo/public /usr/share/nginx/html
