### Start the queue broker / server
```
cd queueServer && yarn run start
```
Can view queue contents (as well as currently processing/locked messages) at `localhost:3000/web`.
You can also dump queue state with `queueObject.status()`.

### Client lib demo
```
node demo/index.js
```
Populates the queue, spawns a few child processes, and runs queue tasks (get/delete) in parallel.
You can see this happening in real(-ish) time at `localhost:3000/web`.

### Broker / server endpoints
```
GET /web
```
No parameters.

Returns a web page displaying the current state of the queue, using the `/status` endpoint.

```
<html ...>
```
---
```
GET /status
```
No parameters.

Returns a JSON representation of queue state, for display and/or debugging.

```
{
  queue: [...],
  lockedMessages: { ... },
  ttl: number (ms),
}
```
---
```
GET /get
```
No parameters.

Returns a message from the top of the FIFO queue and flags the message as "in processing", which makes it
unavailable to other clients.

```
{
  success: (true|false),
  message: {
    id: string,
    created: unix_timestamp,
    body: (object|primitive),
  },
}
```
---
```
POST /add
```
Parameters:
 - `message` (required): Arbitrary data type (Object or any primitive)

Adds a message to the queue.

Returns the uuid of the message, if created successfully.

```
{
  success: (true|false),
  messageId: string,
}
```
---
```
POST /delete
```
Parameters:
 - `messageId` (required): message UUID

Returns an error message on failure, and the message uuid if successful.

```
{
  success: (true|false),
  messageId: string,
}
```
---
```
POST /purge
```
No parameters.

Clears the message queue and all locked messages.

Returns a bool indicating whether the operation was successful.

```
{
  success: (true|false)
}
```

