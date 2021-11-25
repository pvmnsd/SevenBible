const scrollSpeed = 10

export const horizontalScrollOnWheel = ({deltaY}, target) => {
  target.scrollBy({
    left: deltaY < 0 ? -scrollSpeed : scrollSpeed,
  })
}
