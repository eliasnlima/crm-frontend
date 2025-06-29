document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')

    if(!token){
        document.getElementById('result').innerHTML = "Usuario não autenticado!"
    }

    showClients(token)

})

async function showClients(token){

    const div = document.getElementById('div')

    try{
    const res = await fetch('http://localhost:3030/clients', {
        method: 'GET',
        headers: {
            'authorization' : 'Bearer' + token
        }
    })

    const data = await res.json()

    data.clients.forEach(client => {
        const li = document.createElement('li')
        li.innerHTML = `${client.nome}`

        div.appendChild(li)
    })
    } catch (err){
        document.getElementById('result').innerHTML = "Erro no servidor!"
    }
}