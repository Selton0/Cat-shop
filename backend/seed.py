from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db: Session = Depends(get_db)

existe = db.query(models.Usuario).filter(models.Usuario.email == "admin@cat.com").first()
if not existe:
    usuario = models.Usuario(
        nome="Admin",
        email="admin@cat.com",
        senha=pwd_context.hash("1234")
    )
    db.add(usuario)
    db.commit()
    print("Usuário criado: admin@cat.com / 1234")
else:
    print("Usuário já existe.")

db.close()