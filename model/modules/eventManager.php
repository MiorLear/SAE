<?php
require('../config/config.php');

class eventManager
{
    private $action, $id, $json, $complementId, $forgottenCard, $cardsQty, $cardId, $studentCarnet;

    public function __construct($formData)
    {
        $this->action = $formData['action'];
        $this->id = $formData['id'];
        $this->complementId = $formData['complementId'];
        $this->cardsQty = $formData['cardsQty'];
        $this->cardId = $formData['cardId'];
        $this->studentCarnet = $formData['studentCarnet'];
        $this->forgottenCard = $formData['forgottenCard'];
        $this->json = $formData['json'];
        $this->conn = new dbConfig();
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "getGeneralInfo":
                $this->getGeneralInfo();
                break;
            case "getEventComplements":
                $this->getEventComplements();
                break;
            case "getComplement":
                $this->getComplement();
                break;
            case "redeemCard":
                $this->redeemCard();
                break;
            case "getComplements":
                $this->getComplements();
                break;
            case "getModelComplements":
                $this->getModelComplements();
                break;
            case "startEvent":
                $this->startEvent();
                break;
            case "endEvent":
                $this->endEvent();
                break;
            case "addCardstoEvent":
                $this->addCardstoEvent();
                break;
            case "getStudentsPopulation":
                $this->getStudentsPopulation();
                break;
            case "getFamilies":
                $this->getFamilies();
                break;
            case "getStudentsNumber":
                $this->getStudentsNumber();
                break;
            case "getCardModel":
                $this->getCardModel();
                break;
            case "createModelWithoutComplements":
                $this->createModelWithoutComplements();
                break;
            case "addComplementToModel":
                $this->addComplementToModel();
                break;
            case "addExtraSettings":
                $this->addExtraSettings();
                break;
            case "getExtraSettings":
                $this->getExtraSettings();
                break;
            case "removeComplementToModel":
                $this->removeComplementToModel();
                break;
            case "checkInitStatus":
                $this->checkInitStatus();
                break;
            case "checkCardExist":
                $this->checkCardExist();
                break;
            case "checkStudentExist":
                $this->checkStudentExist();
                break;
            case "initializeEvent":
                $this->initializeEvent();
                break;
            case "checkEventExist":
                $this->checkEventExist();
                break;
            case "getIdNameNPrice":
                $this->getIdNameNPrice();
                break;
            case "getName":
                $this->getName();
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
    private function getGeneralInfo(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT e.id, e.name, EXTRACT(year FROM TO_DATE(e.settings->'settings'->>'date', 'DD/MM/YYYY')) AS year, e.settings->'settings'->>'date' AS date, (CURRENT_DATE - TO_DATE(e.settings->'settings'->>'date', 'DD/MM/YYYY')) AS difference, e.settings->'settings'->>'price' AS price, jsonb_pretty(e.settings->'complements') AS complements, e.status, JSONB_AGG(l.name) AS levels FROM events e JOIN levels l ON l.id::TEXT = ANY(SELECT jsonb_array_elements_text(e.settings->'settings'->'levels')) WHERE e.id = :id GROUP BY e.id, e.name, e.settings, e.status;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function checkCardExist(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT COUNT(id) FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetchColumn();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function checkStudentExist(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT COUNT(id) FROM students WHERE carnet = :carnet;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':carnet', $this->studentCarnet, PDO::PARAM_STR);
        $stmt->execute();

        // Usar fetchColumn para obtener directamente el número de estudiantes
        $studentCount = $stmt->fetchColumn();

        exit(json_encode(array(
            "result" => "success",
            "content" => $studentCount, // Aquí se retorna el conteo directamente
        )));
    }

    private function getEventComplements(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT e.id, jsonb_pretty(e.settings->'complements') AS complements FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function getComplement(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(e.settings->'complements'->:complementId) AS complements FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':complementId', $this->complementId, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch()["complements"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function getComplements(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(e.settings->'complements') AS complements FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch()["complements"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function getModelComplements(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(e.settings->'model'->'complements') AS complements FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo["complements"],
        )));
    }
    private function getStudentsPopulation(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(jsonb_build_object('levels', jsonb_agg(jsonb_build_object('id', l.id, 'name', l.name, 'grades', (SELECT jsonb_agg( jsonb_build_object('id', g.id, 'name', g.name, 'sections', (SELECT jsonb_agg(jsonb_build_object('id', sec.id, 'name', sec.name, 'students', (SELECT jsonb_agg(jsonb_build_object('id', s.id, 'name', CONCAT(s.name[1], ' ', s.name[2]), 'lastname', s.name[2])) FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.id IS NOT NULL AND s.grades[1] = g.id AND s.grades[2] = sec.id))) FROM sections sec WHERE sec.id IN (SELECT DISTINCT s.grades[2] FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.grades[1] = g.id)))) FROM grades g WHERE g.id = ANY(l.grades)))))) AS resultado FROM events e JOIN levels l ON l.id::TEXT = ANY(SELECT jsonb_array_elements_text(e.settings->'settings'->'levels')) WHERE e.id = :id GROUP BY l.id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventLevels = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventLevels,
        )));
    }
    private function getFamilies(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(jsonb_build_object('levels', jsonb_agg(jsonb_build_object('id', l.id, 'name', l.name, 'grades', (SELECT jsonb_agg( jsonb_build_object('id', g.id, 'name', g.name, 'sections', (SELECT jsonb_agg(jsonb_build_object('id', sec.id, 'name', sec.name, 'family', (SELECT jsonb_agg(jsonb_build_object('name', s.name[2], 'students', (SELECT jsonb_agg(jsonb_build_object('id', stud.id, 'name', CONCAT(stud.name[1], ' ', stud.name[2])))FROM students stud WHERE stud.name[2] = s.name[2]))) FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.id IS NOT NULL AND s.grades[1] = g.id AND s.grades[2] = sec.id))) FROM sections sec WHERE sec.id IN (SELECT DISTINCT s.grades[2] FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.grades[1] = g.id)))) FROM grades g WHERE g.id = ANY(l.grades)))))) AS resultado FROM events e JOIN levels l ON l.id::TEXT = ANY(SELECT jsonb_array_elements_text(e.settings->'settings'->'levels')) WHERE e.id = :id GROUP BY l.id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventLevels = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventLevels,
        )));
    }
    private function getStudentsNumber(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT SUM((SELECT COUNT(*) FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.grades[1] = g.id AND s.grades[2] = sec.id)) AS total_students FROM events e JOIN levels l ON l.id::TEXT = ANY(SELECT jsonb_array_elements_text(e.settings->'settings'->'levels')) JOIN grades g ON g.id = ANY(l.grades) JOIN sections sec ON sec.id IN (SELECT DISTINCT s.grades[2] FROM (SELECT DISTINCT ON (s.name[2]) * FROM students s ORDER BY s.name[2], s.grades[1]) AS s WHERE s.grades[1] = g.id) WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventLevels = $stmt->fetch()["total_students"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => json_decode(json: $eventLevels),
        )));
    }
    private function getCardModel(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT e.id, jsonb_pretty(e.settings->'model') AS model FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response,
        )));
    }
    private function createModelWithoutComplements(): void
    {
        $conn = $this->conn->getConnection();

        $model = json_encode(value: array(
            "card_id" => "",
            "student_id" => "",
            "type" => "",
            "complements" => "{}",
            "exchanged" => false,
            "exchangedDate" => "",
            "payed" => false,
            "payedDate" => "",
            "delivered" => false,
            "deliveredDate" => "",
            "returned" => false,
            "returnedDate" => "false"
        ));

        $sql = "UPDATE events SET settings = jsonb_set(settings, '{model}', :model::jsonb) WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':model', $model, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success"
        )));
    }
    private function addCardstoEvent(): void
    {
        $conn = $this->conn->getConnection();

        $json = $this->json;

        $sql = "UPDATE events SET data = jsonb_set(data, '{cards}', :json, true), status = 'Listo' WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->bindParam(':json', $this->json, PDO::PARAM_STR);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
            "content" => $stmt->rowCount()
        )));
    }
    private function addExtraSettings(): void
    {
        $conn = $this->conn->getConnection();

        $cardsQty = $this->cardsQty;
        $forgottenCard = $this->forgottenCard;

        $sql = "UPDATE events SET settings = jsonb_set(jsonb_set(settings, '{settings, cardsQtyPerStudent}', '\"$cardsQty\"'),'{settings, forgottenCardPrice}', '\"$forgottenCard\"') WHERE id = :id;";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success"
        )));
    }
    private function redeemCard(): void
    {
        $conn = $this->conn->getConnection();

        $cardId = $this->cardId;
        $forgottenCard = $this->forgottenCard;

        $sql = "SELECT COUNT(data->'cards'->'$cardId') FROM events WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $response = $stmt->fetch()["count"];

        if ($response < 1)
            exit(json_encode(value: array(
                'error' => "Espera un momento.",
                'suggestion' => "La Tarjeta Ingresada no existe",
                "errorType" => "User Error"
            )));

        $sql = "UPDATE events SET settings = jsonb_set(data, '{cards, $cardId, exchanged}', 'true') WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $response = $stmt->fetch()["count"];

        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
    private function getExtraSettings(): void
    {
        $conn = $this->conn->getConnection();


        $sql = "SELECT settings->'settings'->>'cardsQtyPerStudent' AS cardsQtyPerStudent, settings->'settings'->>'forgottenCardPrice' AS forgottenCardPrice FROM events WHERE id = :id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
            "content" => $stmt->fetch()
        )));
    }
    private function addComplementToModel(): void
    {
        $complementId = $this->complementId;
        $conn = $this->conn->getConnection();
        $sql = "SELECT COUNT(e.settings->'model'->'complements') AS model FROM events e WHERE e.id = :id AND e.settings->'model'->'complements' != '\"{}\"';";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch()["model"];

        if ($response == "0") {
            $content = "desde 0";

            $model = json_encode(value: [
                "card_id" => "",
                "student_id" => "",
                "type" => "",
                "complements" => [
                    strval(value: $complementId) => [
                        "id" => strval(value: $complementId),
                        "exchanged" => false,
                        "payed" => false,
                        "exchangedDate" => "",
                        "payedDate" => ""
                    ]
                ],
                "exchanged" => false,
                "exchangedDate" => "",
                "payed" => false,
                "payedDate" => "",
                "delivered" => false,
                "deliveredDate" => "",
                "returned" => false,
                "returnedDate" => "false"
            ], flags: JSON_FORCE_OBJECT);

            $sql = "UPDATE events SET settings = jsonb_set(settings, '{model}', :model) WHERE id = :id;";
            $stmt = $conn->prepare(query: $sql);
            $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
            $stmt->bindParam(':model', $model, PDO::PARAM_STR);
            $stmt->execute();
        } else {
            $content = "añadido a existente";

            $model = json_encode(value: [
                strval(value: $complementId) => [
                    "id" => strval(value: $complementId),
                    "exchanged" => false,
                    "payed" => false,
                    "exchangedDate" => "",
                    "payedDate" => ""
                ]
            ], flags: JSON_FORCE_OBJECT);


            $sql = "UPDATE events SET settings = jsonb_set(settings, '{model, complements}', settings->'model'->'complements' || :model) WHERE id = :id;";
            $stmt = $conn->prepare(query: $sql);
            $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
            $stmt->bindParam(':model', $model, PDO::PARAM_STR);

            $stmt->execute();
        }
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $content . " complement_id: " . $complementId
        )));
    }
    private function removeComplementToModel(): void
    {
        $conn = $this->conn->getConnection();
        $content = "";
        $sql = "UPDATE events SET settings = jsonb_set(settings,'{model}', (settings->'model')::jsonb || jsonb_build_object('complements',(settings->'model'->'complements') - :complementId::text)) WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':complementId', $this->complementId, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function checkInitStatus(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT CASE WHEN status = 'Pendiente de Iniciar' THEN '0' WHEN  settings-> 'model' IS NULL THEN '1' WHEN settings->'settings'->>'cardsQtyPerStudent' IS NULL OR settings->'settings'->>'forgottenCardPrice' IS NULL THEN '2'  WHEN data->'cards' IS NULL THEN '3' ELSE '4' END AS result FROM events WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch()["result"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }
    private function initializeEvent(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "UPDATE events SET status = 'Inicializado' WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        $sql = "SELECT CASE WHEN settings->'complements' = '{}' THEN 1 ELSE 0 END FROM events WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch()["case"];

        if ($response == "1") {
            $model = json_encode(value: array(
                "card_id" => "",
                "student_id" => "",
                "type" => "",
                "complements" => "{}",
                "exchanged" => false,
                "exchangedDate" => "",
                "payed" => false,
                "payedDate" => "",
                "delivered" => false,
                "deliveredDate" => "",
                "returned" => false,
                "returnedDate" => "false"
            ));

            $sql = "UPDATE events SET settings = jsonb_set(settings, '{model}', :model::jsonb) WHERE id = :id;";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
            $stmt->bindParam(':model', $model, PDO::PARAM_STR);
            $stmt->execute();
        }

        exit(json_encode(value: array(
            "result" => "success"
        )));
    }
    private function startEvent(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "UPDATE events SET status = 'En Curso' WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success"
        )));
    }
    private function endEvent(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "UPDATE events SET status = 'Finalizado' WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success"
        )));
    }
    private function getName(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventName = $stmt->fetch()["name"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventName,
        )));
    }
    private function getIdNameNPrice(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT id, CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name, settings->'settings'->>'price' as price FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventName = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventName,
        )));
    }
    private function checkEventExist(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT COUNT(e.id) as check, e.status FROM events e WHERE e.id = :id GROUP BY e.status;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response,
        )));
    }
}

try {
    session_start();
    $em = new eventManager(formData: $_POST);
} catch (\PDOException $th) {
    exit(json_encode(value: array(
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        "actionDone" => $_POST["action"],
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    )));
} catch (\Throwable $th) {
    exit(json_encode(value: array(
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        "actionDone" => $_POST["action"],
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    )));
}

