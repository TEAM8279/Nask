<?php

class Database extends SQLite3
{
    function __construct() {
        // Open or create the database file
        $this->open('nask.db');

        // Create the table if it doesn't exist
        $this->exec('CREATE TABLE IF NOT EXISTS nask_table (
                        id INTEGER PRIMARY KEY,
                        token TEXT UNIQUE,
                        notes TEXT,
                        tasks TEXT
                    )');
    }
}

function generate_token($length=32) {
    try {
        return bin2hex(random_bytes($length));
    } catch (\Random\RandomException $e) {
        echo $e;
    }
}

function get_new_token() {
    // Open or create the database file
    $db = new Database();
    if (!$db) {
        echo $db->lastErrorMsg();
        return;
    }

    // Attempt to generate a new unique token
    do {
        // Generate a new token
        $token = generate_token();

        // Check if the token already exists in the database
        $query = "SELECT COUNT(*) as count FROM nask_table WHERE token = '$token'";
        $result = $db->querySingle($query);

        // If the token already exists, regenerate a new one and retry
    } while ($result > 0);

    // Initialize notes and tasks
    $notes = '[]';
    $tasks = '[]';

    // Insert the new token, notes, and tasks into the database
    $query = "INSERT INTO nask_table (token, notes, tasks) VALUES ('$token', '$notes', '$tasks')";
    $result = $db->exec($query);

    // Check if the insertion was successful
    if (!$result) {
        echo "Error inserting token into database";
        return;
    }

    // Close the database connection
    $db->close();

    // Return the generated token in JSON format
    $response = array('token' => $token);
    echo json_encode($response);
}


function get_data($token) {
    // Open or create the database file
    $db = new Database();
    if (!$db) {
        echo $db->lastErrorMsg();
        return;
    }

    // Prepare a statement to select the notes and tasks associated with the token
    $query = "SELECT notes, tasks FROM nask_table WHERE token = :token";
    $stmt = $db->prepare($query);

    // Bind the token parameter
    $stmt->bindValue(':token', $token, SQLITE3_TEXT);

    // Execute the statement
    $result = $stmt->execute();

    // Fetch the result
    $row = $result->fetchArray(SQLITE3_ASSOC);

    // Close the statement and the database connection
    $stmt->close();
    $db->close();

    // If no result found for the token, return an error message
    if (!$row) {
        echo json_encode(array("error" => "Token not found"));
        return;
    }

    // Prepare the response in JSON format
    $response = array(
        "notes" => json_decode($row['notes']),
        "tasks" => json_decode($row['tasks'])
    );

    // Print the response in JSON format
    echo json_encode($response);
}


function update_notes($token, $notes) {
    // Validate that $notes is a valid JSON array
    $decoded_notes = json_decode($notes, true);
    if ($decoded_notes === null || !is_array($decoded_notes)) {
        echo json_encode(array("error" => "Invalid JSON format for notes"));
        return;
    }

    // Validate the structure of each note object
    foreach ($decoded_notes as $note) {
        if (!isset($note['timestamp']) || !isset($note['title']) || !isset($note['note']) || !isset($note['tags']) || !is_array($note['tags'])) {
            echo json_encode(array("error" => "Each note object must contain 'timestamp', 'title', 'note', and 'tags' (an array of strings)"));
            return;
        }
        foreach ($note['tags'] as $tag) {
            if (!is_string($tag)) {
                echo json_encode(array("error" => "Each tag within 'tags' must be a string"));
                return;
            }
        }
    }

    // Open or create the database file
    $db = new Database();
    if (!$db) {
        echo $db->lastErrorMsg();
        return;
    }

    // Prepare a statement to update the notes for the specified token
    $query = "UPDATE nask_table SET notes = :notes WHERE token = :token";
    $stmt = $db->prepare($query);

    // Bind the token and notes parameters
    $stmt->bindValue(':token', $token, SQLITE3_TEXT);
    $stmt->bindValue(':notes', $notes, SQLITE3_TEXT);

    // Execute the statement
    $result = $stmt->execute();

    // Close the statement and the database connection
    $stmt->close();
    $db->close();

    // Check if the update was successful
    if (!$result) {
        echo json_encode(array("error" => "Error updating notes"));
        return;
    }

    // Return a success message
    echo json_encode(array("message" => "Notes updated successfully"));
}



function update_tasks($token, $tasks) {
    // Validate that $tasks is a valid JSON array
    $decoded_tasks = json_decode($tasks, true);
    if ($decoded_tasks === null || !is_array($decoded_tasks)) {
        echo json_encode(array("error" => "Invalid JSON format for tasks"));
        return;
    }

    // Validate the structure of each task object
    foreach ($decoded_tasks as $task) {
        if (!isset($task['timestamp']) || !isset($task['task']) || !isset($task['done'])) {
            echo json_encode(array("error" => "Each task object must contain 'timestamp', 'task', and 'done'"));
            return;
        }
    }

    // Open or create the database file
    $db = new Database();
    if (!$db) {
        echo $db->lastErrorMsg();
        return;
    }

    // Prepare a statement to update the tasks for the specified token
    $query = "UPDATE nask_table SET tasks = :tasks WHERE token = :token";
    $stmt = $db->prepare($query);

    // Bind the token and tasks parameters
    $stmt->bindValue(':token', $token, SQLITE3_TEXT);
    $stmt->bindValue(':tasks', $tasks, SQLITE3_TEXT);

    // Execute the statement
    $result = $stmt->execute();

    // Close the statement and the database connection
    $stmt->close();
    $db->close();

    // Check if the update was successful
    if (!$result) {
        echo json_encode(array("error" => "Error updating tasks"));
        return;
    }

    // Return a success message
    echo json_encode(array("message" => "Tasks updated successfully"));
}


// Simple router function
function routeRequest($requestUri) {
    // Extracting the authorization header
    $headers = apache_request_headers();
    $authorizationHeader = isset($headers['authorization']) ? $headers['authorization'] : '';

    // Check if the authorization header is present and starts with 'Bearer '
    if (strpos($authorizationHeader, 'Bearer ') === 0) {
        // Extract the token part
        $token = substr($authorizationHeader, 7); // Removing 'Bearer ' prefix
    } else {
        $token = null; // No token provided for unprotected routes
    }

    $tokens = explode('/', $requestUri);

    // Assuming the URI is in the format /endpoint
    $endpoint = end($tokens);

    switch ($endpoint) {
        case 'token':
            get_new_token();
            break;
        case 'datas':
            if ($token !== null) {
                get_data($token);
            } else {
                echo "Access denied. Token required for this endpoint.";
            }
            break;
        case 'notes':
            if ($token !== null) {
                update_notes($token, $_POST['notes']); // Assuming notes are sent via POST
            } else {
                echo "Access denied. Token required for this endpoint.";
            }
            break;
        case 'tasks':
            if ($token !== null) {
                update_tasks($token, $_POST['tasks']); // Assuming tasks are sent via POST
            } else {
                echo "Access denied. Token required for this endpoint.";
            }
            break;
        default:
            echo "Invalid endpoint";
    }
}

// Example usage
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    routeRequest($_SERVER['REQUEST_URI']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    routeRequest($_SERVER['REQUEST_URI']);
} else {
    echo "Unsupported request method";
}
?>
