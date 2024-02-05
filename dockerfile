# Используем базовый образ Node.js
FROM node:18

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости проекта
RUN npm install

# Копируем все остальные файлы проекта в контейнер
COPY . .

# Определяем команду, которая будет запускаться при запуске контейнера
CMD [ "npm", "run", "serve" ]