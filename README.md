# ᓚᘏᗢ Cat-Shop

## Tecnologias

### Backend

- Python
- FastAPI
- SQLite

### Frontend

- HTML
- CSS
- Bootstrap
- jQuery

---

## Pré-requisitos

- Python 3.10+
- VSCode com a extensão **Live Server** instalada

---

# 1. Clonar o repositório

```bash
git clone <URL_DO_REPO>
cd cat-shop
git checkout criandoIdentidade
```

---

# 2. Configurar o backend

```bash
cd backend
```

### Criar ambiente virtual (recomendado)

```bash
python -m venv venv
```

Ativar:

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Criar o arquivo `.env`

O `.env` **não está no repositório** (fica no `.gitignore`). Crie o arquivo `backend/.env` manualmente:

```env
e colocar o conteúdo
```

### Popular o banco (usuário admin)

O `catshop.db` também não vai pro repositório — o banco nasce vazio no clone novo. Rode:

```bash
python seed.py
```

Isso cria o login:

```txt
Email: admin@cat.com
Senha: 1234
```

Produtos e categorias vão começar vazios — cadastre alguns na hora pra demonstrar o CRUD.

### Rodar o servidor

```bash
uvicorn main:app --reload
```

O backend ficará disponível em:

```txt
http://127.0.0.1:8000
```

Swagger:

```txt
http://127.0.0.1:8000/docs
```

---

# 3. Configurar o frontend

O arquivo `frontend/config.js` está apontando para o backend publicado no Render:

```js
const API_URL = "https://cat-shop-c43u.onrender.com";
```

Escolha uma opção antes da apresentação:

- **Usar o backend publicado (mais simples):** deixe o `config.js` como está — nesse caso nem precisa rodar o `uvicorn` local, só o passo 2 até a instalação das dependências é opcional.
- **Testar o backend local:** troque para
  ```js
  const API_URL = "http://127.0.0.1:8000";
  ```

Abra a pasta `frontend` no VSCode, clique com o botão direito em `login.html` → **Open with Live Server**.

Login (se estiver usando o backend local após o `seed.py`):

```txt
Email: admin@cat.com
Senha: 1234
```

---

# Funcionalidades

## Produtos

- Criar produto
- Listar produtos
- Editar produto
- Deletar produto

## Categorias

- Criar categoria
- Listar categorias

---

# Integrante

- Selton
