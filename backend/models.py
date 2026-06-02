from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    preco = Column(Float)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria")

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)