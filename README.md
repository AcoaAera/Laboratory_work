# Lab_01 QT Server | Nginx | Docker

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
    

## ---------------------------------------------------------------------
    

# Lab_02 QT Server | Redis

### Проблемы: не удалось установить библиотеку-клиент Redis – redis-plus-plus под Ubuntu, под Mac Os установилось нормально. В связи с этим невозможно использовать Docker, так как бинарный файл собранный под Mac Os не запустить на Ubuntu.

Папка src содержит исходный код сервера

## Реализация
Установил клиент Redis – redis-plus-plus, подключил к проекту Qt. Далее идет создание объекта и подключение к серверу Redis:

    redis(sw::redis::Redis("tcp://127.0.0.1:6379")).
    
Проверяем существование ключа id, если нет, создаем ключ id и заносим значение 1:

    if(redis.exists("id")){
        redis.set("id", "1");
    }

Далее вовзращаем клиенту инкрементированный счетчик:

    long long val = redis.incr("id");

## Запуск
    Меняя порты в коде с 8000 по 8004 запускаем 5 серверов с разными портами.
    
## Провека

Перейти в браузере по адресу 127.0.0.1:8000-8004. Далее переходя по адресам увеличивается общий счетчик из БД

![](/Lab_02_Redis/1.png)

Работающий сервер Redis и Redis-CLI

![](/Lab_02_Redis/2.png)

## ---------------------------------------------------------------------

# Lab_03 Kafka | NodeJS

#### Запуск и тестирование проводилось на Xubuntu 20.04

### Для начала необходимо было установить и запустить Kafka сервер:

    sudo systemctl start zookeeper
    sudo systemctl start kafka

#### Далее необходимо было найти библиотеку клиент для работы с Kafka. Была выбрана kafka-node:
    npm install kafka-node
    
#### Далее создаем два скрипта: producer.js и consumer.js. Первый будет генерировать сообщения и посылать их в очередь, второй будет считывать сообщения из очереди

### Producer каждые 500мс посылает сообщения в очередь:
    setInterval(function() {
    payloads = [
      { topic: "count", messages: `${count}`, partition: 0 }
    ];

    producer.send(payloads, function(err, data) {
      console.log(data);
      count += 1;
    });
    }, 500);
    });

### Consumer считывает сообщения из очереди и выводит их в консоль:
    consumer.on("message", function(message) {
    console.log(message);
    });

### Изменяя различные параметры у Consumer можно менять поведение клиента, например: ограничивать скорость чтения из очереди или считывать все сообщение или только новые.

![](/Lab_03_Kafka/images/1.png)

## ---------------------------------------------------------------------

# Lab_04 PostegreSQL | Partitioning


### Для полного понимания работы партиционирования стандартные примеры из гайда были изменены


#### Для начала создаем структуру таблицы которую в дальнйшем будем разделять на части:


    CREATE TABLE measurement (
        city_id         int not null,
        logdate         date not null,
        peaktemp        int,
        unitsales       int
    ) PARTITION BY RANGE (logdate);

#### Далее создаем разделы (партиции) используя партиционирование по диапазону, конкретно - по дате:

    CREATE TABLE measurement_y2020m01 PARTITION OF measurement
        FOR VALUES FROM ('2020-01-01') TO ('2020-02-01');
    CREATE TABLE measurement_y2020m02 PARTITION OF measurement
        FOR VALUES FROM ('2020-02-01') TO ('2020-03-01');
    CREATE TABLE measurement_y2020m03 PARTITION OF measurement
        FOR VALUES FROM ('2020-03-01') TO ('2020-04-01');
    CREATE TABLE measurement_y2020m04 PARTITION OF measurement
        FOR VALUES FROM ('2020-04-01') TO ('2020-05-01');
    CREATE TABLE measurement_y2020m05 PARTITION OF measurement
        FOR VALUES FROM ('2020-05-01') TO ('2020-06-01');
    CREATE TABLE measurement_y2020m06 PARTITION OF measurement
        FOR VALUES FROM ('2020-06-01') TO ('2020-07-01');
        

