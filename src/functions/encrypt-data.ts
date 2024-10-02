import * as crypto from 'node:crypto'

// Função de criptografia de dados
export const encryptData = (text: string): string => {
  // Define a chave de criptografia e o vetor de inicialização
  const encryptionKey = process.env.ENCRYPTION_KEY || 'defaultEncryptionKey'
  const iv = process.env.ENCRYPTION_IV || 'defaultInitializationVector'

  // Criação do Cifrador
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'utf-8'),
    Buffer.from(iv, 'utf-8')
  )

  let encrypted = cipher.update(text, 'utf-8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}
