document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value 
    const password = document.getElementById('password').value 

    try{

        const res = await fetch('http://localhost:3030/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password})
        })

        const data = await res.json()

        if(res.ok){

            localStorage.setItem('token', data.token)
            document.getElementById('result').innerHTML = "login feito com sucesso!"

            setTimeout(() => window.location.href = 'clientes.html', 1000)
        } else {
            document.getElementById('result').innerHTML = "Login incorreto!"
        }

    } catch (err){
        document.getElementById('result').innerHTML = "Erro no servidor!"
    }
})