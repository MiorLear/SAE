<?php

require('../config/config.php');
require('../../plugins/fpdf/fpdf.php');



class familyPopulationReport
{
    private $conn, $pdf;
    private $id, $formData;

    public function __construct($title)
    {
        $this->conn = new dbConfig();
        $this->pdf = new PDF($title);
        $this->createReport();
    }

    private function createReport(): void
    {
        $conn = $this->conn->getConnection();

        // The SQL query
        $sql = "SELECT 
    s.name[2] AS student_name, 
    CONCAT(events.name, ' (', EXTRACT(year FROM TO_DATE(events.settings->'settings'->>'date', 'DD/MM/YYYY')), ')') AS event_name,
    COUNT(*) AS student_count, 
    totalPrices.totalPrice AS card_price, -- Precio de la tarjeta sin multiplicar
    COUNT(*) * totalPrices.totalPrice AS total_value -- Precio multiplicado por la cantidad de veces que el estudiante está asociado
FROM 
    events
JOIN 
    jsonb_each(data->'cards') AS card ON true
LEFT JOIN 
    students s ON card.value->>'student_id' = s.id::text
LEFT JOIN (
    -- Subconsulta para calcular el total de precios
    SELECT 
        SUM(CAST(ROUND(CAST(REPLACE(TRIM(menu.value->>'price'), '\"', '') AS NUMERIC)) AS INTEGER)) + 
        CAST(ROUND(CAST(REPLACE(TRIM(settings->'settings'->>'price'), '\"', '') AS NUMERIC)) AS INTEGER) AS totalPrice,
        events.settings
    FROM 
        events, 
        jsonb_each(settings->'complements') AS menu,
        jsonb_each(settings->'model'->'complements') AS complement  
    WHERE 
        complement.key = menu.value->>'id' 
    GROUP BY 
        events.settings
) AS totalPrices ON totalPrices.settings = events.settings
WHERE 
    card.value->>'payed' = 'false'
GROUP BY 
    s.name[2], event_name, totalPrices.totalPrice
ORDER BY 
    student_name, event_name;

";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll();

        // Debugging output
// print_r($data);
// exit; // Stop execution to check the data

        // PDF Configuration
        $this->pdf->AliasNbPages();
        $this->pdf->AddPage();
        $this->pdf->SetAutoPageBreak(true, 20);
        $this->pdf->SetTopMargin(500);
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(10);
        $this->pdf->SetX(15);
        $this->pdf->SetFillColor(255, 210, 0);
        $this->pdf->SetDrawColor(255, 255, 255);

        // Header for the table
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(44, 12, utf8_decode('Familia'), 1, 0, 'C', 1);
        $this->pdf->Cell(44,  12, utf8_decode('Tarjetas Pendientes'), 1, 0, 'C', 1);
        $this->pdf->Cell(44, 12, utf8_decode('Precio Unitario'), 1, 0, 'C', 1);
        $this->pdf->Cell(44, 12, utf8_decode('Monto Total'), 1, 0, 'C', 1);
        $this->pdf->Ln(); // Move to the next line after the header

        $event = null;
        foreach ($data as $val) {
            if ($val["event_name"] != $event) {
                $event = $val['event_name'];
                $this->pdf->SetFont('Arial', 'U', 10);
                $this->pdf->SetX(15);
                $this->pdf->SetFillColor(255, 255, 255);
                $this->pdf->SetDrawColor(65, 61, 61);
                $this->pdf->Cell(170, 12, utf8_decode($val['event_name']), 'B', 1, 'C');
                $this->pdf->Ln(0.5);
            }
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(44, 12, utf8_decode($val['student_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(44, 12, utf8_decode($val['student_count']), 'B', 0, 'C', 1);
            $this->pdf->Cell(44, 12, utf8_decode("$".$val['card_price']), 'B', 0, 'C', 1);
            $this->pdf->Cell(44, 12, utf8_decode("$".$val['total_value']), 'B', 0, 'C', 1);
            $this->pdf->Ln(); // Move to the next line after each row
        }

        if (empty($data)) {
            $this->pdf->SetFont('Arial', 'U', 10);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(170, 12, utf8_decode('Actualmente no hay información disponible para este reporte.'), 'B', 1, 'C');
            $this->pdf->Ln(0.5);
        }

        $this->pdf->Output('', "Reporte de Familias Pendientes de Pago.pdf");

    }
}

// Exception handling
try {
    session_start();
    $em = new familyPopulationReport("Familias Pendientes de Pago");
} catch (\PDOException $th) {
    exit(json_encode([
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        "actionDone" => $_POST["action"],
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    ]));
} catch (\Throwable $th) {
    exit(json_encode([
        'error' => 'Error Inesperado',
        "errorType" => "Server Error",
        "actionDone" => $_POST["action"],
        'errorDetails' => $th->getMessage(),
        "suggestion" => "Reporta el error a un administrador."
    ]));
}
