import { CNPJ_REGEX, CPF_REGEX, EMAIL_REGEX, TELEFONE_REGEX } from "../regex/index"

/**
 * Valida se uma string é um CNPJ (apenas formato).
 * @param {string} cnpj - A string a ser validada.
 * @returns {boolean} True se for um CNPJ, false caso contrário.
 */
export function isCNPJ(cnpj: string): boolean {
    if (!cnpj) return false
    return CNPJ_REGEX.test(cnpj) || CNPJ_REGEX.test(cnpj.replace(/\D/g, ""))
}

/**
 * Valida se uma string é um CPF (apenas formato).
 * @param {string} cpf - A string a ser validada.
 * @returns {boolean} True se for um CPF, false caso contrário.
 */
export function isCPF(cpf: string): boolean {
    if (!cpf) return false
    return CPF_REGEX.test(cpf) || CPF_REGEX.test(cpf.replace(/\D/g, ""))
}

/**
 * Valida se uma string é um Email.
 * @param {string} email - A string a ser validada.
 * @returns {boolean} True se for um Email, false caso contrário.
 */
export function isEmail(email: string): boolean {
    if (!email) return false
    return EMAIL_REGEX.test(email)
}

/**
 * Valida se uma string é um número de Telefone (apenas formato brasileiro).
 * @param {string} telefone - A string a ser validada.
 * @returns {boolean} True se for um Telefone, false caso contrário.
 */
export function isTelefone(telefone: string): boolean {
    if (!telefone) return false
    const cleanTel = telefone.replace(/\D/g, "")
    const length = cleanTel.length

    if (length != 11) return false

    return /^\d{11}$/.test(cleanTel) || TELEFONE_REGEX.test(telefone)
}

/**
 * Valida se a string é uma chave PIX válida (CNPJ, CPF, Email ou Telefone).
 * @param {string} value - O valor a ser validado.
 * @returns {boolean} True se o valor for válido, false caso contrário.
 */
export function validateChavePix(value: string): boolean {
    if (!value) return false
    return isCNPJ(value) || isCPF(value) || isEmail(value) || isTelefone(value)
}
