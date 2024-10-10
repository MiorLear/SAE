<?php
class dbConfig{

private $host = 'localhost';
private $db = 'sae';
private $port = '5432';
private $user = 'postgres';
private $password = 'postgres';
private $dsn;

private $key = 'SAECSSC';

private $options = 
[
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
private $conn;

public function __construct() {
    $this->dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->db};"; 
    $this->init();
}

private function init(): void
{
    $this->conn = new PDO(
        dsn: $this->dsn,
        username: $this->user,
        password: $this->password,
        options: $this->options
    );
}

public function getConnection() {
    return $this->conn;
}
}

try {
$db = new dbConfig();
$conn = $db->getConnection(); 
$sql = "SELECT * FROM users";
$stmt = $conn->query($sql);


} catch (PDOException $e) {
die($e->getMessage());
}
