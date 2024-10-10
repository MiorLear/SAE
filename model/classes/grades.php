<?php
require "../config/config.php";

class grades
{
    private $action, $conn, $status, $id, $name;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->conn = new dbConfig();
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "callColumns":
                $this->callColumns();
                break;
            case "callContent":
                $this->callContent();
                break;
            case "callInfo":
                $this->callInfo();
                break;
            case "callName":
                $this->callName();
                break;
            case "callSelect":
                $this->callSelect();
                break;
            case "add":
                $this->add();
                break;
            case "edit":
                $this->edit();
                break;
            case "disable":
                $this->disable();
                break;
            case "rehabilitate":
                $this->rehabilitate();
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

    private function callColumns(): void
    {
        $conn = $this->conn->getConnection();

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'grades' AND column_name != 'status' ORDER BY ordinal_position;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function callContent(): void
    {
        $conn = $this->conn->getConnection();
        switch ($this->status) {
            case 'enable':
                $status = "Habilitado";
                break;
            case 'unable':
                $status = "Deshabilitado";
                break;
            default:
                $status = "Habilitado";
                break;
        }

        $sql = "SELECT g.id, g.name, g.status, COUNT(s.id) AS students_quantity FROM grades g LEFT JOIN students s ON s.grades[1] = g.id WHERE g.status = :status GROUP BY g.id ORDER BY g.id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(":status", $status, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
    private function callInfo(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "SELECT id, name FROM grades WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function callName(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "SELECT name FROM grades WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function callSelect(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "SELECT id, name FROM grades WHERE status = 'Habilitado' ORDER BY id DESC";

        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $response = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function add(): void
    {
        $conn = $this->conn->getConnection();
        $name = $this->name;

        $sql = "SELECT name FROM grades WHERE name = :name";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        $gradesname = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El grado ingresado ya existe (" . $gradesname . ").",
                'errorType' => "User Error"
            ]));  

        $sql = "INSERT INTO grades(name) VALUES(:name);";
        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }

    private function edit(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        $name = $this->name;

        $sql = "SELECT name FROM grades WHERE name = :name AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $gradesname = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El grado ingresado ya existe (" . $gradesname . ").",
                'errorType' => "User Error"
            ]));  

        $sql = "UPDATE grades SET name = :name WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt ->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "UPDATE grades SET status = 'Deshabilitado' WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }

    private function rehabilitate(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "UPDATE grades SET status = 'Habilitado' WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
}

try {
    session_start();
    $g = new grades(formData: $_POST);
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
