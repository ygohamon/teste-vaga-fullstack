# Utiliza a imagem base node:alpine e nomeia esta etapa como builder
FROM node:alpine as builder

# Define o autor da imagem Docker
LABEL authors="Ygo Hamon"

# Define o diretório de trabalho dentro da imagem para /projeto-front
WORKDIR /front

# Copia os arquivos package.json e package-lock.json (ou yarn.lock, dependendo do que estiver presente) para o diretório de trabalho
COPY package*.json ./

# Executa npm install para instalar as dependências do projeto listadas nos arquivos de pacote copiados anteriormente
RUN npm install

# Copia todos os arquivos e pastas do diretório atual para o diretório de trabalho na imagem
COPY . .

# Copia o script de entrypoint do diretório compose/local para o root e remove caracteres de retorno de carro (\r), tornando o script compatível com Unix
COPY ./compose/local/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

# Copia o script de início do diretório compose/local para o root e ajusta para ser compatível com Unix, além de torná-lo executável
COPY ./compose/local/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start

# Define o script de entrypoint que será executado quando o container iniciar
ENTRYPOINT ["/entrypoint"]
