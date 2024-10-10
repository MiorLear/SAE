<?php
require "../config/config.php";

class users
{
    private $action, $conn, $status, $id, $name, $surname, $mail, $rol, $picture, $password, $retype, $generateImage, $passCheck, $changeImage;

    public function __construct($formData)
    {
        $this->action = $formData["action"];
        $this->conn = new dbConfig();
        $this->status = $formData["status"];
        $this->id = $formData["id"] != "" ? $formData["id"] : $formData["edit"];
        $this->name = $formData["name"];
        $this->surname = $formData["surname"];
        $this->mail = $formData["mail"];
        $this->rol = $formData["roles"];
        $this->picture = $formData["fileupload"];
        $this->password = $formData["pass"];
        $this->retype = $formData["retype"];
        $this->changeImage = $formData["changeImage"];
        $this->generateImage = $formData["addGenerateImageCheck"] != "" ? $_POST["addGenerateImageCheck"] : $_POST["editGenerateImageCheck"];
        $this->passCheck = $_POST["passCheck"];
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
            case "callUserInfo":
                $this->callUserInfo();
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

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name != 'status' AND column_name != 'pass' AND column_name != 'picture' ORDER BY ordinal_position;";

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

        $sql = "SELECT u.id, CONCAT(u.name[1], ' ', u.name[2]) as name, u.mail, r.name as rol_id, u.status, u.picture FROM users u RIGHT JOIN roles r ON r.id = u.rol_id WHERE u.status = :status ORDER BY u.id DESC;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
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

        $sql = "SELECT u.id, u.name[1] as name, u.name[2] as surname, u.mail, u.rol_id, u.picture FROM users u WHERE u.id = :id AND u.status = 'Habilitado'";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $response = $stmt->fetch();
        exit(json_encode(value: array(
            "result" => "success",
            "content" => $response
        )));
    }

