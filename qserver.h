#ifndef QSERVER_H
#define QSERVER_H

#include <QTcpServer>
#include <QTcpSocket>
#include <QDebug>
#include <QObject>

class QServer : public QObject
{
    Q_OBJECT
public:
    explicit QServer(QObject *parent = nullptr);
private:
    QTcpServer *server;
    QTcpSocket *socket;

public slots:
    void getNewConnection();
    void getDisconnected();
};

#endif // QSERVER_H
