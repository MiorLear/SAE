<?php
require "../config/config.php";

class controlLog
{
    private $action, $conn, $id, $content, $seen;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->id = $formData["id"];
        $this->content = $formData["content"];
        $this->seen = $formData["seen"];
        $this->conn = new dbConfig();
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "callContent":
                $this->callContent();
                break;
            case "readContent":
                $this->readContent();
                break;
            case "insertLog":
                $this->insertLog();
                break;
            default:
                exit(json_encode(
                    value:
                    array(
                        "error" => "Error Inesperado",
                        "errorType" => "Server Error",
                        "errorDetails" => "No action selected in the function.",
                        "suggestion" => "Reporta el error a un administrador.",
                        "logout" => false
                    )
                ));
        }
    }

    private function insertLog(): void
    {
        $conn = $this->conn->getConnection();
        $content = $this->content;

        $sql = "INSERT INTO control_log(content) VALUES(:content) ";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(":content", $content, PDO::PARAM_STR);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success"
        )));
    }

    private function callContent(): void
    {
        $conn = $this->conn->getConnection();

        $sql = 
        "SELECT 
            cl.id, 
            cl.content->>'title' AS title, 
            cl.content->>'author' AS author, 
            cl.content->>'date' AS date, 
            COALESCE(
                CASE 
                    WHEN array_length(s.name, 1) >= 2 THEN CONCAT(s.name[1], ' ', s.name[2])
                    ELSE s.name[1] 
                END,
                CASE 
                    WHEN array_length(u.name, 1) >= 2 THEN CONCAT(u.name[1], ' ', u.name[2])
                    ELSE u.name[1] 
                END,
                g.name,
                l.name,
                r.name,
                'no disponible'
            ) AS element 
        FROM 
            control_log cl 
        LEFT JOIN 
            students s ON (cl.content->>'table' = 'students' AND s.id = (cl.content->>'ID')::INT) 
        LEFT JOIN 
            users u ON (cl.content->>'table' = 'users' AND u.id = (cl.content->>'ID')::INT) 
        LEFT JOIN 
            grades g ON (cl.content->>'table' = 'grades' AND g.id = (cl.content->>'ID')::INT) 
        LEFT JOIN 
            levels l ON (cl.content->>'table' = 'levels' AND l.id = (cl.content->>'ID')::INT) 
        LEFT JOIN 
            roles r ON (cl.content->>'table' = 'roles' AND r.id = (cl.content->>'ID')::INT) 
        ORDER BY 
            cl.id DESC;
        ";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function readContent(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT content FROM control_log WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $stmt->fetch()["content"],
        )));
    }
}

try {
    session_start();
    $s = new controlLog(formData: $_POST);
} catch (\PDOException $th) {
    exit(json_encode(value: array(
        "error" => "Error Inesperado",
        "errorType" => "Server Error",
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador.",
        "logout" => false
    )));
} catch (\Throwable $th) {
    exit(json_encode(value: array(
        "error" => "Error Inesperado",
        "errorType" => "Server Error",
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador.",
        "logout" => false
    )));
}
