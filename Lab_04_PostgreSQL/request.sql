CREATE TABLE measurement (
    city_id         int not null,
    logdate         date not null,
    peaktemp        int,
    unitsales       int
) PARTITION BY RANGE (logdate);

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

ALTER TABLE measurement DETACH PARTITION measurement_y2020m06;

CREATE TABLE measurement_y2020m08
  (LIKE measurement INCLUDING DEFAULTS INCLUDING CONSTRAINTS);

ALTER TABLE measurement_y2020m08 ADD CONSTRAINT y2020m08
   CHECK ( logdate >= DATE '2020-08-01' AND logdate < DATE '2020-09-01' );

ALTER TABLE measurement ATTACH PARTITION measurement_y2020m08
    FOR VALUES FROM ('2020-08-01') TO ('2020-09-01' );

