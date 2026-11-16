# API Reference

Base URL: `http://localhost:3000`

All POST bodies are JSON.

---

## Health check

`GET /health`

```bash
curl http://localhost:3000/health
```

Response:

```json
{ "status": "ok", "timestamp": "2026-11-13T15:10:51.361Z" }
```

---

## Send a notification to a token

`POST /notifications/token`

| Field      | Type   | Required | Notes                                                                 |
| ---------- | ------ | -------- | --------------------------------------------------------------------- |
| `fcmToken` | string | yes      | Device FCM token to send to                                           |
| `title`    | string | yes      |                                                                       |
| `body`     | string | yes      |                                                                       |
| `data`     | object | no       | Custom key/value payload. Non-string values are sent as JSON strings. |

```bash
curl -X POST http://localhost:3000/notifications/token \
  -H "Content-Type: application/json" \
  -d '{
    "fcmToken": "chCL8xHhRHW5O8LRtq4rFV:APA91bE0mWe6nUWO-Ai2bXO7moOhOnrNH6i0csU2jFNZ9dKXZp2KZbzQarYBxgTudYXmNdYSYpxJYUzas1urQPTpl74XmAvArt9LtAP79f1ueOa-VhDVvtw",
    "title": "Appointment reminder",
    "body": "Your session starts in 15 minutes.",
    "data": {
      "screen": "appointment",
      "appointmentId": "12345"
    }
  }'
```

Response:

```json
{
  "messageId": "projects/telebantuan-mvp/messages/0:1731...",
  "token": "chCL8xHhRHW5O8LRtq4rFV:APA91bE0mWe6nUWO-Ai2bXO7moOhOnrNH6i0csU2jFNZ9dKXZp2KZbzQarYBxgTudYXmNdYSYpxJYUzas1urQPTpl74XmAvArt9LtAP79f1ueOa-VhDVvtw",
  "title": "Appointment reminder",
  "body": "Your session starts in 15 minutes.",
  "data": {
    "screen": "appointment",
    "appointmentId": "12345"
  }
}
```

---

## Send a notification to a topic

`POST /notifications/topic`

Sends to every device subscribed to the topic. The mobile client subscribes to these topics directly through the Firebase SDK.

| Field   | Type   | Required | Notes                                                                 |
| ------- | ------ | -------- | --------------------------------------------------------------------- |
| `topic` | string | yes      | One of `general`, `announcement`, `update`, `promotion`               |
| `title` | string | yes      |                                                                       |
| `body`  | string | yes      |                                                                       |
| `data`  | object | no       | Custom key/value payload. Non-string values are sent as JSON strings. |

```bash
curl -X POST http://localhost:3000/notifications/topic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "general",
    "title": "New feature",
    "body": "Update the app from Play Store/App Store to continue using the latest service available!",
    "data": {
      "screen": "home"
    }
  }'
```

Response:

```json
{
  "messageId": "projects/telebantuan-mvp/messages/-1075812515053353627",
  "topic": "general"
}
```

---

## Errors

| Status | When                                                                                                           |
| ------ | -------------------------------------------------------------------------------------------------------------- |
| `400`  | Missing or invalid field (unknown `topic`, missing `title`/`body`/`fcmToken`)                                  |
| `502`  | Firebase rejected the send, e.g. an invalid or expired token. The body contains Firebase's `error` and `code`. |

Example:

```json
{
  "error": "The registration token is not a valid FCM registration token",
  "code": "messaging/invalid-argument"
}
```
