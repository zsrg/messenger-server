# Messenger server API

## 1. Common errors

- `400` - Returned when the session ID is not specified in the cookies.

```json
{
  "message": "Session id not specified"
}
```

- `401` - Returned when a non-existent session ID is specified in the cookies.

```json
{
  "message": "Invalid session id"
}
```

- `404` - Returned when a valid session ID is specified but a non-existent URL is specified.

- `500` - Returned for other internal server errors. Details are provided in the message.

## 2. Session

### 2.1. `POST` `/api/session` - Creates a session

#### Request

- Body:

```json
{
  "login": "user",
  "password": "password"
}
```

#### Response

- `201` - Returned when the session was successfully created.

```json
{
  "id": "c984c5e3da0fb",
  "userId": 1,
  "creationDate": "2024-05-29T18:06:39.204Z",
  "lastActivityDate": "2024-05-29T18:06:39.204Z"
}
```

When a session is successfully created, a cookie is set that must be passed to subsequent requests.

- `400` - Returned when no login or password is specified.

```json
{
  "message": "Login or password not specified"
}
```

- `403` - Returned when an incorrect login or password is specified.

```json
{
  "message": "Invalid login or password"
}
```

### 2.2. `GET` `/api/session/{{sessionId}}` - Returns session information

#### Request

- Params:

  - `sessionId` - Session ID (optional). If not specified, information about the current session is returned.

#### Response

- `200` - Returns session information.

```json
{
  "id": "c984c5e3da0fb",
  "userId": 1,
  "creationDate": "2024-05-29T18:06:39.204Z",
  "lastActivityDate": "2024-05-29T18:06:39.204Z"
}
```

- `403` - Returned when another user's session is specified.

```json
{
  "message": "Session is owned by another user"
}
```

- `404` - Returned when a non-existent session is specified.

```json
{
  "message": "Session with given id not found"
}
```

### 2.3. `GET` `/api/sessions` - Returns a list of sessions

#### Response

- `200` - Returns a list of sessions.

```json
[
  {
    "id": "c984c5e3da0fb",
    "userId": 1,
    "creationDate": "2024-05-29T18:06:39.204Z",
    "lastActivityDate": "2024-05-29T18:06:39.204Z"
  },
  {
    "id": "d1a85a3264ac8",
    "userId": 1,
    "creationDate": "2024-05-29T18:13:53.109Z",
    "lastActivityDate": "2024-05-29T18:13:53.110Z"
  }
]
```

### 2.4. `DELETE` `/api/session/{{sessionId}}` - Deletes session

#### Request

- Params:

  - `sessionId` - Session ID (optional). If not specified, the current session is deleted.

#### Response

- `200` - Returned when the session is successfully deleted.

```json
{
  "message": "Session deleted successfully"
}
```

- `403` - Returned when another user's session is specified.

```json
{
  "message": "Session is owned by another user"
}
```

- `404` - Returned when a non-existent session is specified.

```json
{
  "message": "Session with given id not found"
}
```

## 3. Users

### 3.1. `GET` `/api/user/{{userId}}` - Returns information about the user

#### Request

- Params:

  - `userId` - User ID (optional). If not specified, information about the current user is returned.

#### Response

- `200` - Returns information about the user.

```json
{
  "id": 1,
  "login": "user1",
  "name": "user"
}
```

- `404` - Returned when the user is not found.

```json
{
  "message": "User not found"
}
```

### 3.2. `GET` `/api/users` - Returns a list of users

#### Response

- `200` - Returns a list of users.

```json
[
  {
    "id": 1,
    "login": "user1",
    "name": "user"
  },
  {
    "id": 2,
    "login": "user2",
    "name": "user2"
  }
]
```

## 4. Settings

### 4.1. `PUT` `/api/settings/password` - Changes password

#### Request

- Body:

```json
{
  "currentPassword": "password",
  "newPassword": "password1"
}
```

#### Response

- `200` - Returned upon successful password update.

```json
{
  "message": "Password updated successfully"
}
```

- `400` - Returned when no current or new password is specified.

```json
{
  "message": "Current or new password not specified"
}
```

- `403` - Returned when the current password is invalid.

```json
{
  "message": "Invalid current password"
}
```

- `409` - Returned when the current and new passwords match.

```json
{
  "message": "Current and new passwords are the same"
}
```

### 4.2. `PUT` `/api/settings/name` - Changes name

#### Request

- Body

```json
{
  "newName": "user"
}
```

#### Response

- `200` - Returned upon successful name update.

```json
{
  "message": "Name updated successfully"
}
```

- `400` - Returned when no new name is specified.

```json
{
  "message": "New name not specified"
}
```

### 4.3. `PUT` `/api/settings/login` - Changes login

#### Request

- Body:

```json
{
  "newLogin": "user1"
}
```

#### Response

- `200` - Returned when a login update is successful.

```json
{
  "message": "Login updated successfully"
}
```

- `400` - Returned when no new login is specified.

```json
{
  "message": "New login not specified"
}
```

- `409` - Returned when the current and new login are the same.

```json
{
  "error": "SAME_LOGIN",
  "message": "Current and new login are the same"
}
```

- `409` - Returned when a new login already exists.

```json
{
  "error": "LOGIN_EXISTS",
  "message": "New login already exists"
}
```

## 5. Dialogs

### 5.1. `POST` `/api/dialogs/dialog` - Creates dialog

#### Request

- Body:

```json
{
  "userId": 5
}
```

#### Response

- `201` - Returns the data of the created dialog.

```json
{
  "id": 61,
  "users": [1, 5]
}
```

- `400` - Returned when no user ID is provided.

```json
{
  "message": "User id not specified"
}
```

- `404` - Returned when the user is not found.

