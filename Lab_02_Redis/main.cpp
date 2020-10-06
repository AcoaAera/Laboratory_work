#include <QCoreApplication>
#include "qserver.h"


int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString title;

    for (int i = 0; i < argc; ++i) {
        std::string s(argv[i]);
        if (s == "-title") title = argv[i+1];

    }

    QServer server(title);

    return a.exec();
}


