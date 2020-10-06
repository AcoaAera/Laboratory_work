#ifndef QSERVER_H
#define QSERVER_H

#include <QTcpServer>
#include <QTcpSocket>
#include <QDebug>
#include <QObject>
#include <sw/redis++/redis++.h>
#include <iostream>



class QServer : public QObject
{
    Q_OBJECT
public:
    QServer(QString title = "", QObject *parent = nullptr);
private:
    QTcpServer *server;
    QTcpSocket *socket;
    QString title;
    sw::redis::Redis redis;
public slots:
    void getNewConnection();
    void getDisconnected();
};

#endif // QSERVER_H
