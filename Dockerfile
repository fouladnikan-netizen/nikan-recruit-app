# مرحله 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# مرحله 2: Builder
FROM base AS builder
WORKDIR /app
COPY . .
# اینجا مطمئن می‌شویم prisma در کانتینرِ بیلد وجود دارد
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# مرحله 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
# کپی کردنِ نتیجه بیلد و فایل‌های مورد نیاز
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

CMD ["npm", "start"]
