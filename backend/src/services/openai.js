import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// Lazy initialization of OpenAI client
let openai = null
const getOpenAIClient = () => {
  if (!openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-test-dummy-key-for-development') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

/**
 * Categorize a shopping item into a department using OpenAI
 * @param {string} itemName - The name of the item (e.g., "Black Forest ham")
 * @param {Array} departments - Array of available department names
 * @returns {Promise<string>} - The best matching department name
 */
export async function categorizeItem(itemName, departments) {
  try {
    const client = getOpenAIClient()

    // If OpenAI is not configured, fall back to default department
    if (!client) {
      console.log('OpenAI not configured, using default department categorization')
      return departments.find(d => d === 'Other') || departments[0]
    }

    const departmentList = departments.join(', ')

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that categorizes grocery items into store departments.
          Given an item name, return ONLY the most appropriate department name from the provided list.
          Return exactly one department name, nothing else.`,
        },
        {
          role: 'user',
          content: `Item: ${itemName}\nAvailable departments: ${departmentList}\n\nWhich department?`,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    })

    const suggestedDepartment = completion.choices[0].message.content.trim()

    // Validate that the response is actually one of the departments
    const matchedDepartment = departments.find(
      (dept) => dept.toLowerCase() === suggestedDepartment.toLowerCase()
    )

    return matchedDepartment || departments.find(d => d === 'Other') || departments[0]
  } catch (error) {
    console.error('OpenAI categorization error:', error)
    // Fallback to "Other" or first department if OpenAI fails
    return departments.find(d => d === 'Other') || departments[0]
  }
}

/**
 * Batch categorize multiple items (for efficiency)
 * @param {Array<{name: string, departments: Array<string>}>} items
 * @returns {Promise<Array<string>>}
 */
export async function batchCategorizeItems(items) {
  const promises = items.map((item) =>
    categorizeItem(item.name, item.departments)
  )
  return Promise.all(promises)
}

export default {
  categorizeItem,
  batchCategorizeItems,
}