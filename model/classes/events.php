<?php
require "../config/config.php";

class roles
{
    private $action, $conn, $status, $id, $name, $price, $date, $levels, $settings;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->conn = new dbConfig();
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->price = $formData["price"];
        $this->date = $formData["date"];
        $this->levels = $formData["levels"];
        $this->settings = $formData["settings"];
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
            case "callComplements":
                $this->callComplements();
                break;
            case "callName":
                $this->callName();
                break;
            case "add":
                $this->add();
                break;
            case "editSettings":
                $this->editSettings();
            case "editComplements":
                $this->editComplements();
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

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'events' AND column_name != 'status' ORDER BY ordinal_position;";

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

        $sql = "SELECT id, name FROM events WHERE status = 'Habilitado' ORDER BY id DESC;";
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
                $opt = "!=";
                break;
            case 'unable':
                $opt = "=";
                break;
            default:
                $opt = "!=";
                break;
        }

        $sql = "SELECT id, name, settings->'settings'->>'date' AS date, settings->'settings'->>'levels' AS levels, EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')) AS year, status FROM events WHERE status $opt 'Deshabilitado' ORDER BY id DESC;";
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

        $sql = "SELECT id, name, settings->'settings'->>'date' AS date, settings->'settings'->>'levels' AS levels, settings->'settings'->>'price' AS price FROM events WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => array(
                "id" => $response["id"],
                "name" => $response["name"],
                "price" => $response["price"],
                "date" => $response["date"],
                "levels" => $response["levels"],
            )
        )));
    }

    private function callComplements(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT id, settings->'complements' AS complements FROM events WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
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

        $sql = "SELECT name FROM events WHERE id = :id";

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
        $settings = $this->settings;

        $date = json_decode(json: $settings)->settings->date;

        $sql = "SELECT name, EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')) as year FROM events WHERE name = :name AND EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')) = EXTRACT(year FROM TO_DATE(:date, 'DD/MM/YYYY'));";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch();

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El evento ingresado ya existe (".$eventInfo['name']." ".$eventInfo['year']."). ",
                'errorType' => "User Error"
            ]));

        $sql = "INSERT INTO events(name, settings) VALUES(:name, :settings);";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':settings', $settings, PDO::PARAM_STR);
        $stmt->execute();

        $sql = "SELECT MAX(id) AS id FROM events;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
            "id" => $stmt->fetch()["id"]
        )));
    }

    private function editSettings(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        $name = $this->name;
        $settings = $this->settings;

        $sql = "SELECT status FROM events WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $eventstatus = $stmt->fetch()["status"];

        if ($eventstatus != "Pendiente de Iniciar")
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El evento $name ya ha sido inicializado, no se puede editar.",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT name, EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')) as year FROM events WHERE name = :name AND EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')) = EXTRACT(year FROM now()) AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch();

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El evento ingresado ya existe (".$eventInfo['name']." ".$eventInfo['year'].").",
                'errorType' => "User Error"
            ]));

        $sql = "UPDATE events SET name = :name, settings = jsonb_set(settings, '{settings}', :settings) WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':settings', $settings, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }

    private function editComplements(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;
        $name = $this->name;
        $settings = $this->settings;

        $sql = "SELECT status FROM events WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventstatus = $stmt->fetch()['status'];

        if ($eventstatus != "Pendiente de Iniciar")
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "El evento $name ya ha sido inicializado ($id). Estado: $eventstatus,  no se puede editar.",
                'errorType' => "User Error"
            ]));

        $sql = "UPDATE events SET settings = jsonb_set(settings, '{complements}', :complements) WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':complements', $settings, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "UPDATE events SET status = 'Deshabilitado' WHERE id = :id";

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

        $sql = "UPDATE events SET status = 'Pendiente de Iniciar' WHERE id = :id";

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
