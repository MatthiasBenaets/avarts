FROM node:18-alpine as builder
WORKDIR /kit
COPY . .
RUN npm install
RUN npm run build && npm prune --production

FROM node:18-alpine as express
WORKDIR /app
COPY --from=builder /kit/build /app/build
COPY --from=builder /kit/db /app/db
COPY --from=builder /kit/server.js /app/server.js
COPY --from=builder /kit/package.json /app/package.json
COPY --from=builder /kit/package-lock.json /app/package-lock.json
RUN npm install express

EXPOSE 8080 8090
CMD ["sh", "-c", "node server.js & /app/db/pocketbase serve --http=0.0.0.0:8090"]
