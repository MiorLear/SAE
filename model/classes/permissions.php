<?php
require "../config/config.php";

class permissions
{
    private $action, $conn, $id;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->id = $formData["id"];
        $this->conn = new dbConfig();
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "callSelect":
                $this->callSelect();
                break;
            case "callName":
                $this->callName();
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

    private function callSelect(): void
    {
        $conn = $this->conn->getConnection();

        if (array_filter($_SESSION["user"]["permissions"], function($permission) {
            return $permission['name'] === 'Administrar Plataforma' ? true : false;
        }))
            $sql = "SELECT id, name FROM permissions ORDER BY id DESC";
        else
            $sql = "SELECT id, name FROM permissions WHERE name != 'Administrar Plataforma' AND name != 'Administrar Módulos de Eventos' ORDER BY id DESC";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
    private function callName(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT name FROM permissions WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
}

try {
    session_start();
    $p = new permissions(formData: $_POST);
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
