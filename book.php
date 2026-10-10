<?php
header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Please submit the booking form."
    ]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$eventId = filter_var(
    $_POST["event_id"] ?? null,
    FILTER_VALIDATE_INT
);
$seats = filter_var(
    $_POST["seats"] ?? null,
    FILTER_VALIDATE_INT
);

if (
    $name === "" ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !$eventId ||
    !$seats ||
    $seats < 1 ||
    $seats > 10
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Enter valid booking details."
    ]);
    exit;
}

try {
    $check = $conn->prepare(
        "SELECT id, price FROM events WHERE id = ?"
    );
    $check->bind_param("i", $eventId);
    $check->execute();

    $event = $check->get_result()->fetch_assoc();
    $check->close();

    if (!$event) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Event not found in the database."
        ]);
        exit;
    }

    $total = (float)$event["price"] * $seats;

    $stmt = $conn->prepare(
        "INSERT INTO bookings
        (name, email, event_id, seats, total)
        VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssiid",
        $name,
        $email,
        $eventId,
        $seats,
        $total
    );

    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "success" => true,
        "message" => "Booking successful!",
        "total" => $total
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Booking failed. Check the database tables and columns."
    ]);
}

$conn->close();
?>