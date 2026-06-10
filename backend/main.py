from fastapi import FastAPI, HTTPException, status, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from auth import verificar_senha, criar_token, validar_token
from typing import Optional
import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login")
def login(dados: schemas.LoginInput, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.email == dados.email
    ).first()
    if not usuario or not verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos.")
    token = criar_token({"sub": usuario.email, "nome": usuario.nome})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/produtos")
def listar_produtos(
    nome: Optional[str] = None,
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    query = db.query(models.Produto)
    if nome:
        query = query.filter(models.Produto.nome.ilike(f"%{nome}%"))
    total = query.count()
    produtos = query.offset((page - 1) * limit).limit(limit).all()
    for p in produtos:
        _ = p.categoria
    return {
        "data": produtos,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }

@app.get("/produtos/{produto_id}")
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@app.post("/produtos", status_code=status.HTTP_201_CREATED)
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db), token=Depends(validar_token)):
    categoria = db.query(models.Categoria).filter(models.Categoria.id == produto.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    novo = models.Produto(nome=produto.nome, preco=produto.preco, categoria_id=produto.categoria_id)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    
    _ = novo.categoria
    return novo

@app.put("/produtos/{produto_id}")
def atualizar_produto(produto_id: int, produto: schemas.ProdutoCreate, db: Session = Depends(get_db), token=Depends(validar_token)):
    produto_db = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto_db:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    produto_db.nome = produto.nome
    produto_db.preco = produto.preco
    produto_db.categoria_id = produto.categoria_id
    db.commit()
    db.refresh(produto_db)
    return produto_db

@app.delete("/produtos/{produto_id}")
def deletar_produto(produto_id: int, db: Session = Depends(get_db), token=Depends(validar_token)):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(produto)
    db.commit()
    return {"mensagem": "Produto deletado"}

@app.get("/categorias")
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()

@app.post("/categorias", status_code=status.HTTP_201_CREATED)
def criar_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db), token=Depends(validar_token)):
    nova = models.Categoria(nome=categoria.nome)
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@app.delete("/categorias/{categoria_id}")
def deletar_categoria(categoria_id: int, db: Session = Depends(get_db), token=Depends(validar_token)):
    categoria = db.query(models.Categoria).filter(models.Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    vinculados = db.query(models.Produto).filter(models.Produto.categoria_id == categoria_id).count()
    if vinculados > 0:
        raise HTTPException(status_code=400, detail=f"Não é possível excluir: {vinculados} produto(s) usam essa categoria.")
    db.delete(categoria)
    db.commit()
    return {"mensagem": "Categoria deletada"}