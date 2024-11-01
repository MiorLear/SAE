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
        $sql = "SELECT l.id AS level_id, l.name AS level_name, g.id AS grade_id, g.name AS grade_name, 
        sec.id AS section_id, sec.name AS section_name, s.family_name, s.id AS student_id, 
        CONCAT(studentName1, ' ', studentName2) AS student_name 
        FROM levels l 
        JOIN grades g ON g.id = ANY(l.grades) 
        JOIN sections sec ON sec.id IN (SELECT DISTINCT s.grades[2] FROM students s WHERE s.grades[1] = g.id) 
        JOIN (SELECT DISTINCT ON (s.name[2]) s.id, s.name[1] AS studentName1, s.name[2] AS studentName2, 
              s.name[2] AS family_name, s.grades[1] AS grade_1, s.grades[2] AS grade_2 
              FROM students s 
              ORDER BY s.name[2], s.grades[1] ) AS s 
        ON s.grade_1 = g.id AND s.grade_2 = sec.id 
        GROUP BY l.id, l.name, g.id, g.name, sec.id, sec.name, s.family_name, s.id, studentName1, studentName2 
        ORDER BY l.id;";

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

        // Initialize a flag to indicate if it is the first page
        $isFirstPage = true;

        // Header for the table - only show on the first page
        if ($isFirstPage) {
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell(30, 12, utf8_decode('Nivel'), 1, 0, 'C', 1);
            $this->pdf->Cell(30, 12, utf8_decode('Grado'), 1, 0, 'C', 1);
            $this->pdf->Cell(55, 12, utf8_decode('Sección'), 1, 0, 'C', 1);
            $this->pdf->Cell(55, 12, utf8_decode('Familia'), 1, 0, 'C', 1);
            $this->pdf->Ln(); // Move to the next line after the header
            $isFirstPage = false; // Set the flag to false after the header is added
        }

        // Loop through the data to generate table rows
        foreach ($data as $val) {
            $this->pdf->SetFont('Arial', '', 10);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(30, 12, utf8_decode($val['level_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(30, 12, utf8_decode($val['grade_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(55, 12, utf8_decode($val['section_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(55, 12, utf8_decode($val['family_name']), 'B', 0, 'C', 1);
            $this->pdf->Ln(); // Move to the next line after each row
        }

        // If there's no data, display a message
        if (empty($data)) {
            $this->pdf->SetFont('Arial', 'U', 10);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(170, 12, utf8_decode('Actualmente no hay información disponible para este reporte.'), 'B', 1, 'C');
            $this->pdf->Ln(0.5);
        }

        // Output the PDF
        $this->pdf->Output();
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
        $this->pdf->Cell(30, 12, utf8_decode('Nivel'), 1, 0, 'C', 1);
        $this->pdf->Cell(30, 12, utf8_decode('Grado'), 1, 0, 'C', 1);
        $this->pdf->Cell(110, 12, utf8_decode('Familia'), 1, 0, 'C', 1);
        $this->pdf->Ln(); // Move to the next line after the header

        foreach ($data as $val) {
            $this->pdf->SetFont('Arial', '', 10);
            $this->pdf->SetX(15);
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetDrawColor(65, 61, 61);
            $this->pdf->Cell(30, 12, utf8_decode($val['level_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(30, 12, utf8_decode($val['grade_name'] . " " . $val['section_name']), 'B', 0, 'C', 1);
            $this->pdf->Cell(110, 12, utf8_decode($val['family_name']), 'B', 0, 'C', 1);
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

        $this->pdf->Output('', "Reporte de Población de Familiar.pdf");

    }
}

// Exception handling
try {
    session_start();
    $em = new familyPopulationReport(utf8_decode("Reporte de Poblacion de Familiar"));
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
