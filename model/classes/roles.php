<?php
require "../config/config.php";

class roles
{
    private $action, $conn, $status, $id, $name, $permissions;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->conn = new dbConfig();
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->permissions = $formData["permissions"];
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "callSelect":
                $this->callSelect();
                break;
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

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'roles' AND column_name != 'status' ORDER BY ordinal_position;";

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

        $sql = "SELECT id, name FROM roles WHERE status = 'Habilitado' ORDER BY id DESC;";
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

        $sql = "SELECT r.id AS id, r.name, string_agg(DISTINCT p.name, ', ') AS permissions_id, COUNT(DISTINCT u.id) AS students_quantity, r.status FROM roles r LEFT JOIN permissions p ON p.id = ANY(r.permissions_id) LEFT JOIN users u ON r.id = u.rol_id WHERE r.status = :status GROUP BY r.id ORDER BY id DESC;";
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

        $sql = "SELECT id, name, permissions_id FROM roles WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => array(
                "id" => $response["id"],
                "name" => $response["name"],
                "permissions_id" => array_map(callback: 'intval', array: explode(separator: ',', string: str_replace(search: '{', replace: '', subject: str_replace(search: '}', replace: '', subject: $response["permissions_id"])))),
            )
        )));
    }

    private function callName(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT name FROM roles WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function add(): void
    {
        $conn = $this->conn->getConnection();
        $name = $this->name;
        $permissions = "{" . $this->permissions . "}";

        $sql = "SELECT name FROM roles WHERE name = :name;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        $rolename = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El rol ingresado ya existe ($rolename).",
                'errorType' => "User Error"
            ]));

        $sql = "INSERT INTO roles(name, permissions_id) VALUES(:name, :permissions_id);";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':permissions_id', $permissions, PDO::PARAM_STR);
        $stmt->execute();

        $sql = "SELECT MAX(id) AS id FROM roles;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
            "id" => $stmt->fetch()["id"]
        )));
    }

    private function edit(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        $name = $this->name;
        $permissions = "{" . $this->permissions . "}";

        $sql = "SELECT name FROM roles WHERE name = :name AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $rolename = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El rol ingresado ya existe ($rolename).",
                'errorType' => "User Error"
            ]));

        $sql = "UPDATE roles SET name = :name, permissions_id = :permissions_id WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':permissions_id', $permissions, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "UPDATE roles SET status = 'Deshabilitado' WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }

    private function rehabilitate(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "UPDATE roles SET status = 'Habilitado' WHERE id = :id";

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
    $r = new roles(formData: $_POST);
} catch (\PDOException $th) {
    exit(json_encode(value: array(
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    )));
} catch (\Throwable $th) {
    exit(json_encode(value: array(
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    )));
}