    private function callUserInfo(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "SELECT u.id, CONCAT(u.name[1], ' ', u.name[2]) as name, u.mail, r.name as rol, u.status, u.picture FROM users u RIGHT JOIN roles r ON r.id = u.rol_id WHERE u.id = :id;";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
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

        $sql = "SELECT CONCAT(u.name[1], ' ', u.name[2]) as name FROM users u WHERE id = :id";

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
        $surname = $this->surname;
        $mail = $this->mail;
        $rol = $this->rol;
        $picture = $this->picture;
        $generateImage = $this->generateImage;
        $password = $this->password;
        $retype = $this->retype;

        if ($name == '' || $surname == '' || $mail == '' || $rol == '' || $password == '' || $retype == '')
            exit(json_encode(value: array(
                'error' => "No deje espacios en blanco",
                "errorType" => "User Error"
            )));

        if ($password != $retype)
            exit(json_encode(value: array(
                'error' => "Las contraseñas no coinciden",
                "errorType" => "User Error"
            )));

        $sql = "SELECT CONCAT(name[1], ' ', name[2]) AS name FROM users WHERE mail = :mail";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch()["name"];

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El correo ingresado ya existe en el usuario $user.",
                'errorType' => "User Error"
            ]));

        if ($generateImage == "true") {
            $imagename = $this->createProfilePicture(name: $name, surname: $surname);
        } else {

            $imagename = $name . '_' . $surname . '_' . rand(min: 1000, max: 9999) . '.png';

            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/SAE/assets/images/users/';
            $uploadFile = $uploadDir . basename(path: $imagename);

            $imageFileType = strtolower(string: pathinfo(path: $uploadFile, flags: PATHINFO_EXTENSION));
            $validFormats = ['jpg', 'jpeg', 'png'];

            if (!in_array(needle: $imageFileType, haystack: $validFormats)) {
                exit(json_encode(value: [
                    'error' => 'Formato de imagen no válido. Solo se permiten JPG, JPEG, PNG, y GIF.',
                    'errorType' => "Server Error"
                ]));
            }

            if (!move_uploaded_file(from: $picture['tmp_name'], to: $uploadFile)) {
                exit(json_encode(value: [
                    'error' => "Error al subir la imagen.",
                    'errorType' => "Server Error"
                ]));
            }
        }

        $sql = "INSERT INTO users(name[1], name[2], mail, rol_id, pass, picture) VALUES(:name, :surname, :mail, :rol, :pass, :picture);";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':surname', $surname, PDO::PARAM_STR);
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->bindParam(':rol', $rol, PDO::PARAM_STR);
        $stmt->bindParam(':pass', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $stmt->bindParam(':picture', $imagename, PDO::PARAM_STR);
        $stmt->execute();

        $sql = "SELECT MAX(id) AS id FROM users;";
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
        $surname = $this->surname;
        $mail = $this->mail;
        $rol = $this->rol;
        $picture = $this->picture;
        $generateImage = $this->generateImage;
        $password = $this->password;
        $changeImage = $this->changeImage;
        $retype = $this->retype;
        $passcheck = $this->passCheck;

        if ($name == '' || $surname == '' || $mail == '' || $rol == '')
            exit(json_encode(value: array(
                'error' => "No deje espacios en blanco",
                'content' => $_POST,
                "errorType" => "User Error"
            )));

        if ($passcheck == "true" && $password == '' || $passcheck == "true" && $retype == '')
            exit(json_encode(value: array(
                'error' => "No deje espacios en blanco (contraseña)",
                'content' => array("passCheck" => $passcheck, "password" => $password, "retype" => $retype),
                "errorType" => "User Error"
            )));

        if ($password != $retype)
            exit(json_encode(value: array(
                'error' => "Las contraseñas no coinciden",
                "errorType" => "User Error"
            )));

        $sql = "SELECT CONCAT(name[1], ' ', name[2]) AS name FROM users WHERE mail = :mail AND id != :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($stmt->rowCount() > 0)
            exit(json_encode(value: [
                'error' => "El usuario ingresado ya existe en el usuario $user.",
                'errorType' => "User Error"
            ]));

        $sql = "SELECT picture FROM users WHERE id = :id;";
        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $changeImage = $stmt->fetch()["picture"];

        if ($generateImage == "true") {
            $imagename = $this->createProfilePicture(name: $name, surname: $surname);
            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/SAE/assets/images/users/';

            if (!unlink(filename: $uploadDir . $changeImage))
                exit(json_encode(value: [
                    'error' => 'Error al eliminar la imagen. ' . $uploadDir . $changeImage,
                    'errorType' => "Server Error"
                ]));

        } elseif (isset($picture['name'])) {

            $imagename = $name . '_' . $surname . '_' . rand(min: 1000, max: 9999) . '.png';

            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/SAE/assets/images/users/';
            $uploadFile = $uploadDir . basename(path: $imagename);

            $imageFileType = strtolower(string: pathinfo(path: $uploadFile, flags: PATHINFO_EXTENSION));
            $validFormats = ['jpg', 'jpeg', 'png'];

            if (!in_array(needle: $imageFileType, haystack: $validFormats)) {
                exit(json_encode(value: [
                    'error' => 'Formato de imagen no válido. Solo se permiten JPG, JPEG, PNG, y GIF.',
                    'errorType' => "Server Error"
                ]));
            }

            if (!unlink(filename: $uploadDir . $changeImage))
                exit(json_encode(value: [
                    'error' => 'Error al eliminar la imagen. ' . $uploadDir . $changeImage,
                    'errorType' => "Server Error"
                ]));

            if (!move_uploaded_file(from: $picture['tmp_name'], to: $uploadFile)) {
                exit(json_encode(value: [
                    'error' => "Error al subir la imagen.",
                    'errorType' => "Server Error"
                ]));
            }
        } else {
            $imagename = $picture;
        }

        if ($passcheck == "true")
            $sql = "UPDATE users SET name[1] = :name, name[2] = :surname, mail = :mail, rol_id = :rol, pass = :pass, picture = :picture WHERE id = :id";
        else
            $sql = "UPDATE users SET name[1] = :name, name[2] = :surname, mail = :mail, rol_id = :rol, picture = :picture WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':surname', $surname, PDO::PARAM_STR);
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->bindParam(':rol', $rol, PDO::PARAM_STR);
        if ($passcheck == "true")
            $stmt->bindParam(':pass', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $stmt->bindParam(':picture', $imagename, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }
    private function disable(): void
    {
        $conn = $this->conn->getConnection();
        $id = $this->id;

        $sql = "UPDATE users SET status = 'Deshabilitado' WHERE id = :id";

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

        $sql = "UPDATE users SET status = 'Habilitado' WHERE id = :id";

        $stmt = $conn->prepare(query: $sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        exit(json_encode(value: array(
            "result" => "success",
        )));
    }

    private function createProfilePicture($name, $surname): string
    {
        $initials = substr(string: strtoupper(string: $name), offset: 0, length: 1) . substr(string: strtoupper(string: $surname), offset: 0, length: 1);
        $image = imagecreate(width: 100, height: 100);
        $backgroundcolor = imagecolorallocate(image: $image, red: 35, green: 203, blue: 224);
        $textcolor = imagecolorallocate(image: $image, red: 0, green: 0, blue: 0);
        $font = $_SERVER['DOCUMENT_ROOT'] . '/SAE/assets/fonts/Roboto-BlackItalic.ttf';
        imagettftext(image: $image, size: 45, angle: 0, x: 15, y: 70, color: $textcolor, font_filename: $font, text: $initials);

        $imagename = $name . '_' . $surname . '_' . rand(min: 1000, max: 9999) . '.png';
        $directory_file = $_SERVER['DOCUMENT_ROOT'] . '/SAE/assets/images/users/' . $imagename;
        if (imagepng(image: $image, file: $directory_file)) {
            imagedestroy(image: $image);
            return $imagename;
        } else {
            $error_message = error_get_last();
            exit(json_encode(value: array(
                "error" => "La imagen no fue guardada, intentálo nuevamente",
                "errorType" => "Server Error",
                "errorDetails" => $error_message['message']
            )));
        }
    }
}

try {
    session_start();
    $u = new users(formData: array_merge($_POST, $_FILES));
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
