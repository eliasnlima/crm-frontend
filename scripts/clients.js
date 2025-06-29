document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')

    if(!token){
        document.getElementById('result').innerHTML = "Usuario não autenticado, faça login!"
        return;
    }

    showClients(token)

})

async function showClients(token){

    const div = document.getElementById('clients')
    
    
    try{
    const res = await fetch('http://localhost:3030/clients', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        },
    })

    const dataClients = await res.json()

    if(!res.ok){
        const messageErro = dataClients.error || 'Erro no servidor!';
        document.getElementById('result').innerHTML = messageErro
    }

    dataClients.clients.forEach(client => {
        const li = document.createElement("li")
        li.innerHTML = `${client.nome}`
        
        div.appendChild(li)
    });
    } catch (err){
        document.getElementById('result').innerHTML = "erro no servidor!"
    }
    

}