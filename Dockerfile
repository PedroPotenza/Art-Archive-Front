FROM node:18.20.4-alpine3.19
RUN apk add --no-cache libc6-compat

WORKDIR /app
# COPY package.json package-lock.json next.config.mjs next-env.d.ts postcss.config.js tailwind.config.js tsconfig.json tsconfig.node.json ./

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN npm update && npm ci --omit=dev

RUN npm run build



ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL="https://artarchive.art.br/"
COPY ./.env.production ./

EXPOSE 3000

COPY src src/

CMD [ "npm", "run", "start" ]