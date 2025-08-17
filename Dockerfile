# Estágio 1: Build da Aplicação React
FROM node:20-alpine as builder

WORKDIR /app

# Copia os arquivos de manifesto de pacote e instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Executa o build de produção
RUN npm run build

# Estágio 2: Servidor de Produção com Nginx
FROM nginx:alpine

# Copia os arquivos estáticos gerados do estágio de build para o diretório do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nova configuração do Nginx que suporta Single Page Applications (SPA)
COPY nginx.conf /etc/nginx/conf.d

# Expõe a porta 80 para o tráfego HTTP
EXPOSE 80

# Comando para iniciar o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
