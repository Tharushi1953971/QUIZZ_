<?php
// Database config
$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "quizz_app"; 

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die("Connection failed: " . $conn->connect_error);
}

// Handle login POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = trim($_POST['username']);
    $pass = trim($_POST['password']);

    if (empty($user) || empty($pass)) {
        echo "Username and password are required.";
        exit;
    }

    // Get user by username
    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        // Verify the hashed password
        if (password_verify($pass, $hashedPassword)) {
            echo "success";
        } else {
            echo "Incorrect username or password.";
        }
    } else {
        echo "Incorrect username or password.";
    }

    $stmt->close();
    $conn->close();
}
?>
