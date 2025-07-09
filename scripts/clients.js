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
    div.innerHTML = ""
    
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
        li.innerHTML = `<a href="detalhes.html?id=${client._id}">${client.nome}<span class="data">CNPJ: ${formatarCNPJ(client.CNPJ)} - ${formatarTelefone(client.fone)} - ${client.email}</span></a>`
        div.appendChild(li)
        
        
    });
    } catch (err){
        document.getElementById('result').innerHTML = "erro no servidor!"
    }
    

}

const modal = document.getElementById('modal')
const abrirModal = document.getElementById('add-client-btn')
const fecharModal = document.getElementById('fechar-btn')
const cadastrarBtn = document.getElementById('cadastrar-btn')

abrirModal.addEventListener('click', () => {
    modal.style.display = "flex"
})

fecharModal.addEventListener('click', () => {
    modal.style.display = "none"
})

cadastrarBtn.addEventListener('click', async () => {

    const nome = document.getElementById('nome').value 
    const CNPJ = document.getElementById('cnpj').value 
    const fone = document.getElementById('fone').value 
    const email = document.getElementById('email').value 

    const token = localStorage.getItem('token')
    const msg = document.getElementById('modal-msg')

    if(!nome || !CNPJ){
        msg.innerText = "Preencha todos os campos!"
    }

    try{

        const res = await fetch('http://localhost:3030/client', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'authorization' : 'Bearer ' + token
            },
            body: JSON.stringify({nome, CNPJ, fone, email})
        })

        const data = res.json()

        if(res.ok){

            modal.style.display = "none"
            document.getElementById('nome').value = ""
            document.getElementById('cnpj').value = ""
            document.getElementById('fone').value = ""
            document.getElementById('email').value = ""
            showClients(token)

        }else {
            msg.innerText = "Erro ao cadastrar cliente!"
        }



    }catch (err){
        msg.innerText = "Erro no SERVIDOR ao cadastrar cliente!"
    }
})

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