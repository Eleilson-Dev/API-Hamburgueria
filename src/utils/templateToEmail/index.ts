export const templateToEmail = (code: string) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid rgba(0, 0, 0, 0.159);
            text-align: center;
            text-align: center;
            font-size: 1.5rem;
          }
          h1 {
            color: #0b0b0b;
            font-size: 22px;
          }
          p {
            color: #343434;
            font-size: 16px;
          }
          .verification-code {
            display: inline-block;
            background-color: #f1f1f1;
            padding: 10px 30px;
            margin: 20px 0;
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 2px;
            border-radius: 4px;
            border: 1px solid #dddddd;
            background-color: #27ae60;
            color: #ffff;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>Verificação de E-mail</h1>
          <p>
            Obrigado por se cadastrar! Use o código abaixo para verificar sua conta:
          </p>
          <div class="verification-code">
            <strong>${code}</strong>
          </div>
          <p>
            Este código expira em breve. Caso não tenha solicitado, ignore este
            e-mail.
          </p>
          <div class="footer">
            <p>&copy; 2024 sua empresa. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
