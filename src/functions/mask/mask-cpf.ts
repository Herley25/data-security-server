const maskCpf = (cpf: string): string => {
  if (cpf.length !== 11) {
    throw new Error('CPF inválido') // Verificação básica do tamanho do CPF
  }

  return `${cpf.slice(0, 3)}. ***.***-${cpf.slice(9)}` // Máscara de CPF
}
