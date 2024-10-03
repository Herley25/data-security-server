import * as crypto from 'node:crypto'
import { env } from '../env'

// Função para garantir que a chave tenha 32 bytes
const getEncryptionKey = (key: string): Buffer => {
  return crypto.createHash('sha256').update(key).digest() // Trunca ou preenche a chave para 32 bytes
}

// Função para garantir que o IV tenha 16 bytes
const getIV = (iv: string): Buffer => {
  return Buffer.from(iv).slice(0, 16).length === 16
    ? Buffer.from(iv).slice(0, 16)
    : crypto.randomBytes(16) // Gera IV se não estiver definido corretamente
}

// Função de descriptografia de dados
export const decryptData = (encryptedText: string): string => {
  // Define a chave de criptografia e o vetor de inicialização
  const encryptionKey = getEncryptionKey(
    env.ENCRYPTION_KEY || 'defaultEncryptionKey'
  ) // 32 bytes
  const iv = getIV(env.ENCRYPTION_IV || 'defaultInitializationVector') // 16 bytes

  // Criação do Decifrador
  const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionKey, iv)

  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}
