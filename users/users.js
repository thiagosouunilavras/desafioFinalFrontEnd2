$(document).ready(function() {
    carregarUsuarios();

});

async function carregarUsuarios() {
    try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();

        const container = document.getElementById("cardsContainer");
        container.innerHTML = ""; // limpa antes de recarregar

        data.users.forEach((user, index) => {

            const avatar = `https://i.pravatar.cc/400?img=${index + 5}`;

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
        <img src="${avatar}" class="card-img-top" alt="${user.firstName}">
        <div class="card-body">
            <p><strong>Nome:</strong> ${user.firstName}</p>
            <p><strong>Sobrenome:</strong> ${user.lastName}</p>
            <p><strong>Idade:</strong> ${user.age}</p>
            <p><strong>Email:</strong> ${user.email}</p>

            <button class="btn btn-danger btn-sm btn-delete"
                data-id="${user.id}"
                data-firstName="${user.firstName}"
                data-lastname="${user.lastName}">
                Remover
            </button>
        </div>
    `;

            container.appendChild(card);
        });


        // Ativa os botões de deletar
        configurarBotoesRemover();

    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}


document.getElementById('btnSalvar').addEventListener('click', function() {

    let nome = document.getElementById('nome').value.trim();
    let sobrenome = document.getElementById('sobrenome').value.trim();
    let email = document.getElementById('email').value.trim();
    let idade = parseInt(document.getElementById('idade').value);

    let erro = document.getElementById("erro");

    if (!validarTexto(nome)) {
        return erro.innerText = "Nome deve ter entre 3 e 50 caracteres.";
    }

    if (!validarTexto(sobrenome)) {
        return erro.innerText = "Sobrenome deve ter entre 3 e 50 caracteres.";
    }

    if (!validarEmail(email)) {
        return erro.innerText = "Email inválido.";
    }

    if (!validarNumero(idade)) {
        return erro.innerText = "Idade deve ser maior que 0 e menor que 120.";
    }

    erro.innerText = "";

    // Fecha o modal antes de enviar o usuário
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('usersModal'));
    modal.hide();

    // Remove o fundo escuro (backdrop)
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style = "";

    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {

            const base64Image = event.target.result;

            enviarUsuario(base64Image, nome, sobrenome, email, idade);
        };
        reader.readAsDataURL(file); // Converte para Base64
    } else {
        // Caso não tenha imagem, envia em branco ou uma imagem padrão
        enviarUsuario("https://i.pravatar.cc/150?img=50", nome, sobrenome, email, idade);
    }

});

function enviarUsuario(imageBase64, nome, sobrenome, email, idade) {

    const user = {
        firstName: nome,
        lastName: sobrenome,
        email: email,
        age: idade,
        image: imageBase64
    };

    fetch("https://dummyjson.com/users/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Usuário criado:", data);
            showSuccessAlert(`Usuário ${data.id} cadastrado com sucesso!`);
            carregarUsuarios();
        })
        .catch(err => console.error("Erro:", err));
}

function showSuccessAlert(message) {
    const alert = document.getElementById("alertSuccess");

    alert.innerHTML = message;
    alert.classList.remove("d-none");
    alert.style.opacity = "1";

    alert.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(() => {
        alert.classList.add("fade-out");

        setTimeout(() => {
            alert.classList.add("d-none");
            alert.classList.remove("fade-out");
            alert.style.opacity = "1";
        }, 800);

    }, 5000);
}

async function removerUsuario(id) {
    try {
        const response = await fetch(`https://dummyjson.com/users/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        console.log("Usuário removido:", data);
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
    }
}

function configurarBotoesRemover() {
    const botoes = document.querySelectorAll(".btn-delete");

    botoes.forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.getAttribute("data-id");
            const firstName = this.getAttribute("data-firstName");
            const lastName = this.getAttribute("data-lastName");

            if (!confirm(`Deseja remover o usuário ${id}?`)) return;

            await removerUsuario(id);

            showSuccessAlert(`Usuário ${id} - ${firstName} ${lastName} removido com sucesso!`);
            carregarUsuarios();
        });
    });
}