import axios from 'axios'
import { env } from '../env'

// Função que verifica se a URL é segura
export const checkURLSafety = async (url: string) => {
  try {
    const response = await axios.post(
      'https://safebrowsing.googleapis.com/v4/threatMatches:find',
      {
        client: {
          clientId: 'data-security',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      },
      {
        params: { key: env.GOOGLE_SAFE_BROWSING_API_KEY },
      }
    )

    if (response.data.matches) {
      throw new Error('Unsafe site detected')
    }

    return true
  } catch (error) {
    console.error('Error checking URL safety:', error)
    throw new Error('Failed to check URL safety')
  }
}
