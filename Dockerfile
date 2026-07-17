# استفاده از نسخه سبک Node.js
FROM node:20-alpine AS base

# نصب پکیج‌ها
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ساخت پروژه
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# مرحله اجرا (نهایی)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "start"]
