#include "qserver.h"

static QString HTTPHandle = "HTTP/1.1 200 OK\n\n";

QServer::QServer(QString title, QObject *parent) : QObject(parent)
{
    server = new QTcpServer(this);

    connect(server, &QTcpServer::newConnection, this, &QServer::getNewConnection);

    if(server->listen(QHostAddress::Any, 8000)){
        qDebug() << "Server starting";
    }else{
        qDebug() << "Server not starting " << server->errorString();
    }

    this->title = title;
}


void QServer::getNewConnection(){
    socket = server->nextPendingConnection();

   // qWarning() << "new connection";

    static int N = 0;

    QString response = HTTPHandle + "<h1>" + this->title + ": " + QString::number(N++) + "</h1>";

    socket->write(response.toLatin1());

    connect(socket, &QTcpSocket::disconnected, this, &QServer::getDisconnected);
}

void QServer::getDisconnected(){
    //qDebug() << "disconnect";
    socket->close();
}


