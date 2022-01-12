export default (bookNumber) => {
  return (bookNumber <= 50) ? 'torah'
    : (bookNumber <= 160 || bookNumber === 190) ? 'poetry'
      : (bookNumber >= 220 && bookNumber <= 260) ? 'major-prophets'
        : (bookNumber >= 290 && bookNumber <= 460) ? 'minor-prophets'
          : (bookNumber >= 470 && bookNumber <= 500) ? 'gospels'
            : (bookNumber === 510) ? 'acts'
              : (bookNumber >= 520 && bookNumber <= 720) ? 'epistles'
                : (bookNumber === 730) ? 'revelations'
                  : 'non-canonical'
}
