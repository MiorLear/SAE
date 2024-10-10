<?php
require "../config/config.php";

class sections
{
    private $action, $conn;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
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
            case "callSelect":
                $this->callSelect();
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

    private function callContent(): void
    {
        $conn = $this->conn->getConnection();

        $sql = "SELECT id, name FROM sections ORDER BY id DESC";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
    private function callSelect(): void
    {
        $conn = $this->conn->getConnection();

        $sql = "SELECT id, name FROM sections ORDER BY id ASC";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
}

try {
    session_start();
    $s = new sections(formData: $_POST);
} catch (\PDOException $th) {
    exit(json_encode(value: array(
        'error' => $th->getMessage(),
        "errorType" => "Server Error"
    )));
} catch (\Throwable $th) {
    exit(json_encode(value: array(
        'error' => $th->getMessage(),
        "errorType" => "Server Error"
    )));
}
