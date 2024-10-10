const express = require('express')
const axios = require('axios')
const { trace, metrics } = require('@opentelemetry/api')
const { randomUUID } = require('crypto')

const tracer = trace.getTracer()
const meter = metrics.getMeter()

// Create a counter to track number of messages processed
const messageProcessingCounter = meter.createCounter('message_processing_count', {
  description: 'Counts the number of messages processed',
});

// Creating a histogram to track message processing duration
const messageProcessingDurationHistogram = meter.createHistogram(
  'message_processing_duration',
  {
    description: 'Measures the duration of message processing',
    unit: 'ms',
  }
)

const port = process.env.PORT || 3000
const appName = process.env.APP_NAME || 'example'

const app = express()

app.use(express.json())

const processMessage = async ({ id }) => {
  console.log('Processing message', id)

  const startTime = performance.now()

  // Example custom span
  await tracer.startActiveSpan('message processing', async (span) => {
    const timeout = Math.floor(Math.random() * 100)

    // Fake timeout to simulate processing
    await new Promise((resolve) => setTimeout(resolve, timeout))

    const duration = performance.now() - startTime

    // Record custom metrics (count and duration of message processing)
    messageProcessingCounter.add(1)
    messageProcessingDurationHistogram.record(duration, {
      'message.id': id,
      status: 'processed',
    })

    span.end()
  })
}

app.get('/', (req, res) => {
  res.status(200).send(`Hello from app ${appName}!`)
})

// Send a message
app.post('/message/send/:dest', async (req, res) => {
  const destination = req.params.dest

  console.log(`Sending message "${JSON.stringify(req.body)}" to ${destination}`)

  try {
    await axios.post(`http://app-${destination}:3000/message`, {
      from: appName,
      to: destination,
      id: randomUUID(),
      body: req.body.message,
    })
  } catch (error) {
    console.error('Error sending message', error)
    return res.status(500).json({ error: 'Error sending message' })
  }

  return res.status(200).json({ data: `Message sent to ${destination}!` })
})

// Receive a message
app.post('/message', async (req, res) => {
  const message = req.body

  console.log('Received message', JSON.stringify(message))

  await processMessage(message)

  return res.status(200).json({ data: 'Message received!' })
})

const startServer = () => {
  app.listen(port, () => {
    console.log(`App ${appName} started!`)
  })
}

startServer()
