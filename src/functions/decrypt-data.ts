import * as crypto from 'node:crypto'

export const decryptData = (encryptedText: string): string => {
  // Define a chave de criptografia e o vetor de inicial
  const encryptionKey = process.env.ENCRYPTION_KEY || 'defaultEncryptionKey'
  const iv = process.env.ENCRYPTION_IV || 'defaultInitializationVector'

  // Criação do Decifrador
  const decipher = crypto.createDecipheriv(
    'aes-256-ctr',
    Buffer.from(encryptionKey, 'utf-8'),
    Buffer.from(iv, 'utf-8')
  )

  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}
