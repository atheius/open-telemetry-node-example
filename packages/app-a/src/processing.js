const opentelemetry = require("@opentelemetry/api");

const tracer = opentelemetry.trace.getTracer();

const processMessage = async () => {
  console.log("Processing message...");

  // Example custom span
  await tracer.startActiveSpan("message processing", async (span) => {
    // Fake timeout to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 10));
    span.end();
  });

  console.log("Message processed!");
};

module.exports = processMessage;
