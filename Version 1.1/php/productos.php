<?php
try
{

    $conexion = new mysqli('localhost', 'root', '', 'pos');
    $statement = $conexion->prepare('SELECT * FROM productos');
    $statement->execute();
    $productos = array();
    $statement->bind_result($id, $nombre, $precio, $categoria, $imagen, $stock);
    
    while($statement->fetch())
    {
        $productos[] = array('id' => $id, 'nombre' => $nombre, 'precio' => $precio, 'categoria' => $categoria, 'imagen' => $imagen, 'stock' => $stock);
        
    }

    echo json_encode($productos);

}
catch(mysqli_sql_exception $e)
{
    #redirigir sitio de error
}




?>