#### Здесь создается 6 таблиц на каждый месяц в течении полу года. Каждая партиция начинается от 1 числа месяца до 1 числа следующего месяца.

#### Далее необходимо заполнить главную таблицу данным
 

    INSERT INTO measurement VALUES(1,'2020-01-05',-10,5);
    INSERT INTO measurement VALUES(2,'2020-02-06',-15,2);
    INSERT INTO measurement VALUES(3,'2020-04-12',-18,2);
    INSERT INTO measurement VALUES(4,'2020-06-25',-18,2);
    INSERT INTO measurement VALUES(5,'2020-03-18',-19,2);
    INSERT INTO measurement VALUES(6,'2020-04-10',-25,2);
    INSERT INTO measurement VALUES(7,'2020-02-04',-20,2);
    INSERT INTO measurement VALUES(8,'2020-01-04',-29,2);
    INSERT INTO measurement VALUES(9,'2020-05-25',-15,2);
    INSERT INTO measurement VALUES(10,'2020-03-13',-17,2);
    INSERT INTO measurement VALUES(11,'2020-02-06',-13,2);
    INSERT INTO measurement VALUES(12,'2020-05-23',-16,2);
    INSERT INTO measurement VALUES(13,'2020-03-08',-14,2);
    INSERT INTO measurement VALUES(14,'2020-01-12',-18,2);
    INSERT INTO measurement VALUES(15,'2020-05-17',-16,2);
    INSERT INTO measurement VALUES(16,'2020-03-28',-13,2);
    INSERT INTO measurement VALUES(17,'2020-06-11',-11,2);
    INSERT INTO measurement VALUES(18,'2020-03-02',-17,2);
    INSERT INTO measurement VALUES(19,'2020-01-13',-15,2);
    INSERT INTO measurement VALUES(20,'2020-06-19',-14,2);
    
#### Проверяем, добавились ли данные

![](/Lab_04_PostgreSQL/images/1.png)

#### Сразу можно заметить то, как работает партиционирование - все данные автоматически распределились между 6 созданными таблицами, дальнейшая манипцляция с данными становится гораздо удобнее так-как на каждую партицию имеется таблица.
#### Можно посмотреть на содержание таблицы с 1 января по 1 ферваля 2020 года:

    SELECT * FROM "public"."measurement_y2020m01";
    
![](/Lab_04_PostgreSQL/images/2.png)

#### Далее если необходимо, например, удалить часть данных относящихся к определенному месяцу, то достаточно удалить соответствующую таблицу(партицию):

    DROP TABLE measurement_y2020m02;
    
#### Данная операция удалит все данные на февраль
#### Есть возможность отвзяать секцию от главной таблицы что бы она стала самостоятельной таблицей командой:
    ALTER TABLE measurement DETACH PARTITION measurement_y2020m06;

#### Таблица "measurement_y2020m06" стала самостоятельной

