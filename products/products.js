$(document).ready(function () {
   carregarProdutos();

});

async function carregarProdutos() {
   try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();

      const container = document.getElementById("productsContainer");
      container.innerHTML = ""; // limpa antes de recarregar

      data.products.forEach(product => {
         const card = document.createElement("div");
         card.classList.add("card", "product-card");

         card.innerHTML = `
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p><strong>Descrição:</strong> ${product.description}</p>
                            <p><strong>Preço:</strong> $${product.price}</p>
                            <p><strong>Marca:</strong> ${product.brand}</p>
                            <p><strong>Categoria:</strong> ${product.category}</p>

                            <button class="btn btn-danger btn-sm btn-delete"
                data-id="${product.id}"
                data-brand="${product.brand}"
                data-price="${product.price}">
                Remover
            </button>
                        </div>
                        
                    `;

         container.appendChild(card);
      });

      configurarBotoesRemoverProd();

   } catch (error) {
      console.error("Erro ao carregar produtos:", error);
   }
}

document.getElementById('btnSalvarProd').addEventListener('click', function () {

   let titulo = document.getElementById('titulo').value.trim();
   let descricao = document.getElementById('descricao').value.trim();
   let preco = parseInt(document.getElementById('preco').value);
   let marca = document.getElementById('marca').value.trim();
   let categoria = document.getElementById('categoria').value.trim();

   let erro = document.getElementById("erro");

   if (!validarTexto(titulo)) {
      return erro.innerText = "Título deve ter entre 3 e 50 caracteres.";
   }

   if (!validarTexto(descricao)) {
      return erro.innerText = "Descrição deve ter entre 3 e 50 caracteres.";
   }

   if (!validarNumero(preco)) {
      return erro.innerText = "Preço deve ser maior que 0 e menor que 120.";
   }

   if (!validarTexto(marca)) {
      return erro.innerText = "Marca deve ter entre 3 e 50 caracteres.";
   }

   if (!validarTexto(categoria)) {
      return erro.innerText = "Categoria deve ter entre 3 e 50 caracteres.";
   }

   erro.innerText = "";

   // Fecha o modal antes de enviar o usuário
   const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('productsModal'));
   modal.hide();

   // Remove o fundo escuro (backdrop)
   document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
   document.body.classList.remove('modal-open');
   document.body.style = "";

   const fileInput = document.getElementById('imagem');
   const file = fileInput.files[0];

   if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {

         const base64Image = event.target.result;

         enviarProduto(base64Image, titulo, descricao, preco, marca, categoria);
      };
      reader.readAsDataURL(file); // Converte para Base64
   } else {
      // Caso não tenha imagem, envia em branco ou uma imagem padrão
      enviarProduto('https://images.tcdn.com.br/img/img_prod/1376235/camisa_nike_corinthians_oficial_i_oficial_3175_1_cfde25a0e99fd3611a6440f4d517b255.jpg', titulo, descricao, preco, marca, categoria);
   }
});

function enviarProduto(imageBase64, titulo, descricao, preco, marca, categoria) {

   const user = {
      title: titulo,
      description: descricao,
      price: preco,
      brand: marca,
      category: categoria,
      thumbnail: imageBase64
   };

   fetch("https://dummyjson.com/products/add", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(data => {
         console.log("Produto criado:", data);
         showSuccessAlert(`Produto ${data.id} cadastrado com sucesso!`);
         carregarProdutos();
      })
      .catch(err => console.error("Erro:", err));
}

async function removerProduto(id) {
   try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
         method: "DELETE",
      });

      const data = await response.json();
      console.log("Produto removido:", data);
   } catch (error) {
      console.error("Erro ao remover produto:", error);
   }
}

function configurarBotoesRemoverProd() {
   const botoes = document.querySelectorAll(".btn-delete");

   botoes.forEach(btn => {
      btn.addEventListener("click", async function () {
         const id = this.getAttribute("data-id");
         const brand = this.getAttribute("data-brand");
         const price = this.getAttribute("data-price");

         if (!confirm(`Deseja remover o produto ${id}?`)) return;

         await removerProduto(id);

         showSuccessAlert(`Produto ${id} da marca ${brand} custando ${price} removido com sucesso!`);
         carregarProdutos();
      });
   });
}