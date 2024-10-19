# Open Telemetry Example

This is an example of how to use Open Telemetry to instrument distributed node applications.

See my blog post for details: [Distributed System Monitoring with OpenTelemetry](https://jmugliston.dev/blog/distributed-system-monitoring-with-opentelemetry)

Docker compose will run two example applications that communicate with each other over http endpoints, as well as instances of Jaeger (for tracing) and Prometheus (for metrics) to collect and visualize the data.

See the diagram below for details.

![Example application components](https://github.com/atheius/open-telemetry-node-example/raw/HEAD/otel-node-example.png 'Example application components')

## Getting started

The following command will run the whole example setup using docker-compose:

```sh
npm run start
```

### Sending some example requests

Send a message from a to b:

```sh
curl -X POST --header "Content-Type: application/json" localhost:3000/message/send/b -d '{"message": "Hello from a!"}'
```

Send a message from b to a:

```sh
curl -X POST --header "Content-Type: application/json" localhost:3001/message/send/a -d '{"message": "Hello from b!"}'
```

To send a large number of message requests using autocannon run:

```sh
npm run load-test
```

### Viewing traces in Jaeger

Navigate to [http://localhost:16686](http://localhost:16686) to view traces in Jaeger.

### Viewing metrics in Prometheus

Navigate to [http://localhost:9090](http://localhost:9090) to view metrics in Prometheus.
