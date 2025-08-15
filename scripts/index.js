document.getElementById("login-form").addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value 
    const password = document.getElementById("password").value 

    document.getElementById('result').innerHTML = "Carregando..."

    try {
        
        const res = await fetch('https://crm-backend-t9p2.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
        })

        const data = await res.json()
   
        if(res.ok){

            localStorage.setItem('token', data.token)
            document.getElementById('result').innerHTML = "Login realizado com sucesso!"

            setTimeout(() => window.location.href = 'telas/clientes.html', 1000)
        } else {
            document.getElementById('result').innerHTML = data.error || 'Erro ao fazer login';
            
        }
    } catch (err) {
        document.getElementById('result').innerHTML = "Erro de conexão"
    }
    
})

