# TicketBoss - Event Ticketing API

A robust Node.js REST API for managing concurrent event ticket reservations. This system is designed to handle high-concurrency booking scenarios efficiently without using database transactions, ensuring data integrity through optimistic concurrency control.

## 🚀 Key Features
- **Concurrent Booking Engine**: Uses optimistic locking (versioning) to prevent overbooking.
- **Atomic Operations**: Guarantees consistency when creating or cancelling reservations.
- **Robustness**: Enforces database-level constraints (e.g., non-negative seats).
- **Clean Architecture**: Follows MVC pattern with centralized error handling and input validation.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or hosted)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/event_ticketing_db
   ```

### Running the Server
```bash
npm start
```
*The server will start on port 5000 and automatically seed the "Node.js Meet-up" event if it doesn't exist.*

## 📚 API Documentation

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**:
  ```json
  { "status": "ok" }
  ```

### 2. Get Event & Reservation Summary
- **Endpoint**: `GET /reservations`
- **Description**: Returns event details and current confirmed reservation count.
- **Response**:
  ```json
  {
    "eventId": "node-meetup-2025",
    "name": "Node.js Meet-up",
    "totalSeats": 500,
    "availableSeats": 495,
    "reservationCount": 5,
    "version": 10
  }
  ```

### 3. Create Reservation
- **Endpoint**: `POST /reservations`
- **Body**:
  ```json
  {
    "partnerId": "user123",
    "seats": 2
  }
  ```
- **Validation**:
  - `partnerId` is required.
  - `seats` must be between 1 and 10.
- **Responses**:
  - `201 Created`: Reservation successful.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Not enough seats OR concurrency conflict (try again).

### 4. Cancel Reservation
- **Endpoint**: `DELETE /reservations/:reservationId`
- **Description**: Cancels a reservation and returns seats to the pool.
- **Responses**:
  - `204 No Content`: Successful cancellation.
  - `404 Not Found`: Reservation ID not found or already cancelled.

## 🧠 Optimistic Concurrency Control

To handle high traffic without blocking the database with transactions, we implement **Optimistic Concurrency Control (OCC)** using a `version` field on the `Event` document.

**How it works:**
1. When a user tries to book, we look up the event and note its current `version`.
2. We attempt to decrease `availableSeats` using an atomic `findOneAndUpdate` operation, **Conditioned on the version matching**.
   ```javascript
   Event.findOneAndUpdate(
     { eventId: ..., version: currentVersion },
     { $inc: { availableSeats: -seats, version: 1 } }
   )
   ```
3. **Success**: If the document is found and updated, the version increments.
4. **Failure**: If the version has changed (another user booked in the meantime), the update fails (returns null). We return a `409 Conflict` to the client, asking them to retry.

## 🏗️ Architecture

- **`src/models`**: Mongoose schemas (`Event`, `Reservation`) with strict validation.
- **`src/controllers`**: Business logic handling queries, atomic updates, and response formatting.
- **`src/routes`**: API route definitions mapping URLs to controllers.
- **`src/middleware`**:
  - `validation.js`: Validates request bodies before reaching controllers.
  - `errorHandler.js`: Centralized error response management (JSON format).
- **`src/utils/seed.js`**: Ensures initial data exists on startup.

## 📝 Assumptions
- The system currently manages a single event (`node-meetup-2025`).
- Users are identified by a simple `partnerId` string (no auth implementation).
- The maximum number of seats per booking is capped at 10.
