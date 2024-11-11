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

        $sql = "SELECT payment_id.key AS paymentId, payment_id.value->>'cashier' AS cashier, payment_id.value->>'client' AS client, payment_id.value->>'total' AS total, payment_id.value->>'description' AS description, payment_id. value->>'date' AS date FROM events, jsonb_each(data->'payment') AS payment_id WHERE events.id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $_GET["eventID"], PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetchAll();

        // Debugging output
        // print_r($data);
        // exit; // Stop execution to check the data

        // PDF Configuration
        $this->pdf->AliasNbPages();
        $this->pdf->AddPage(true);
        $this->pdf->SetAutoPageBreak(true, 20);
        $this->pdf->SetTopMargin(500);
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(10);
        $this->pdf->SetX(12);
        $this->pdf->SetFillColor(255, 210, 0);
        $this->pdf->SetDrawColor(255, 255, 255);

        $isFirstPage = true;
        $borderColor = true;

        if ($isFirstPage) {
            // Header for the table
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell(20, 8, utf8_decode('Codigo'), 1, 0, 'C', 1);
            $this->pdf->Cell(35, 8, utf8_decode('Cajero'), 1, 0, 'C', 1);
            $this->pdf->Cell(35, 8, utf8_decode('Cliente'), 1, 0, 'C', 1);
            $this->pdf->Cell(80, 8, utf8_decode('Descripción'), 1, 0, 'C', 1);
            $this->pdf->Cell(20, 8, utf8_decode('Detalle'), 1, 0, 'C', 1);
            $this->pdf->Ln(); // Move to the next line after the header
            $isFirstPage = false;
        }

        foreach ($data as $val) {
            $this->pdf->SetFont('Arial', '', 9);
            $this->pdf->SetX(12);
            if ($borderColor) {
                $borderColor = false;
                $this->pdf->SetFillColor(255, 255, 255);
            } else {
                $borderColor = true;
                $this->pdf->SetFillColor(255, 246, 204);
            }
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(20, 6, utf8_decode($val['paymentid']), 'B', 0, 'C', 1);
            $this->pdf->Cell(35, 6, utf8_decode((strlen((trim($val['cashier']))) > 18 ? substr(trim($val['cashier']), 0, 18) . '...' : trim($val['cashier']))), 'B', 0, 'C', 1);
            $this->pdf->Cell(35, 6, utf8_decode((strlen((trim( $val['client']))) > 18 ? substr(trim($val['client']), 0, 18) . '...' : trim($val['client']))), 'B', 0, 'C', 1);
            $this->pdf->Cell(80, 6, utf8_decode( (strlen((trim($val['description']))) > 30 ? substr(trim($val['description']), 0, 30) . '...' : trim($val['description'])) . ' ' . $val['date']), 'B', 0, 'C', 1);
            $this->pdf->Cell(20, 6, utf8_decode("$" . $val['total']), 'B', 0, 'C', 1);
            $this->pdf->Ln(); // Move to the next line after each row
        }

        if (empty($data)) {
            $this->pdf->SetFont('Arial', 'U', 9);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(190, 6, utf8_decode('Actualmente no hay información disponible para este reporte.'), 'B', 1, 'C');
            $this->pdf->Ln(0.5);
        }

        date_default_timezone_set('America/El_Salvador');
        $this->pdf->Output('', utf8_decode("Reporte de Pagos en ". $_GET["name"] ." ".date('d/m/Y | h:i:s').".pdf"));

    }
}

// Exception handling
try {
    session_start();
    $em = new familyPopulationReport(utf8_decode("Reporte de Pagos en ". $_GET["name"]));
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
