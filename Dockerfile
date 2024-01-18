# Rebuild the source code only when needed
FROM node:16-alpine
WORKDIR /app
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn install
RUN yarn build


EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]
