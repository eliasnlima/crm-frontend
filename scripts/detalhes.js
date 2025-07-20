document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const clientId = urlParams.get('id')
    const grupoCodigo = urlParams.get('grupo')

   if (!token || (!clientId && !grupoCodigo)) {
        document.getElementById('cliente-nome').innerHTML = "Erro ao buscar cliente ou grupo!"
        return
    }
   
    if (grupoCodigo) {
        carregarGrupo(grupoCodigo, token)
        showActionsGrupo(grupoCodigo, token)
        cadastraGrupo(grupoCodigo, token)
        statusGrupo(grupoCodigo, token)
    } else {
        carregarCliente(clientId, token)
        showActions(clientId, token)
        cadastra(clientId, token)
        statusClient(clientId, token)
        proxInt(token, clientId)
    }
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

    document.getElementById('cliente-nome').innerText = `${data.client.codigo} - ${data.client.nome}`
    document.getElementById('cliente-cnpj').innerText = `CNPJ: ${formatarCNPJ(data.client.CNPJ)}`
    document.getElementById('cliente-email').innerText = `Email: ${data.client.email}`
    document.getElementById('cliente-telefone').innerText = `Telefone: ${formatarTelefone(data.client.fone)}`
    document.getElementById('status').value = data.client.status
     document.getElementById('interacao').value = data.client.proxInt
  ? new Date(data.client.proxInt).toISOString().split('T')[0]
  : ''
    document.getElementById('cliente-grupo').innerText = `G.E: ${data.client.grupoEconomico}`

      
    } catch (err){
        document.getElementById('cliente-nome').innerText = "Erro no servidor!"
    }

}

async function carregarGrupo(grupoCodigo, token) {
    try {
        const res = await fetch(`http://localhost:3030/clients`, {
            headers: { 'authorization': 'Bearer ' + token }
        })

        const data = await res.json()
        const grupoClientes = data.clients.filter(c => c.grupoEconomico === grupoCodigo)

        if (grupoClientes.length === 0) {
            document.getElementById('cliente-nome').innerText = "Grupo não encontrado!"
            return
        }


        const nomes = grupoClientes.map(c => `${c.codigo} - ${c.nome}`).join(" | ")
        const status = grupoClientes[0].status
        document.getElementById('cliente-nome').innerText = `Grupo Econômico: ${grupoCodigo}`
        document.getElementById('cliente-cnpj').innerText = nomes
        document.getElementById('cliente-email').innerText = ""
        document.getElementById('cliente-telefone').innerText = ""
        document.getElementById('cliente-grupo').innerText = ""
        document.getElementById('status').value = status

        for (const cliente of grupoClientes) {
            await showActions(cliente._id, token, cliente.nome)
        }

    } catch (err) {
        document.getElementById('cliente-nome').innerText = "Erro no servidor!"
    }

}

async function cadastra(client, token) {
    
    cadastraAction.addEventListener('click', async () => {

    const descricao = document.getElementById('descricao').value

    if(!descricao){
        document.getElementById('modal-msg').innerHTML = "Preencha o campo!"
        return
    }

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

async function cadastraGrupo(grupo, token) {
    
    cadastraAction.addEventListener('click', async () => {

    const descricao = document.getElementById('descricao').value

    if(!descricao){
        document.getElementById('modal-msg').innerHTML = "Preencha o campo!"
        return
    }

    const res = await fetch('http://localhost:3030/action/grupo', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'authorization' : 'Bearer ' + token
        },
        body: JSON.stringify({ descricao, grupo })
    })


    const data = await res.json()

    if(res.ok){
        modal.style.display = "none"
        document.getElementById('descricao').value = ""
        showActionsGrupo(grupo, token)
    } else {
        document.getElementById('modal-msg').innerHTML = "Erro ao adicionar ação!"
    }
})


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

async function showActionsGrupo(grupo, token) {
    
    const lista = document.getElementById('acoes')
    lista.innerHTML = ""

    const res = await fetch(`http://localhost:3030/grupo/${grupo}/actions`, {
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

function formatarCNPJ(cnpj) {
  const numeros = cnpj.replace(/\D/g, ''); 
  if (numeros.length !== 14) return cnpj; 
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function formatarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, ''); 
  if (numeros.length !== 11) return telefone; 
  return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}


async function statusClient(clientId, token){

    document.getElementById('status').addEventListener('change', async (e) => {
   

    const status = e.target.value

    const res = await fetch(`http://localhost:3030/clientStatus/${clientId}`, {
        method: 'PUT',
        headers: {
            'authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ status })
    })

    const data = await res.json()


})
}

async function statusGrupo(grupo, token){

    document.getElementById('status').addEventListener('change', async (e) => {
   

    const status = e.target.value

    const res = await fetch(`http://localhost:3030/grupoStatus/${grupo}`, {
        method: 'PUT',
        headers: {
            'authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ status })
    })

    const data = await res.json()


})
}


async function proxInt(token, clientId) {
    
    document.getElementById('interacao').addEventListener('change', async (e) => {

    const proxInt = e.target.value

    const res = await fetch(`http://localhost:3030/proxInt/${clientId}`, {
        method: 'PUT',
        headers: {
            'authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ proxInt })
    })

    const data = await res.json()

    if(!res.ok){
        document.getElementById('int-msg').innerHTML = "Erro na requisição!"
    }

})
}


