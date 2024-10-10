<?php
require "../config/config.php";

class students
{
    private $action, $conn, $status, $id, $name, $surname, $carnet, $grade, $section;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->surname = $formData["surname"];
        $this->carnet = $formData["carnet"];
        $this->grade = $formData["grade"];
        $this->section = $formData["section"];
        $this->conn = new dbConfig();
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

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name != 'status' ORDER BY ordinal_position;";

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

        $sql = "SELECT s.id, CONCAT(s.name[1], ' ', s.name[2]) as name, s.carnet, s.grades, s.status, CONCAT(g.name, ' ', se.name) as grades FROM students s RIGHT JOIN grades g ON g.id = s.grades[1] RIGHT JOIN sections se ON se.id = s.grades[2] WHERE s.status = :status ORDER BY id DESC";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':status', $status, PDO::PARAM_STR);
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
        
        $sql = "SELECT s.id, s.name[1] as name, s.name[2] as surname, s.carnet, s.grades[1] as grade, s.grades[2] as section FROM students s WHERE id = :id";

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
        
        $sql = "SELECT CONCAT(s.name[1], ' ', s.name[2]) as name FROM students s WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
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
        $surname = $this->surname;
        $carnet = $this->carnet;
        $grade = $this->grade;
        $section = $this->section;

        $sql = "SELECT CONCAT(name[1], ' ', name[2]) AS name FROM students WHERE carnet = :carnet;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':carnet', $carnet, PDO::PARAM_STR);
        $stmt->execute();
        $student = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El carnet ya esta ingresado en el estudiante $student.",
                'errorType' => "User Error"
            ]));

        $sql = "INSERT INTO students(name[1], name[2], carnet, grades[1], grades[2]) VALUES(:name, :surname, :carnet, :grade, :section);";
        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt ->bindParam(':surname', $surname, PDO::PARAM_STR);
        $stmt ->bindParam(':carnet', $carnet, PDO::PARAM_STR);
        $stmt ->bindParam(':grade', $grade, PDO::PARAM_STR);
        $stmt ->bindParam(':section', $section, PDO::PARAM_STR);
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
        $surname = $this->surname;
        $carnet = $this->carnet;
        $grade = $this->grade;
        $section = $this->section;

        $sql = "SELECT CONCAT(name[1], ' ', name[2]) AS name FROM students WHERE carnet = :carnet AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':carnet', $carnet, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $student = $stmt->fetch()['name'];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El carnet ya esta ingresado en el estudiante $student.",
                'errorType' => "User Error"
            ]));
        
        $sql = "UPDATE students SET name[1] = :name, name[2] = :surname, carnet = :carnet, grades[1] = :grade, grades[2] = :section WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt ->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt ->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt ->bindParam(':surname', $surname, PDO::PARAM_STR);
        $stmt ->bindParam(':carnet', $carnet, PDO::PARAM_STR);
        $stmt ->bindParam(':grade', $grade, PDO::PARAM_STR);
        $stmt ->bindParam(':section', $section, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        
        $sql = "UPDATE students SET status = 'Deshabilitado' WHERE id = :id";

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
        
        $sql = "UPDATE students SET status = 'Habilitado' WHERE id = :id";

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
    $s = new students(formData: $_POST);
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
