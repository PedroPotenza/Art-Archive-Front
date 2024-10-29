FROM node:18.20.4-alpine3.19

WORKDIR /app

# COPY ./.env.production ./

EXPOSE 3000
COPY package.json package-lock.json next.config.mjs next-env.d.ts postcss.config.js tailwind.config.js tsconfig.json tsconfig.node.json ./
RUN npm install


COPY src src/
RUN npm run build

CMD [ "npm", "run", "start" ]