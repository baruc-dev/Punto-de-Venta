<?php

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $nombre = $_POST['nombre'];
    $stock = $_POST['stock'];

    try
    {
        $conexion = new mysqli('localhost', 'root', '','pos' );
        $statement = $conexion->prepare('UPDATE productos SET stock = stock - ? where nombre = ? ');
        $statement->bind_param('is', $stock, $nombre);
        $statement->execute();
        $statement->get_result();
        echo $statement;
        $statement->close();
        $conexion->close();
    }
    catch(mysqli_sql_exception $e)
    {
        #redirigir a sitio de error
    }
  



}


?>