FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:24-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built assets and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["npm", "start"]
