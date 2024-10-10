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

        $sql = "SELECT * FROM control_log WHERE ORDER BY id DESC";

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

        $sql = "UPDATE control_log SET  WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
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
