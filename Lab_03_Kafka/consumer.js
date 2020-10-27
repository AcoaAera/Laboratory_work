var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient(),
  consumer = new Consumer(client, [{ topic: "count", partition: 0}], {
    autoCommit: false});

consumer.on("message", function(message) {
  console.log(message);
  

});
