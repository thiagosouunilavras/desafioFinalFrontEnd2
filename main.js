$(document).ready(function() {
    atualizarFooter();

});

function showSuccessAlert(message) {
    const alert = document.getElementById("alertSuccess");

    alert.innerHTML = message;
    alert.classList.remove("d-none");
    alert.style.opacity = "1";

    document.body.style.overflow = "";

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

function atualizarFooter() {
    const footer = document.getElementById("footerTexto");
    const agora = new Date();

    // Formata data e hora no padrão DD/MM/AAAA HH:MM:SS
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR");

    footer.textContent = `© ${data} ${hora} - Todos os direitos reservados.`;
}

function validarTexto(texto) {
    const regex = /^.{3,50}$/;
    return regex.test(texto.trim());
}

function validarNumero(valor) {
    const numero = Number(valor);
    return numero > 0 && numero < 120;
}

function validarEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.trim());
}

function validarURL(url) {
    const regex = /^(https?:\/\/)([^\s$.?#].[^\s]*)$/i;
    return regex.test(url);
}