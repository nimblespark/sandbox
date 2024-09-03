/** Rotates an array by n places
 * @return a new rotated array
 * */
export function rotateBy<T>(by: number, itemsOld: Array<T>) {
  let items = [...itemsOld]
  if (items.length < 2) return items

  for (let i = 0; i < by; i++) {
    items.push(items.shift()!)
  }

  return items
}
