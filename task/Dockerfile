From node:5.7.0
RUN mkdir -p /usr/src/task
WORKDIR /usr/src/task
COPY . /usr/src/task
RUN npm install

CMD [ "node", "index.js" ]
