export const highlightWords = (text: string, key: string[]) => {
  const regexp = new RegExp(`(${key.join('|')})`, 'gi')
  return text.replace(regexp, '<mark>$&</mark>')
}
