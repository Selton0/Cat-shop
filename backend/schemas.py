from pydantic import BaseModel, EmailStr, Field

class ProdutoBase(BaseModel):
    nome: str
    preco: float
    categoria_id: int
class ProdutoCreate(ProdutoBase):
    pass
class Produto(ProdutoBase):
    id: int
    categoria: Categoria
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

class LoginInput(BaseModel):
    email: str
    senha: str

class UsuarioBase(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    senha: str = Field(min_length=4, max_length=100)

class Usuario(UsuarioBase):
    id: int
    class Config:
        from_attributes = True