// This test spins up all the nodes together and waits for them to connect 
// Contrast with rolling.js

const fero = require('fero')
    , { test } = require('tap')
    , ms = hrtime => hrtime[0] * 1e3 + hrtime[1] * 1e-6
    , opts = { 
        constants: { 
          connections: {
            timeout: 9999999
          }
        , outbox: { 
            frag: 2 << 10
          , max : 2 << 10 
          }
        }
      }

test('swarm 5', async () => { 
  servers = await cluster(5)
  await Promise.all(servers.map(server => server.destroy()))
})

// test('swarm 10', async () => { 
//   servers = await cluster(10)
//   await Promise.all(servers.map(server => server.destroy()))
// })

// test('swarm 20', async () => { 
//   servers = await cluster(20)
//   await Promise.all(servers.map(server => server.destroy()))
// })

// test('swarm 40', async () => { 
//   servers = await cluster(40)
//   await Promise.all(servers.map(server => server.destroy()))
// })

async function cluster(size) {
  const servers = await Promise.all(Array(size).fill().map(d => fero('test', opts)))
  await Promise.all(servers.map(server => server.on('connected').filter(server => server.peers.lists.connected.length == size - 1)))
  return servers
}