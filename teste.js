document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value 
    const senha = document.getElementById('senha').value  

    try {

        const res = await fetch('http://localhost:3030/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, senha})
        }
        )

        const data = await res.json()

        if(res.ok){

            localStorage.setItem('token', data.token)
            setTimeout(() => window.location.href = 'clientes.html', 1000)
        }
        else {
            document.getElementById('msg').innerHTML = "falha na requisição"
        }
    } catch(err){
        document;getElementById('msg').innerHTML = "erro no servidor!"
    }
})