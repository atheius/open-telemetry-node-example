const autocannon = require('autocannon')

// Fire lots of requests to from a to b

autocannon(
  {
    method: 'POST',
    url: 'http://localhost:3000/message/send/b',
    body: JSON.stringify({ message: 'hello' }),
    headers: {
      'Content-Type': 'application/json',
    },
    connections: 10,
    pipelining: 1,
    duration: 3,
    workers: 4,
  },
  console.log
)

// Fire lots of requests to from b to a

autocannon(
  {
    method: 'POST',
    url: 'http://localhost:3001/message/send/a',
    body: JSON.stringify({ message: 'hello' }),
    headers: {
      'Content-Type': 'application/json',
    },
    connections: 10,
    pipelining: 1,
    duration: 3,
    workers: 4,
  },
  console.log
)
