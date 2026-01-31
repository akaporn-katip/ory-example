FROM node:22.16.0-alpine AS deps

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=secret,id=npmrc,target=/app/.npmrc \
    pnpm install --prod --frozen-lockfile --filter=account

FROM node:22.16.0-alpine AS builder

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=secret,id=npmrc,target=/app/.npmrc \
    pnpm install --frozen-lockfile
RUN pnpm --filter account build


FROM node:22.16.0-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nextjs /app/apps/account/.next/standalone ./

COPY --from=builder --chown=nextjs:nextjs /app/apps/account/.next/static ./apps/account/.next/static
COPY --from=builder --chown=nextjs:nextjs /app/apps/account/public ./apps/account/public

COPY --from=deps --chown=nextjs:nextjs /app/apps/account/node_modules ./apps/account/node_modules

EXPOSE 3000
CMD ["node", "apps/account/server.js"]
