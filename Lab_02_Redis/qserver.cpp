#include "qserver.h"

static QString HTTPHandle = "HTTP/1.1 200 OK\n\n";



QServer::QServer(QString title, QObject *parent) :
    QObject(parent),
    redis(sw::redis::Redis("tcp://127.0.0.1:6379"))
{
    server = new QTcpServer(this);

    connect(server, &QTcpServer::newConnection, this, &QServer::getNewConnection);

    if(server->listen(QHostAddress::Any, 8000)){
        qDebug() << "Server starting";
    }else{
        qDebug() << "Server not starting " << server->errorString();
    }

    this->title = title;


    if(redis.exists("id")){
        redis.set("id", "1");
    }

}

void QServer::getNewConnection(){
    socket = server->nextPendingConnection();

    static int N = 0;

    long long val = redis.incr("id");

    QString response = HTTPHandle + "<h1>" + this->title + ": " + QString::number(val) + "</h1>";

    socket->write(response.toLatin1());

    connect(socket, &QTcpSocket::readyRead, this, &QServer::getDisconnected);
}

void QServer::getDisconnected(){
    socket->close();
}




