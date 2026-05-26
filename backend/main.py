from fastapi import FastAPI, HTTPException
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

@app.post("/produtos")
def criar_produto(produto: schemas.ProdutoCreate):
    db: Session = SessionLocal()
    novo_produto = models.Produto(
        nome=produto.nome,
        preco=produto.preco
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