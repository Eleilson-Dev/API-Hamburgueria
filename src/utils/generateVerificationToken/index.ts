import jwt from 'jsonwebtoken';

export const generateVerificationToken = (email: string) => {
  const payload = { email };
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret, { expiresIn: '10m' }); // Token válido por 10 minutos

  return token;
};
