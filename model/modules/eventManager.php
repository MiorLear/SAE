<?php
require('../config/config.php');

class eventManager
{
    private $action, $id, $json, $complementId, $forgottenCard, $cardsQty, $cardId, $studentId, $studentCarnet, $paymentId, $cashier, $client, $total, $description;

    public function __construct($formData)
    {
        $this->action = $formData['action'];
        $this->id = $formData['id'];
        $this->complementId = $formData['complementId'];
        $this->cardsQty = $formData['cardsQty'];
        $this->cardId = $formData['cardId'];
        $this->studentId = $formData['studentId'];
        $this->studentCarnet = $formData['studentCarnet'];
        $this->forgottenCard = $formData['forgottenCard'];
        $this->paymentId = $formData['paymentId'];
        $this->cashier = $formData['cashier'];
        $this->client = $formData['client'];
        $this->total = $formData['total'];
        $this->description = $formData['description'];
        $this->json = $formData['json'];
        $this->conn = new dbConfig();
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "getEvents":
                $this->getEvents();
                break;
            case "getGraphInfo":
                $this->getGraphInfo();
                break;
            case "getGeneralInfo":
                $this->getGeneralInfo();
                break;
            case "getEventComplements":
                $this->getEventComplements();
                break;
            case "getCard":
                $this->getCard();
                break;
            case "getCardToPay":
                $this->getCardToPay();
                break;
            case "getCardFromStudent":
                $this->getCardFromStudent();
                break;
            case "getCardOnlyFromStudent":
                $this->getCardFromStudent();
                break;
            case "getComplement":
                $this->getComplement();
                break;
            case "redeemCard":
                $this->redeemCard();
                break;
            case "payCard":
                $this->payCard();
                break;
            case "redeemComplement":
                $this->redeemComplement();
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
            case "getStudentIdFromCarnet":
                $this->getStudentIdFromCarnet();
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
    private function getGraphInfo(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT event_name, SUM(total_value) AS total_value FROM (SELECT CONCAT(events.name, ' (', EXTRACT(year FROM TO_DATE(events.settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS event_name, COUNT(*) * totalPrices.totalPrice AS total_value FROM events JOIN jsonb_each(data->'cards') AS card ON true LEFT JOIN students s ON card.value->>'student_id' = s.id::text LEFT JOIN (SELECT SUM(CAST(ROUND(CAST(REPLACE(TRIM(menu.value->>'price'), '\"', '') AS NUMERIC)) AS INTEGER)) + CAST(ROUND(CAST(REPLACE(TRIM(settings->'settings'->>'price'), '\"', '') AS NUMERIC)) AS INTEGER) AS totalPrice, events.settings FROM events, jsonb_each(settings->'complements') AS menu, jsonb_each(settings->'model'->'complements') AS complement WHERE complement.key = menu.value->>'id' GROUP BY events.settings) AS totalPrices ON totalPrices.settings = events.settings GROUP BY event_name, totalPrices.totalPrice) AS subquery GROUP BY event_name ORDER BY event_name;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $eventRevenues = $stmt->fetchAll();

        $sql = "SELECT SUM(total_value) AS grand_total FROM (SELECT CONCAT(events.name, ' (', EXTRACT(year FROM TO_DATE(events.settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS event_name, COUNT(*) * totalPrices.totalPrice AS total_value  FROM events JOIN jsonb_each(data->'cards') AS card ON true LEFT JOIN students s ON card.value->>'student_id' = s.id::text LEFT JOIN (SELECT SUM(CAST(ROUND(CAST(REPLACE(TRIM(menu.value->>'price'), '\"', '') AS NUMERIC)) AS INTEGER)) + CAST(ROUND(CAST(REPLACE(TRIM(settings->'settings'->>'price'), '\"', '') AS NUMERIC)) AS INTEGER) AS totalPrice, events.settings FROM events, jsonb_each(settings->'complements') AS menu, jsonb_each(settings->'model'->'complements') AS complement WHERE complement.key = menu.value->>'id' GROUP BY events.settings) AS totalPrices ON totalPrices.settings = events.settings GROUP BY event_name, totalPrices.totalPrice ) AS subquery;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $eventsTotalRevenue = $stmt->fetch();

        $sql = "SELECT COUNT(*) FROM events;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $totalEvents = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => 
                array("eventRevenues" => $eventRevenues, "eventsTotalRevenue" =>$eventsTotalRevenue["grand_total"], "totalEvents" =>$totalEvents["count"])
        )));
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

        $studentCount = $stmt->fetchColumn();

        exit(json_encode(array(
            "result" => "success",
            "content" => $studentCount,
        )));
    }
    private function getStudentIdFromCarnet(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT id, CONCAT(name[1], ' ', name[2]) AS name FROM students WHERE carnet = :carnet;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':carnet', $this->studentCarnet, PDO::PARAM_STR);
        $stmt->execute();

        $studentCount = $stmt->fetch();

        exit(json_encode(array(
            "result" => "success",
            "content" => $studentCount
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
    private function getCard(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT jsonb_pretty(e.data->'cards'->:cardId) AS cards FROM events e WHERE e.id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetch()["cards"];
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function getCardFromStudent(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT  id, CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name, settings->'settings'->>'price' as price, jsonb_pretty(value) AS card FROM events e, jsonb_each(e.data->'cards') AS card(key, value) WHERE value->>'student_id' = :studentId;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':studentId', $this->studentId, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetchAll();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventInfo,
        )));
    }
    private function getCardOnlyFromStudent(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT  id, CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name, settings->'settings'->>'price' as price, jsonb_pretty(value) AS card FROM events e, jsonb_each(e.data->'cards') AS card(key, value) WHERE e.id = :id AND value->>'student_id' = :studentId;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':studentId', $this->studentId, PDO::PARAM_STR);
        $stmt->execute();
        $eventInfo = $stmt->fetchAll();
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

        $sql = "SELECT COUNT(id) FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "Has ingresado una tarjeta sin registrar. ",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT data->'cards'->:cardId->'exchanged'  FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == '"true"')
            exit(json_encode(value: [
                'error' => "La tarjeta ya ha sido canjeada.",
                'suggestion' => "El código de la tarjeta ya fue canjeado",
                'errorType' => "User Error"
            ]));

        setlocale(LC_TIME, 'es_ES.UTF-8'); // Establece el idioma en español
        date_default_timezone_set('America/El_Salvador'); // Configura la zona horaria para El Salvador

        $fechaHora = strftime('%d/%m/%Y a las %I:%M %p');
        ucfirst($fechaHora);


        $sql = "UPDATE events SET data = jsonb_set(jsonb_set(data, '{cards, " . $this->cardId . ", exchangedDate}', '\"" . ucfirst($fechaHora) . "\"'), '{cards, " . $this->cardId . ", exchanged}', '\"true\"') WHERE id = :id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function payCard(): void
    {
        $conn = $this->conn->getConnection();

        $sql = "SELECT COUNT(id) FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "Has ingresado una tarjeta sin registrar. ",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT data->'cards'->:cardId->'payed' AS result, data->'cards'->:cardId->'payedDate' AS date  FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch();

        if ($result["result"] == '"true"')
        exit(json_encode(value: [
            'error' => "La tarjeta ya ha sido pagada.",
            'suggestion' => "La tarjeta fue pagada el " . $result["date"],
            'errorType' => "User Error"
        ]));

        setlocale(LC_TIME, 'es_ES.UTF-8'); // Establece el idioma en español
        date_default_timezone_set('America/El_Salvador'); // Configura la zona horaria para El Salvador

        $fechaHora = strftime('%d/%m/%Y a las %I:%M %p');
        ucfirst($fechaHora);


        $sql = "UPDATE events SET data = jsonb_set(jsonb_set(data, '{cards, " . $this->cardId . ", payedDate}', '\"" . ucfirst($fechaHora) . "\"'), '{cards, " . $this->cardId . ", payed}', '\"true\"') WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $modelArray = [
            $this->paymentId => [
                "paymentId" => $this->paymentId,
                "cashier" => $this->cashier,
                "client" => $this->client,
                "total" => $this->total,
                "description" => $this->description,
                "date" => $fechaHora,
            ],
        ];

        $model = json_encode($modelArray, JSON_FORCE_OBJECT);


        $sql = "UPDATE events SET data = jsonb_set(data, '{payment}', :model) WHERE id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->bindParam(':model', $model, PDO::PARAM_STR);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function redeemComplement(): void
    {
        $conn = $this->conn->getConnection();

        $sql = "SELECT COUNT(id) FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "Has ingresado una tarjeta sin registrar. ",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT data->'cards'->:cardId->'complements'->:complementId->'exchanged' FROM events WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':complementId', $this->complementId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == '"true"')
            exit(json_encode(value: [
                'error' => "La tarjeta ya ha sido canjeada.",
                'suggestion' => "El código de la tarjeta ya fue canjeado",
                'errorType' => "User Error"
            ]));

        setlocale(LC_TIME, 'es_ES.UTF-8'); // Establece el idioma en español
        date_default_timezone_set('America/El_Salvador'); // Configura la zona horaria para El Salvador

        $fechaHora = strftime('%d/%m/%Y a las %I:%M %p');
        ucfirst($fechaHora);


        $sql = "UPDATE events SET data = jsonb_set(jsonb_set(data, '{cards, " . $this->cardId . ", complements, " . $this->complementId . ", exchangedDate}', '\"" . ucfirst($fechaHora) . "\"'), '{cards, " . $this->cardId . ", complements, " . $this->complementId . ", exchanged}', '\"true\"') WHERE id = :id;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();

        exit(json_encode(value: array(
            "result" => "success",
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
    private function getEvents(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT id, CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name, settings->'settings'->>'price' as price FROM events e;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->execute();
        $eventName = $stmt->fetchAll();
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
    private function getCardToPay(): void
    {
        $conn = $this->conn->getConnection();
        $sql = "SELECT COUNT(id) FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->fetchColumn() == 0)
            exit(json_encode(value: [
                'error' => "Espera un momento.",
                'suggestion' => "Has ingresado una tarjeta sin registrar. ",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT data->'cards'->:cardId->'payed' AS result, data->'cards'->:cardId->'payedDate' AS date  FROM events WHERE jsonb_exists(data->'cards', :cardId) AND id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cardId', $this->cardId, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch();

        if ($result["result"] == '"true"')
            exit(json_encode(value: [
                'error' => "La tarjeta ya ha sido pagada.",
                'suggestion' => "La tarjeta fue pagada el " . $result["date"],
                'errorType' => "User Error"
            ]));

        $sql = "SELECT id, CONCAT(name, ' (', EXTRACT(year FROM TO_DATE(settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS name, settings->'settings'->>'price' AS price, (COUNT(data->'payment') + 1) AS paymentId FROM events e WHERE e.id = :id GROUP BY e.id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_STR);
        $stmt->execute();
        $eventName = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $eventName = array(
                "name" => $eventName["name"],
                "price" => $eventName["price"],
                "paymentId" => str_pad($eventName["paymentid"], 8, '0', STR_PAD_LEFT)
            ),
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

