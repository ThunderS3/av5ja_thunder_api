import { Hash2Id, WeaponInfoMain } from '@/enums/weapon/main'
import { ImageURL } from './image_url.dto'

export const WeaponInfoMainHash = ImageURL.transform((object) => {
  const pattern: RegExp = /\/([a-f0-9]{64})_/
  const match: RegExpMatchArray | null = object.image.url.match(pattern)
  if (match === null) {
    return null
  }
  return Hash2Id(match[1])
})
