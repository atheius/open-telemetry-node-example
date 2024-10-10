const { NodeSDK } = require('@opentelemetry/sdk-node')
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node')
const { metrics } = require('@opentelemetry/api')
const {
  MeterProvider,
} = require('@opentelemetry/sdk-metrics')
const { HostMetrics } = require('@opentelemetry/host-metrics')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { Resource } = require('@opentelemetry/resources')
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT,
} = require('@opentelemetry/semantic-conventions')

const APP_NAME = process.env.APP_NAME || 'example'
const METRICS_PORT = process.env.METRICS_PORT || 9464
const TRACES_HOST = process.env.TRACES_HOST || 'jaeger'
const TRACES_PORT = process.env.TRACES_PORT || 4318

if (!APP_NAME) {
  throw new Error('APP_NAME environment variables is required')
}

const resource = new Resource({
  [ATTR_SERVICE_NAME]: `app-${APP_NAME}`,
  [ATTR_SERVICE_VERSION]: '1.0.0',
  [ATTR_DEPLOYMENT_ENVIRONMENT]: 'development',
})

const prometheusExporter = new PrometheusExporter({ port: METRICS_PORT })

const meterProvider = new MeterProvider({
  resource: resource,
  readers: [prometheusExporter],
});

metrics.setGlobalMeterProvider(meterProvider);

const hostMetrics = new HostMetrics({
  meterProvider: meterProvider,
  name: 'example-host-metrics',
})

hostMetrics.start()

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `http://${TRACES_HOST}:${TRACES_PORT}/v1/traces`,
  }),
  metricExporter: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // only instrument fs if it is part of another trace
      '@opentelemetry/instrumentation-fs': {
        requireParentSpan: true,
      },
    }),
  ],
  resource,
})

try {
  sdk.start()
  console.log('OpenTelemetry intialised')
} catch (error) {
  console.error('Error initializing OpenTelemetry', error)
}

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry terminated'))
    .catch((error) => console.error('Error shutting down OpenTelemetry', error))
    .finally(() => process.exit(0))
})
