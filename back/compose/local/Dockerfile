# Utiliza a imagem base node:21-alpine
FROM node:21-alpine

# Define o autor da imagem Docker
LABEL authors="Ygo Hamon"

WORKDIR /back

# Instala as dependências
COPY package*.json ./
RUN npm install

# Copia a aplicação para o container
COPY . .

# Configura os scripts de entrypoint e start
COPY ./compose/local/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

COPY ./compose/local/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start

ENTRYPOINT ["/entrypoint"]
