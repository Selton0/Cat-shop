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

@app.get("/")
def home():
    return {"mensagem": "Cat-Shop funcionando!"}

@app.get("/produtos")
def listar_produtos():
    db: Session = SessionLocal()
    produtos = db.query(models.Produto).all()
    return produtos

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