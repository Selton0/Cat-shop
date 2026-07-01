import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

async def enviar_email_boas_vindas(email: str, nome: str):
    corpo = f"""
    <div style="font-family: Arial, sans-serif;">
        <h2>Olá, {nome}! ᓚᘏᗢ</h2>
        <p>Seu cadastro no <strong>Cat-Shop</strong> foi realizado com sucesso!</p>
        <p>Agora você já pode fazer login e aproveitar a melhor pet-shop para gatos do Brasil.</p>
    </div>
    """

    mensagem = MessageSchema(
        subject="Bem-vindo ao Cat-Shop!",
        recipients=[email],
        body=corpo,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    await fm.send_message(mensagem)