### Возможно сначала создать таблицу, а затем сделать ее частью основной партиционированной таблицы:

    CREATE TABLE measurement_y2020m07
      (LIKE measurement INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
    
    ALTER TABLE measurement_y2020m07 ADD CONSTRAINT y2020m08
       CHECK ( logdate >= DATE '2020-07-01' AND logdate < DATE '2020-08-01' );
    
    ALTER TABLE measurement ATTACH PARTITION measurement_y2020m07
        FOR VALUES FROM ('2020-07-01') TO ('2020-08-01' );

#### Здесь создается новая таблица "measurement_y2020m07" за период с 1 июля 2020 по 1 августа 2020, а затем уже она становится частью таблицы "measurement" 

## ---------------------------------------------------------------------

# Lab_05 Docker-compose
### Запуск и тестирование проводилось на Xubuntu 20.04
#### Для лабораторной работы будем использовать сервер из первой лабораторной работы
#### Для начала необходимо сформировать образ Docker с сервером
#### Формирование образа:
        docker build -t "server" .
#### Далее устанавливаем docker-compose:
    sudo apt-get install docker-compose
#### Далее  нееобходимо написать "docker-compose.yml" файл в котором во фрагменте services указываются запускаемые контейнеры:
    version: "3.3"
    services:
    server1:
    image: server
    ports:
    - "8001:8000"

#### И таких экземпляров 6 штук
#### Далее, используя оркестратор контейнеров docker-compose поднимаем 6 серверов на разных портах
    sudo docker-compose up
![](/Lab_05_Docker_Compose/images/1.png)

#### Так-же возможно запустить контейнеры в качестве демонов
    sudo docker-compose up -d
#### Для остановки, а так же удаления всех запущенных контейнеров используется команда
    sudo docker-compose down
![](/Lab_05_Docker_Compose/images/2.png)

## ---------------------------------------------------------------------

# Lab_06 AWS S3

### Проект реализовывался на HTML,JS,CSS,AXIOS,JQUERY и NODEJS,AWS-SDK

### Общая схема приложения выглядит так: 

![](/Lab_06_AWS_S3/images/1.png)

### В Mail Cloud Soultion был создан аккаунт, один бакет и один аккаунт. Ключи были прописаны в переменные окружения, откуда Aws-sdk будет атвоматически их доставать
### На стороне клиента используется библиотека Axios для удобной отправки файлов серверу, а так же Jquery для оперирования DOM-дереревом и отправки Ajax-запросов
### Клиент выглядит следующим образом:
![](/Lab_06_AWS_S3/images/2.PNG)
### на странице расположена кнопка которая позволяет за раз загрузить один файл
### Далее клиент ждет ответа от сервера об успешной загрузке файла в хранилище S3 и добавляет изображение на страницу
![](/Lab_06_AWS_S3/images/3.PNG)
![](/Lab_06_AWS_S3/images/4.PNG)
### Сервер в свою очередь на каждый запрос пользователя загружает изображение в хранилище, для этого необходимо имя корзины, ключ и буффер изображения.
### После обновления страницы клиент запрашивает у сервера все изображения хранящиеся в корзине. Так как не был найден метод для полной выгрузки всех объектов из корзины, сервер запрашивает у корзины список объектов с метаинформацией, а далее через цикл выгружает все изображения подряд, добавляет в массив буфферы в кодировке Base64 изображений и отправляет клиенту JSON который воссоздает изображения из буфера. 
### Итоговый результат:
![](/Lab_06_AWS_S3/images/5.PNG)

## ---------------------------------------------------------------------

# Lab_07 MCS VISION
### Разработка велась на ОС Xubuntu 20.04
### Проект реализовывался на HTML,JS,CSS,AXIOS,JQUERY и NODEJS
### Основной код брался из предыдущей лабораторной работы

### Для начала я создал Token для доступа к функциям распознавания изображений на Mail Cloud Solution
### Так как для отправки изображения необходимо было сформировать http post запрос в ручную, было принято решение использовать CURL для автоматизации отправки изображения, так как в итоге так и не получилось в ручную сформировать запрос.
### CURL на вход принимает url,token и options, а в ответ приходит JSON в котором имеются названия и координаты объекта на изображении
### Возможно было использовать библиотеку для использования CURL, но я просто воспользовался модулем NodeJS для запуска дочерних процессов
    const {exec} = require("child_process");
    
    exec("curl -k -v 'https://smarty.mail.ru/api/v1/objects/detect?oauth_provider=mcs&oauth_token=<token>' \
	-F file_0=@/home/name/"+name+" -F meta='{\"mode\":[\"pedestrian\",\"multiobject\",\"object\"], \"images\":[{\"name\": \"file_0\"}]}'", (error, stdout, stderr) => {
		console.log(error);
		res.send(stdout);
	});

### После запуска процесса NodeJS ожидает информации из стандартного потока вывода (stdout) и отправляет данные клиенту
### На клиенте перед отправкой изобржанию клиенту, изображение добавляется на страницу, ограничивается размер, выравнивается. Так же на странице имеется элемент HTML5 Canvas который после изменения геометрии изображения выравнивается по его размеру
### После отправки изображения остается только дождаться ответа от серверов Mail и разобрать ответ, в нем присутсвуют отдельные объекты для "объектов","номеров машин","лиц","местности"
### Далее остается только нарисовать прямоугольник и добавить подпись.
### По мимо всего, в ответе присутствуют данные о точности распознавания того или иного объекта, а так же подпись не только на русском но и на английском языках
### Присутствовали и проблемы, CURL не всегда возвращает адекватный результат даже при вызове его из терминала, иногда это пустой ответ, иногда в ответе нет всех объектов которые должны быть. Mail Cloud Solution не хватает библиотеки для обращения к своим сервисам, это необходимо что бы понизить порог вхождения.
### Так же огромной проблемой было то, что нет понимания как в ручную формировать http post запросы, в коде присутсвует закомментированный сегмент кода в котором я пытался создать запрос, но в лучшем случае сервер выдавал пустой ответ:
	var id = uniqid();

	var eol = "\r\n";
	var x2eol = "\r\n\r\n";

	var request = 
	    "Content-Type: multipart/form-data; boundary=----" + eol + id + x2eol +
		"------" + id + eol +
		'Content-Disposition: form-data; name="file_0"; filename="'+ name + "\"" + eol +
		"Content-Type: image/jpeg" + eol + eol +
		'Content-Transfer-Encoding: binary' + x2eol + req.files[0].buffer + eol +
		"------" + id + eol +
		'Content-Disposition: form-data; name="meta"' + x2eol + mt+eol+
		"------" + id + "--";
		
		var contentLength = S.length;
		
		request({
		headers: {
			'Content-Length': contentLength,
			'Content-Type': 'multipart/form-data'
		},
		uri: 'https://smarty.mail.ru/api/v1/objects/detect?oauth_provider=mcs&oauth_token=<token>',
		body: request,
		method: 'POST'
	}, function (err, res, data) {
		console.log(data);
	});
### Итоговый результат:
![](/Lab_07_Vision/images/1.png)
![](/Lab_07_Vision/images/2.png)
![](/Lab_07_Vision/images/3.png)

## ---------------------------------------------------------------------

# Lab_08 Kubernetes | Minikube

### Запуск и тестирование проводилось на Xubuntu 20.04

### Для начала необходимо установить minikube и kubectl:
    $ curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.20.0/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
    $ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
    
### Запускаем minikube командой minikube start:

    Starting local Kubernetes v1.6.4 cluster...
    Starting VM...
    Downloading Minikube ISO
    90.95 MB / 90.95 MB [==============================================] 100.00% 0s
    Moving files into cluster...
    Setting up certs...
    Starting cluster components...
    Connecting to cluster...
    Setting up kubeconfig...
    Kubectl is now configured to use the cluster.

### Далее мы создаем переменные окружения Docker для Minikube с помощью команды minikube docker-env:
    $ eval $(minikube docker-env)
    
### Пишем простой echo сервер на NodeJS уоторый возвращает счетчик и Dockerfile для сборки
### Собираем образ:
    docker build -t test:v1 .
### Теперь мы можем разместить под "test" в локальный кластер Kubernetes с помощью kubectl:
    kubectl run test --image=test:v1 --port=8080
### Необходимо присвоить сервису внешний IP и порт, чтобы получить к нему доступ с помощью curl:
     kubectl expose deployment test --type=NodePort
### Проверяем командой:
    curl $(minikube service test --url)
### Как результат в терминал возвращается счетчик:
![](/Lab_08_Minikube/images/1.png)
### Следующей командой смотрим адрес и порт
    minikube service test --url
    $ http://192.168.99.108:30881
### Так же проверка в браузере:
![](/Lab_08_Minikube/images/2.png)   
    
