FROM node:lts-alpine

WORKDIR /app
COPY package*.json /app
RUN yarn install --check-files

COPY . .

EXPOSE 3000
CMD [ "yarn", "watch" ]