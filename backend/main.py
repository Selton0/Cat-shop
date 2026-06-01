from fastapi import FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/produtos")
def listar_produtos():
    db: Session = SessionLocal()
    produtos = db.query(models.Produto).all()
    return produtos

@app.get("/produtos/{produto_id}")
def buscar_produto(produto_id: int):

    db: Session = SessionLocal()
    produto = db.query(models.Produto).filter(
        models.Produto.id == produto_id
    ).first()

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )
    return produto

@app.post("/produtos", status_code=status.HTTP_201_CREATED)
def criar_produto(produto: schemas.ProdutoCreate):
    db: Session = SessionLocal()
    novo_produto = models.Produto(
        nome=produto.nome,
        preco=produto.preco,
        categoria_id=produto.categoria_id
    )

    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@app.put("/produtos/{produto_id}")
def atualizar_produto(
    produto_id: int,
    produto: schemas.ProdutoCreate
):

    db: Session = SessionLocal()
    produto_db = db.query(models.Produto).filter(
        models.Produto.id == produto_id
    ).first()

    if not produto_db:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )
    produto_db.nome = produto.nome
    produto_db.preco = produto.preco
    db.commit()
    db.refresh(produto_db)
    return produto_db

@app.delete("/produtos/{produto_id}")
def deletar_produto(produto_id: int):
    db: Session = SessionLocal()
    produto = db.query(models.Produto).filter(
        models.Produto.id == produto_id
    ).first()

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )
    db.delete(produto)
    db.commit()
    return {"mensagem": "Produto deletado"}

@app.get("/categorias")
def listar_categorias():

    db: Session = SessionLocal()
    categorias = db.query(models.Categoria).all()
    return categorias

@app.post("/categorias", status_code=status.HTTP_201_CREATED)
def criar_categoria(categoria: schemas.CategoriaCreate):
    db: Session = SessionLocal()
    nova_categoria = models.Categoria(
        nome=categoria.nome

    )
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    return nova_categoria

@app.delete("/categorias/{categoria_id}")
def deletar_categoria(categoria_id: int):
    db: Session = SessionLocal()
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == categoria_id
    ).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    produtos_vinculados = db.query(models.Produto).filter(
        models.Produto.categoria_id == categoria_id
    ).count()

    if produtos_vinculados > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível excluir: {produtos_vinculados} produto(s) usam essa categoria."
        )

    db.delete(categoria)
    db.commit()
    return {"mensagem": "Categoria deletada"}