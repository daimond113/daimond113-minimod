import Filter from 'bad-words'
import { readFileSync } from 'fs'
import { join } from 'path'

const filter = new Filter()

const wordsFile = readFileSync(join(__dirname, '../words.txt'))
const words = wordsFile.toString().split('\n')

export function hasBadWords(str: string) {
    const messageWords = str.split(/ +/)
    return messageWords.some(word => {
        const hasBadWord = (filter as any).list.some((badWord: string) => word.toLowerCase().includes(badWord))
        if (hasBadWord) {
            if (words.includes(word)) return false
            return true
        }
        return false
    })
}