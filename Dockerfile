FROM node:18-bullseye-slim

RUN apt-get update \ 
    && apt-get install -y --no-install-recommends \ 
    tini \ 
    && rm -rf /var/lib/apt/lists/* 
# set entrypoint to always run commands with tini
ENTRYPOINT [ "/usr/bin/tini", "--" ]

# change permissions to non-root user
RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install && yarn build && yarn cache clean

ADD . .

CMD [ "node", "dist/main" ]
