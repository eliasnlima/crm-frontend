document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const clientId = urlParams.get('id')

    if(!token || !clientId){
        document.getElementById('cliente-nome').innerHTML = "Erro ao buscar cliente!"
        return
    }

    carregarCliente(clientId, token)

})

async function carregarCliente(clientId, token) {
    
    try{
        const res = await fetch(`http://localhost:3030/client/${clientId}`, {
        method: 'GET',
        headers: {
            'authorization' : 'Bearer ' + token
        }
    })

    const data = await res.json()

    document.getElementById('cliente-nome').innerText = data.client.nome
    document.getElementById('cliente-cnpj').innerText = `CNPJ: ${data.client.CNPJ}`

    } catch (err){
        document.getElementById('cliente-nome').innerText = "Erro no servidor!"
    }
    


}
