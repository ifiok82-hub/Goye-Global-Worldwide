# Production Dockerfile for GOYE Global Cloud Run Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full application source
COPY . .

# Build Vite frontend and bundled Node server
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled build assets and server bundle
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/assets ./assets

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
