FROM node:gallium-alpine
ARG BUILD_CONTEXT
ARG RUN_COMMAND
ENV RUN_CONTEXT ${BUILD_CONTEXT} ${RUN_COMMAND}

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./tsconfig.json .
COPY ./yarn.lock .

COPY ./packages/core ./packages/core
COPY ./packages/${BUILD_CONTEXT} ./packages/${BUILD_CONTEXT}

RUN yarn

COPY ./packages/${BUILD_CONTEXT} ./packages/${BUILD_CONTEXT}

RUN yarn ${BUILD_CONTEXT} build

EXPOSE 3000

CMD yarn ${RUN_CONTEXT} start