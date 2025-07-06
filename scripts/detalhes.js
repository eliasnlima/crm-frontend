document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const clientId = urlParams.get('id')

    if(!token || !clientId){
        document.getElementById('cliente-nome').innerHTML = "Erro ao buscar cliente!"
        return
    }

    carregarCliente(clientId, token)
    showActions(clientId, token)
    cadastra(clientId, token)
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

const modal = document.getElementById('modal')
const abrirModal = document.getElementById('abrir-modal')
const fecharModal = document.getElementById('fechar-modal')
const cadastraAction = document.getElementById('cadastrar-acao')

abrirModal.addEventListener('click', () => {
    modal.style.display = "flex"
})

fecharModal.addEventListener('click', () => {
    modal.style.display = "none"
}) 

document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = "../telas/clientes.html"
})

async function cadastra(client, token) {
    
    cadastraAction.addEventListener('click', async () => {

    const descricao = document.getElementById('descricao').value

    const res = await fetch('http://localhost:3030/action', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'authorization' : 'Bearer ' + token
        },
        body: JSON.stringify({ descricao, client })
    })


    const data = await res.json()

    if(res.ok){
        modal.style.display = "none"
        document.getElementById('descricao').value = ""
        showActions(client, token)
    } else {
        document.getElementById('modal-msg').innerHTML = "Erro ao adicionar ação!"
    }
})
    
}

async function showActions(clientId, token) {
    
    const lista = document.getElementById('acoes')
    lista.innerHTML = ""

    const res = await fetch(`http://localhost:3030/client/${clientId}/actions`, {
        method: 'GET',
        headers: {
            'authorization' : 'Bearer ' + token
        }
    })

    const data = await res.json()

    data.actions.forEach(action => {
        
        const li = document.createElement('li')

         const dataHora = new Date(action.date)
        const dia = String(dataHora.getDate()).padStart(2, '0')
        const mes = String(dataHora.getMonth() + 1).padStart(2, '0')
        const ano = dataHora.getFullYear()
        const horas = String(dataHora.getHours()).padStart(2, '0')
        const minutos = String(dataHora.getMinutes()).padStart(2, '0')

        const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`

        li.innerHTML = `
              <span class="descricao">${action.descricao}</span>
      <span class="data">${dataFormatada}</span>`
            
        lista.appendChild(li)

    });



}

