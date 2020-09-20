# QT Server | Nginx | Docker

Папка src содержит исходный код сервера

Папка server содержит:
 - Dockerfile для сборки сервера с дистрибутивом Ubuntu и библиотеками QT 
 - Cкрипт для запуска 5 контейнеров с серверами 
 - Исполняемый файл под Linux
 
Папка nginx содержит:
 - Dockerfile для сборки Nginx с измененным конфигурационным файлом
 - Скрипт для запуска контейнера с Nginx
 - Измененный конфигурационный файл


## Запуск
    cd nginx
    docker build -t "custom_nginx" .
    bash start_nginx.sh
    
    cd server
    docker build -t "server_balance" .
    bash start_servers.sh
    
## Провека

Перейти в браузере по адресу 127.0.0.1. Обновляя страницу можно увидеть как Nginx перенапрвляет запросы к одному из 5 запущенных серверов.
    
    


