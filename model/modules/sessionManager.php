<?php
require('../config/config.php');

class sessionManager
{
    private $action, $conn, $mail, $pass;

    public function __construct($formData)
    {
        $this->action = $formData['action'];
        $this->mail = $formData['mail'];
        $this->pass = $formData['password'];
        $this->conn = new dbConfig();
        $this->actionManagement();
    }

    private function actionManagement(): void
    {
        $action = $this->action;
        switch ($action) {
            case "checkUserSession":
                $this->checkUserSession();
                break;
            case "startUserSession":
                $this->startUserSession();
                break;
            case "signOutUserSession":
                $this->signOutUserSession();
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
    private function startUserSession(): void
    {
        $conn = $this->conn->getConnection();

        $mail = $this->mail;
        $password = $this->pass;

        $sql = "SELECT status, pass, id FROM users WHERE mail = :mail";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(param: ":mail", var: $mail, type: PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch();

        if (!$user) 
            exit(json_encode(
                value:
                array(
                    "result" => "error",
                    "error" => "El correo ingresado no esta registrado",
                    "errorType" => 'User Error',
                    "suggestion" => "Revise su correo e ingreselo nuevamente",
                )
            ));
        

        if ($user["status"] == "Deshabilitado")
            exit(json_encode(
                value:
                array(
                    "result" => "error",
                    "error" => "Usuario Deshabilitado.",
                    "errorType" => 'User Error',
                    "suggestion" => "El usuario ingresado esta deshabilitado, consulte a un administrador esta información.",
                )
            ));

        if (!password_verify(password: $password, hash: $user['pass']))
            exit(json_encode(
                value:
                array(
                    "result" => "error",
                    "error" => "Credenciales Incorrectas",
                    "errorType" => 'User Error',
                    "suggestion" => "Ingresa tus credenciales nuevamente.",
                )
            ));

        $sql = "SELECT u.id, concat(u.name[1], ' ', u.name[2]) as name, u.mail, u.picture, r.name AS rol FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = :id";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(param: ":id", var: $user['id'], type: PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch();

        $sql = "SELECT name FROM permissions WHERE id = ANY(ARRAY(SELECT permissions_id FROM roles WHERE id = (SELECT rol_id FROM users WHERE id = :id)));";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(param: ":id", var: $user['id'], type: PDO::PARAM_STR);
        $stmt->execute();
        $userPermissions = $stmt->fetchAll();

        $userSession = array(
            'id' => $user['id'],
            'mail' => $user['mail'],
            'name' => $user['name'],
            'rol' => $user['rol'],
            'picture' => $user['picture'],
            'permissions' => $userPermissions
        );

        $_SESSION['user'] = $userSession;



        exit(json_encode(
            value: array("result" => "success", "content"=>$userSession)
        ));
    }
    private function checkUserSession(): void
    {
        $response = ($_SESSION['user'])
            ?
            json_encode(value:
                array(
                    'result' => 'success',
                    "status" => "validSession",
                    "content" => $_SESSION['user'],
                    "actionDone" => 'checkUserSession'
                ))
            :
            json_encode(value:
                array(
                    'result' => 'success',
                    "status" => "invalidSession",
                    "actionDone" => 'checkUserSession'
                ));

        exit($response);
    }
    private function signOutUserSession(): void
    {
        if ($_SESSION['user'])
            unset($_SESSION['user']);

        $response = json_encode(value:
            array(
                'result' => 'success',
                "actionDone" => 'signOutUserSession'
            ));

        // json_encode(value:
        //     array(
        //         'result' => 'failed',
        //         'error' => "The session doesn't exist",
        //         "actionDone" => 'signOutUserSession'
        //     ));

        exit($response);
    }
}

try {
    session_start();
    $sm = new sessionManager(formData: $_POST);
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

