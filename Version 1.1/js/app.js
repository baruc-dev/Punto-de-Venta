
const btnBuscar = document.getElementById('buscar');
const inptBusqueda = document.getElementById('busqueda');
const seccionTarjetas = document.getElementById('tarjetas');
const btnCategloria = document.getElementById('buscarCat');
const inptCategoria = document.getElementById('select');
const listado = document.getElementById('listadodeproductos');
const productosenlistados = document.querySelector('.productosenlistados');
const precioTotal = document.getElementById('precioTotal');
const url = 'php/productos.php';
var totalG = 0;
let productosArray = [];

btnBuscar.addEventListener('click', () => buscandoConBoton() );
btnCategloria.addEventListener('click', () => buscandoCategoria());






function  buscandoConBoton()
{
    const busqueda = inptBusqueda.value;
    inptBusqueda.value = '';
    
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => realizandoBusquedaXnombre(resultado, busqueda));
}

function buscandoCategoria()
{
   
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => realizandoBusquedaXcategoria(resultado, inptCategoria.value));

}


function realizandoBusquedaXnombre(productos, termino)
{

// 'i' es para ignorar mayúsculas y minúsculas
  let regex = new RegExp(termino, 'i');

  var resultados = productos.filter(objeto => regex.test(objeto.nombre));

  inyectandoResultados(resultados);
}

function realizandoBusquedaXcategoria(productos, categoria)
{
    let regex = new RegExp(categoria, 'i');
    var resultados = productos.filter(objeto => regex.test(objeto.categoria));
    inyectandoResultados(resultados);
}




function inyectandoResultados(resultados)
{
    limpiarHTML();
    resultados.forEach(producto => {

        const {categoria, id, imagen, nombre, precio, stock} = producto;


        const card = document.createElement('DIV');
        card.classList.add('card');
        card.style.width = '18rem';
        card.style.height = '18rem';
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.style.height = '40%';
        img.style.objectFit = 'contain';
        img.src = imagen;
        const cardbody = document.createElement('div');
        cardbody.classList.add('card-body');
        const h5 = document.createElement('h5');
        h5.textContent = nombre;
        const p1 = document.createElement('p');
        p1.textContent = `Stock: ${stock}`;
        const p2 = document.createElement('p');
        p2.textContent = `Precio: $${precio}`;
        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = 'Agregar';
        btnAgregar.classList.add('btn');
        btnAgregar.classList.add('btn-primary');
        btnAgregar.onclick = () => agregarProducto(nombre, precio, stock);

        card.appendChild(img);
        card.appendChild(cardbody);
        cardbody.appendChild(h5);
        cardbody.appendChild(p1);
        cardbody.appendChild(p2);
        cardbody.appendChild(btnAgregar);

        seccionTarjetas.appendChild(card);


        
    });

}


function limpiarHTML()
{

    while(seccionTarjetas.firstChild)
        {
            seccionTarjetas.removeChild(seccionTarjetas.firstChild);
        }

}



function agregarProducto(nombre, precio, stock)
{

    if(productosArray.some(producto => producto == nombre) == false)
    {
            
    productosArray.push(nombre);
  
    const listaProductos = document.createElement('DIV');
    listaProductos.classList.add('row');
    listaProductos.classList.add('listaProductos');

    const nombreProducto = document.createElement('button');
    nombreProducto.classList.add('btn');
    nombreProducto.classList.add('btn-primary');
    nombreProducto.classList.add('nombreProducto');
    nombreProducto.textContent = nombre;

    const selectStock = document.createElement('select');
    selectStock.classList.add('form-select');
    selectStock.id = 'cantidad';
    const CantidadText = document.createElement('option');
    CantidadText.textContent = 'Cantidad';
    CantidadText.selected = true;
    CantidadText.disabled = true;
    selectStock.appendChild(CantidadText);
    selectStock.onchange = () => actualizarSubTotal(selectStock.nextElementSibling,selectStock.nextElementSibling.nextElementSibling, selectStock.value);

    let i = 1;
    while(i <= stock)
        {
           const option = document.createElement('option');
           option.value = i;
           option.textContent = i;
           selectStock.appendChild(option);
           
           i++;
        }
    
  


    
    const precioIndividual = document.createElement('button');
    precioIndividual.classList.add('btn');
    precioIndividual.classList.add('btn-primary');
    precioIndividual.classList.add('precioIndividual');
    precioIndividual.textContent = `$${precio}`;
    precioIndividual.value = precio;


    const precioSubTotal = document.createElement('button');
    precioSubTotal.classList.add('btn');
    precioSubTotal.classList.add('btn-primary');
    precioSubTotal.classList.add('precioSubTotal');
    precioSubTotal.textContent = 'TOTAL';

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn');
    btnEliminar.classList.add('btn-danger');
    btnEliminar.id = 'eliminarProducto';
    btnEliminar.onclick = () => eliminarProducto(btnEliminar.parentElement, btnEliminar.parentElement.firstChild.textContent);
   

    const icono = document.createElement('i');
    icono.classList.add('bi');
    icono.classList.add('bi-trash');

    btnEliminar.appendChild(icono);

   


    listaProductos.appendChild(nombreProducto);
    listaProductos.appendChild(selectStock);
    listaProductos.appendChild(precioIndividual);
    listaProductos.appendChild(precioSubTotal);
    listaProductos.appendChild(btnEliminar);

    productosenlistados.appendChild(listaProductos);

    }
    




    
}


function actualizarSubTotal(precio, total, cantidad)
{
    const subtotal = precio.value * cantidad;
    total.value = subtotal;
    total.textContent = `Sub$${subtotal}`;

    calculandoTotalGlobal();
}


function eliminarProducto(target, nombre)
{
    target.remove();
    productosArray = productosArray.filter(producto => producto != nombre)
    calculandoTotalGlobal();


}


function pagarProductos()
{

    const nombreProducto = document.querySelectorAll('.nombreProducto');
    nombreProducto.forEach(producto => {
        let nombre = producto.textContent;
        let stock = producto.nextElementSibling.value;

        enviarDatos(nombre,stock);
    });

    precioTotal.textContent = `Total: $0`;
    
    limpiarHTML();
    limpiarProductos();

    
}


function calculandoTotalGlobal()
{
    
    const pedidos =  document.querySelectorAll('.precioSubTotal');
    var totalG = 0;
    if(pedidos.length >= 1)
        {
            pedidos.forEach(producto => {
       
                totalG = totalG + parseInt(producto.value);
                precioTotal.textContent = `Total: $${totalG}`;
                
            
        
             });
        }
    else
    {
        precioTotal.textContent = `Total: $0`;
    }

}



function enviarDatos(nombre,stock)
{
    var formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("stock", stock);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/pago.php', true);
    xhr.onload = () =>
        {
            if(xhr.status == 404)
                {
                    console.log('error');
                }
        }
    xhr.send(formData);

}

function limpiarProductos()
{
    productosArray = [];
    const productosLista = document.querySelectorAll('.listaProductos');
    if(productosLista.length >= 1)
        {
            productosLista.forEach(producto => {
                producto.remove();
            });
        }
    
}
    