```json
{
  "message": "User not found"
}
```

- `409` - Returned when the dialog already exists.

```json
{
  "message": "Dialog already exists"
}
```

### 5.2. `GET` `/api/dialogs` - Returns a list of dialogs

#### Response

- `200` - Returns a list of dialogs.

```json
[
  {
    "id": 51,
    "users": [1, 3]
  },
  {
    "id": 61,
    "users": [1, 5]
  }
]
```

### 5.3. `DELETE` `/api/dialogs/dialog/{{dialogId}}` - Deletes dialog

#### Request

- Params:

  - `dialogId` - Dialog ID

#### Response

- `200` - Returned when the dialog was successfully deleted.

```json
{
  "message": "Dialog deleted successfully"
}
```

- `400` - Returned when the dialog ID is not specified.

```json
{
  "message": "Dialog id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

## 6. Messages

### 6.1. `POST` `/api/messages/message` - Sends message

#### Request

- Body:

```json
{
  "dialogId": 42,
  "text": "Test message 1",
  "attachmentId": null
}
```

#### Response

- `201` - Returns the created message data.

```json
{
  "id": 168,
  "date": "2024-05-30T15:13:50.146Z",
  "text": "Test message 1",
  "dialogId": 42,
  "userId": 1,
  "attachmentId": null
}
```

- `400` - Returned when the dialog ID is not specified.

```json
{
  "message": "Dialog id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

### 6.2. `GET` `/api/messages/dialog/{{dialogId}}` - Returns a list of dialog messages

#### Request

- Params:

  - `dialogId` - Dialog ID

- Query:

  - `limit` - Number of messages from end (optional, default 1000)
  - `offset` - Message offset from end (optional, default 0)

#### Response

- `200` - Returns a list of dialog messages.

```json
[
  {
    "id": 167,
    "date": "2024-05-29T17:50:17.542Z",
    "text": "Test message 1",
    "dialogId": 42,
    "userId": 1,
    "attachmentId": null
  },
  {
    "id": 168,
    "date": "2024-05-30T15:13:50.146Z",
    "text": "Test message 2",
    "dialogId": 42,
    "userId": 1,
    "attachmentId": null
  }
]
```

- `400` - Returned when the dialog ID is not specified.

```json
{
  "message": "Dialog id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

### 6.3. `DELETE` `/api/messages/dialog/{{dialogId}}` - Deletes dialogue messages

#### Request

- Params:

  - `dialogId` - Dialog ID

#### Response

- `200` - Returned when dialog messages are successfully deleted.

```json
{
  "message": "Dialog messages deleted successfully"
}
```

- `400` - Returned when the dialog ID is not specified.

```json
{
  "message": "Dialog id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

## 7. Attachments

### 7.1. `POST` `/api/attachments/attachment` - Creates attachment

#### Request

- Body:

```json
{
  "dialogId": 42,
  "base64": "data:image/png;base64,..."
}
```

#### Response

- `201` - Returns the data of the created attachment.

```json
{
  "id": 52,
  "path": "42\\f137e0bb5ccba.png",
  "dialogId": 42
}
```

- `400` - Returned when the dialog ID or base64 is not specified.

```json
{
  "message": "Dialog id or base64 not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

- `415` - Returned when the attachment has an unsupported media type.

```json
{
  "message": "Unsupported media type"
}
```

### 7.2. `GET` `/api/attachments/{{attachmentId}}` - Returns attachment

#### Request

- Params:

  - `attachmentId` - Attachment ID

#### Response

- `200` - Returns the binary data of the attachment.

- `400` - Returned when no attachment ID is specified.

```json
{
  "message": "Attachment id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

- `404` - Returned when the attachment is not found.

```json
{
  "message": "Attachment not found"
}
```

### 7.3. `DELETE` `/api/attachments/dialog/{{dialogId}}` - Deletes dialog attachments

#### Request

- Params:

  - `dialogId` - Dialog ID

#### Response

- `200` - Returned upon successful removal of attachments.

```json
{
  "message": "Attachments deleted successfully"
}
```

- `400` - Returned when the dialog ID is not specified.

```json
{
  "message": "Dialog id not specified"
}
```

- `403` - Returned when the user is not in the dialog.

```json
{
  "message": "User not in dialog"
}
```

- `404` - Returned when the dialog is not found.

```json
{
  "message": "Dialog not found"
}
```

## 8. Subscribe

### 8.1. `GET` `/api/subscribe` - Subscribes to updates

Events are sent to all sessions of the current user except the current session, as well as to all sessions of the second user (for events related to the dialogue).

#### Messages

- New session:

```json
{
  "type": "NEW_SESSION",
  "data": {
    "id": "d1a85a3264ac8",
    "userId": 1,
    "creationDate": "2024-05-29T18:13:53.109Z",
    "lastActivityDate": "2024-05-29T18:13:53.110Z"
  }
}
```

- Delete session:

```json
{
  "type": "DELETE_SESSION",
  "data": "d1a85a3264ac8"
}
```

- Update name:

```json
{
  "type": "UPDATE_NAME",
  "data": "User"
}
```

- Update login:

```json
{
  "type": "UPDATE_LOGIN",
  "data": "user"
}
```

- New dialog:

```json
{
  "type": "NEW_DIALOG",
  "data": {
    "id": 61,
    "users": [1, 5]
  }
}
```

- Delete dialog:

```json
{
  "type": "DELETE_DIALOG",
  "data": 61
}
```

- New message:

```json
{
  "type": "NEW_MESSAGE",
  "data": {
    "id": 168,
    "date": "2024-05-30T15:13:50.146Z",
    "text": "Test message 2",
    "dialogId": 42,
    "userId": 1,
    "attachmentId": null
  }
}
```
