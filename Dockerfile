FROM node:20-alpine AS base
WORKDIR /app

# ابتدا تمام فایل‌ها را کپی کنید تا پریزما و پکیج‌ها در دسترس باشند
COPY . .

# حالا npm install را اجرا کنید
RUN npm install

# اینجا مطمئن می‌شویم prisma در کانتینرِ بیلد وجود دارد
RUN npx prisma generate
RUN npm run build

# مرحله اجرا (نهایی)
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
