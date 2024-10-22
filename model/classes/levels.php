<?php
require "../config/config.php";

class levels
{
    private $action, $conn, $status, $id, $name, $grade;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->conn = new dbConfig();
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->grade = $formData["grade"];
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
            case "callSelect":
                $this->callSelect();
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

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'levels' AND column_name != 'status' ORDER BY ordinal_position;";

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

        $sql = "SELECT l.id AS id, l.name, STRING_AGG(DISTINCT g.name, ', ') AS grades, COUNT(s.id) AS students_quantity, l.status FROM levels l JOIN grades g ON g.id = ANY(l.grades) LEFT JOIN students s ON s.grades[1] = g.id AND l.status = :status WHERE l.status = :status GROUP BY l.id ORDER BY l.id DESC;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(":status", $status, PDO::PARAM_STR);
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

        $sql = "SELECT id, name FROM levels WHERE status = 'Habilitado' ORDER BY id DESC";
        $stmt = $conn->prepare(query: $sql);
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

        $sql = "SELECT id, name, grades AS grade FROM levels WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => array(
                "id" => $response["id"],
                "name" => $response["name"],
                "grade" => array_map(callback: 'intval', array: explode(separator: ',', string: str_replace(search: '{', replace: '', subject: str_replace(search: '}', replace: '', subject: $response["grade"])))),
            )
        )));
    }

    private function callName(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT name FROM levels WHERE id = :id";

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
        $grade = "{" . $this->grade . "}";

        if ($name = "" || $this->grade == "")
            exit(json_encode(value: array(
                'error' => "Espera un momento.",
                'suggestion' => "No deje espacios en blanco",
                "errorType" => "User Error"
            )));

        $sql = "SELECT name FROM levels WHERE name = :name ";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
        $stmt->execute();
        $levelname = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El nivel ingresado ya existe ($levelname).",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT l.name AS name, g.name AS grades FROM levels l LEFT JOIN grades g ON g.id = ANY(l.grades) WHERE l.grades && :grades;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':grades', $grade, PDO::PARAM_INT);
        $stmt->execute();
        $levelgrades = $stmt->fetch();

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El grado ingresado: (" . $levelgrades['grades'] . ") pertenece al nivel: " . $levelgrades['name'] . ".",
                'errorType' => "User Error"
            ]));

        $sql = "INSERT INTO levels(name, grades) VALUES(:name, :grade);";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
        $stmt->bindParam(':grade', $grade, PDO::PARAM_STR);
        $stmt->execute();
        
        $sql = "SELECT MAX(id) AS id FROM levels;";
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
        $grade = "{" . $this->grade . "}";

        $sql = "SELECT name FROM levels WHERE name = :name AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $levelname = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El nivel ingresado ya existe ($levelname).",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT l.name AS name, g.name AS grades FROM levels l LEFT JOIN grades g ON g.id = ANY(l.grades) WHERE l.grades && :grades AND l.id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':grades', $grade, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $levelgrades = $stmt->fetch();

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El grado ingresado: (" . $levelgrades['grades'] . ") pertenece al nivel: " . $levelgrades['name'] . ".",
                'errorType' => "User Error"
            ]));

        $sql = "UPDATE levels SET name = :name, grades = :grade WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':grade', $grade, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "UPDATE levels SET status = 'Deshabilitado' WHERE id = :id";

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

        $sql = "UPDATE levels SET status = 'Habilitado' WHERE id = :id";

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
    $l = new levels(formData: $_POST);
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
