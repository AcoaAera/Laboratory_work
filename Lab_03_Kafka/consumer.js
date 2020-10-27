var kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient({requestTimeout:1000}),
  consumer = new Consumer(client, [{ topic: "count", partition: 0}], {
    autoCommit: false,
    autoCommitIntervalMs: 10000
  });

consumer.on("message", function(message) {
  console.log(message);
  

});
