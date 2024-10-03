export const maskCreditCard = (creditCard: string): string => {
  if (creditCard.length < 12) {
    throw new Error('Cartão de crédito inválido') // Verificação básica do tamanho do cartão de crédito
  }

  return `**** **** **** ${creditCard.slice(-4)}` // Máscara de cartão de crédito
}
