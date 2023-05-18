const socketClient = io()

const cards = document.getElementById("cards");

socketClient.on('products', (prods)=>{
    cards.innerHTML = ""
    console.log(prods)
    prods.forEach(prod => {
        cards.innerHTML += `
        <div class="card" style="width: 20%; margin-left: 20px; margin-bottom: 20px; border-style: dotted;border-color: black; padding: 20px;">
    <img src=${prod.thumbnail} style="width: 40%;" class="card-img-top" alt="imagen">
    <div class="card-body">
        <h5 class="card-title">${prod.title}</h5>
        <p class="card-text">${prod.description}</p>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">Price: ${prod.price}</li>
        <li class="list-group-item">Stock: ${prod.stock}</li>
        <li class="list-group-item">Category: ${prod.category}</li>
    </ul>
</div>
        `
    });
})

//chat

const nombreUsuario = document.getElementById('nombreUsuario')
const formChat = document.getElementById('formChat')
const inputMensaje = document.getElementById('mensaje')
const chatParrafo = document.getElementById('chatParrafo')
let usuario = null


if(!usuario){
    Swal.fire({
        title: 'Bienvenid@',
        text:'Ingresa tu email de usuario', 
        input: 'text', 
        inputValidator:(value)=>{
            if(!value){
                return 'Necesitas ingresar email'
            }
        }
    })
    .then(userName=>{
        usuario = userName.value
        nombreUsuario.innerText = usuario
    })
}


formChat.onsubmit = (e) =>{
    e.preventDefault()
    const info = {
        user: usuario, 
        message: inputMensaje.value
    }
    socketClient.emit('mensaje', info)
    inputMensaje.value = ''
}


socketClient.on('chat', mensajes =>{
    const htmlRender = mensajes.map(e=>{
        return `<p><strong>${e.user}:</strong>${e.message}</p>`
    }).join(' ')

    chatParrafo.innerHTML = htmlRender
})

