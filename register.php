<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quizz_app";

file_put_contents("debug.txt", print_r($_POST, true));
error_reporting(E_ALL);
ini_set('display_errors', 1);


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    if (!$user || !$pass) {
        echo "Username and password are required.";
        exit;
    }

    // Check if user already exists
    $check = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check->bind_param("s", $user);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "Username already exists.";
    } else {
        $hashed = password_hash($pass, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $user, $hashed);
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Failed to register.";
        }
        $stmt->close();
    }
    $check->close();
}
$conn->close();
?>
