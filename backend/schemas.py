from pydantic import BaseModel

class ProdutoBase(BaseModel):
    nome: str
    preco: float
    categoria_id: int
class ProdutoCreate(ProdutoBase):
    pass
class Produto(ProdutoBase):
    id: int
    class Config:
        from_attributes = True

class CategoriaBase(BaseModel):
    nome: str
class CategoriaCreate(CategoriaBase):
    pass
class Categoria(CategoriaBase):
    id: int
    class Config:
        from_attributes = True