import * as crypto from 'node:crypto'

export const generateEncrypt = () => {
  // Gera uma chave de 32 bytes para AES-256
  const encryptionKeyGenerate = crypto.randomBytes(32).toString('hex') // 64 caracteres hexadecimais

  // Gera um vetor de inicialização de 16 bytes
  const ivGenerate = crypto.randomBytes(16).toString('hex') // 32 caracteres hexadecimais

  console.log('Encryption Key:', encryptionKeyGenerate)
  console.log('Initialization Vector (IV):', ivGenerate)
}
