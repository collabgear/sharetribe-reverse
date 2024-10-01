# syntax=docker/dockerfile:experimental

FROM node:18.15.0
# FROM node:16

# install ssh client and git
RUN apt-get update -y && apt-get install -y git openssh-client gcc g++ make

# download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

ARG COMMIT_SHA
ENV BUILD_SHA ${COMMIT_SHA}

# WORKDIR /usr/src/app

# COPY . .

# RUN --mount=type=ssh yarn install
# RUN yarn build
# CMD ["yarn", "start"]

WORKDIR /home/node/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
ENV PORT=4000
# ENV NODE_ENV=production
EXPOSE 4000

RUN --mount=type=ssh yarn install
RUN yarn run build
USER node
CMD ["yarn", "start"]
