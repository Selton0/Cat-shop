from pydantic import BaseModel

class ProdutoBase(BaseModel):
    nome: str
    preco: float

class ProdutoCreate(ProdutoBase):
    pass

class Produto(ProdutoBase):
    id: int

    class Config:
        from_attributes = True