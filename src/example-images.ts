/**
 * Verified images.unsplash.com photo IDs grouped by category.
 * source.unsplash.com random URLs are gone and the official API needs a key.
 * A category is chosen at load, then the pool is shuffled to at least 24 images.
 */

export const EBannedExamplePhotoIds = [
  'photo-1470770909752-3c4fcf25f52f',
  'photo-1482192505345-5655af889ac1',
] as const

export const EExampleImageCategoryNames = [
  'nature',
  'mountains',
  'ocean',
  'forest',
  'city',
  'architecture',
  'night',
  'desert',
] as const

export type TExampleImageCategory = (typeof EExampleImageCategoryNames)[number]

const ECrops: ReadonlyArray<readonly [number, number]> = [
  [800, 1200],
  [1200, 800],
  [800, 800],
  [1000, 700],
  [800, 1000],
  [700, 1100],
]

/** HEAD-checked 200 on images.unsplash.com. Do not add IDs without verifying. */
const EVerifiedPhotoIds = [
  'photo-1418065460487-3e41a6c84dc5',
  'photo-1419242902214-272b3f66ee7a',
  'photo-1426604966848-d7adac402bff',
  'photo-1433086966358-54859d0ed716',
  'photo-1439405326854-014607f694d7',
  'photo-1441974231531-c6227db76b6e',
  'photo-1444723121867-7a241cacace9',
  'photo-1446329813274-7c9036bd9a1f',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1448375240586-882707db888b',
  'photo-1449824913935-59a10b8d2000',
  'photo-1454496522488-7a8e488e8606',
  'photo-1464146072230-91cabc968266',
  'photo-1464802686167-b939a6910659',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1465447142348-e9952c393450',
  'photo-1467269204594-9661b134dd2b',
  'photo-1469474968028-56623f02e42e',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1470770841072-f978cf4d019e',
  'photo-1472214103451-9374bd1c798e',
  'photo-1472396961693-142e6e269027',
  'photo-1473580044384-7ba9967e16a0',
  'photo-1475924156734-496f6cac6ec1',
  'photo-1477959858617-67f85cf4f1df',
  'photo-1480714378408-67cf0d13bc1b',
  'photo-1481026469463-66327c86e544',
  'photo-1483728642387-6c3bdd6c93e5',
  'photo-1486325212027-8081e485255e',
  'photo-1486870591958-9b9d0d1dda99',
  'photo-1487958449943-2429e8be8625',
  'photo-1493246507139-91e8fad9978e',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1501785888041-af3ef285b470',
  'photo-1502082553048-f009c37129b9',
  'photo-1505118380757-91f5f5632de0',
  'photo-1505142468610-359e7d316be0',
  'photo-1506905925346-21bda4d32df4',
  'photo-1506953823976-52e1fdc0149a',
  'photo-1507525428034-b723cf961d3e',
  'photo-1509316785289-025f5b846b35',
  'photo-1511497584788-876760111969',
  'photo-1514565131-fce0801e5785',
  'photo-1518837695005-2083093ee35b',
  'photo-1519501025264-65ba15a82390',
  'photo-1519681393784-d120267933ba',
  'photo-1519904981063-b0cf448d479e',
  'photo-1531366936337-7c912a4589a7',
  'photo-1542273917363-3b1817f69a2d',
  'photo-1547234935-80c7145ec969',
  'photo-1549880338-65ddcdfd017b',
  'photo-1682687220742-aba13b6e50ba',
] as const

export function exampleImagePhotoId(url: string): string | undefined {
  return url.match(/images\.unsplash\.com\/(photo-[a-z0-9-]+)/i)?.[1]
}

function photoUrl(id: string, index: number): string {
  const crop = ECrops[index % ECrops.length]!
  return `https://images.unsplash.com/${id}?auto=format&fm=jpg&fit=crop&w=${crop[0]}&h=${crop[1]}&q=80`
}

function urls(ids: readonly string[]): string[] {
  return [...new Set(ids)]
    .filter((id) => !EBannedExamplePhotoIds.includes(id as (typeof EBannedExamplePhotoIds)[number]))
    .filter((id) => (EVerifiedPhotoIds as readonly string[]).includes(id))
    .map((id, index) => photoUrl(id, index))
}

export const EExampleImageCategories: Record<TExampleImageCategory, string[]> = {
  nature: urls([
    'photo-1501785888041-af3ef285b470',
    'photo-1469474968028-56623f02e42e',
    'photo-1441974231531-c6227db76b6e',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1426604966848-d7adac402bff',
    'photo-1472214103451-9374bd1c798e',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1433086966358-54859d0ed716',
    'photo-1470770841072-f978cf4d019e',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1511497584788-876760111969',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1519681393784-d120267933ba',
    'photo-1506905925346-21bda4d32df4',
    'photo-1502082553048-f009c37129b9',
    'photo-1446329813274-7c9036bd9a1f',
    'photo-1472396961693-142e6e269027',
    'photo-1542273917363-3b1817f69a2d',
    'photo-1507525428034-b723cf961d3e',
    'photo-1493246507139-91e8fad9978e',
    'photo-1473580044384-7ba9967e16a0',
    'photo-1682687220742-aba13b6e50ba',
  ]),
  mountains: urls([
    'photo-1464822759023-fed622ff2c3b',
    'photo-1506905925346-21bda4d32df4',
    'photo-1486870591958-9b9d0d1dda99',
    'photo-1483728642387-6c3bdd6c93e5',
    'photo-1519681393784-d120267933ba',
    'photo-1454496522488-7a8e488e8606',
    'photo-1519904981063-b0cf448d479e',
    'photo-1549880338-65ddcdfd017b',
    'photo-1493246507139-91e8fad9978e',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1501785888041-af3ef285b470',
    'photo-1426604966848-d7adac402bff',
    'photo-1469474968028-56623f02e42e',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1441974231531-c6227db76b6e',
    'photo-1472214103451-9374bd1c798e',
    'photo-1470770841072-f978cf4d019e',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1511497584788-876760111969',
    'photo-1433086966358-54859d0ed716',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1454496522488-7a8e488e8606',
    'photo-1682687220742-aba13b6e50ba',
  ]),
  ocean: urls([
    'photo-1507525428034-b723cf961d3e',
    'photo-1505118380757-91f5f5632de0',
    'photo-1439405326854-014607f694d7',
    'photo-1518837695005-2083093ee35b',
    'photo-1505142468610-359e7d316be0',
    'photo-1506953823976-52e1fdc0149a',
    'photo-1501785888041-af3ef285b470',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1433086966358-54859d0ed716',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1441974231531-c6227db76b6e',
    'photo-1469474968028-56623f02e42e',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1426604966848-d7adac402bff',
    'photo-1472214103451-9374bd1c798e',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1470770841072-f978cf4d019e',
    'photo-1511497584788-876760111969',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1493246507139-91e8fad9978e',
    'photo-1502082553048-f009c37129b9',
    'photo-1472396961693-142e6e269027',
    'photo-1542273917363-3b1817f69a2d',
  ]),
  forest: urls([
    'photo-1441974231531-c6227db76b6e',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1511497584788-876760111969',
    'photo-1448375240586-882707db888b',
    'photo-1542273917363-3b1817f69a2d',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1502082553048-f009c37129b9',
    'photo-1472396961693-142e6e269027',
    'photo-1446329813274-7c9036bd9a1f',
    'photo-1426604966848-d7adac402bff',
    'photo-1472214103451-9374bd1c798e',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1470770841072-f978cf4d019e',
    'photo-1469474968028-56623f02e42e',
    'photo-1501785888041-af3ef285b470',
    'photo-1519681393784-d120267933ba',
    'photo-1433086966358-54859d0ed716',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1493246507139-91e8fad9978e',
    'photo-1506905925346-21bda4d32df4',
    'photo-1454496522488-7a8e488e8606',
    'photo-1682687220742-aba13b6e50ba',
  ]),
  city: urls([
    'photo-1467269204594-9661b134dd2b',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1449824913935-59a10b8d2000',
    'photo-1477959858617-67f85cf4f1df',
    'photo-1486325212027-8081e485255e',
    'photo-1514565131-fce0801e5785',
    'photo-1444723121867-7a241cacace9',
    'photo-1465447142348-e9952c393450',
    'photo-1519501025264-65ba15a82390',
    'photo-1487958449943-2429e8be8625',
    'photo-1481026469463-66327c86e544',
    'photo-1464146072230-91cabc968266',
    'photo-1419242902214-272b3f66ee7a',
    'photo-1464802686167-b939a6910659',
    'photo-1531366936337-7c912a4589a7',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1449824913935-59a10b8d2000',
    'photo-1477959858617-67f85cf4f1df',
    'photo-1514565131-fce0801e5785',
    'photo-1444723121867-7a241cacace9',
    'photo-1465447142348-e9952c393450',
    'photo-1467269204594-9661b134dd2b',
    'photo-1486325212027-8081e485255e',
    'photo-1487958449943-2429e8be8625',
    'photo-1519501025264-65ba15a82390',
  ]),
  architecture: urls([
    'photo-1486325212027-8081e485255e',
    'photo-1487958449943-2429e8be8625',
    'photo-1481026469463-66327c86e544',
    'photo-1464146072230-91cabc968266',
    'photo-1477959858617-67f85cf4f1df',
    'photo-1449824913935-59a10b8d2000',
    'photo-1467269204594-9661b134dd2b',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1514565131-fce0801e5785',
    'photo-1444723121867-7a241cacace9',
    'photo-1465447142348-e9952c393450',
    'photo-1519501025264-65ba15a82390',
    'photo-1419242902214-272b3f66ee7a',
    'photo-1464802686167-b939a6910659',
    'photo-1531366936337-7c912a4589a7',
    'photo-1486325212027-8081e485255e',
    'photo-1487958449943-2429e8be8625',
    'photo-1481026469463-66327c86e544',
    'photo-1464146072230-91cabc968266',
    'photo-1477959858617-67f85cf4f1df',
    'photo-1449824913935-59a10b8d2000',
    'photo-1467269204594-9661b134dd2b',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1514565131-fce0801e5785',
    'photo-1444723121867-7a241cacace9',
  ]),
  night: urls([
    'photo-1419242902214-272b3f66ee7a',
    'photo-1464802686167-b939a6910659',
    'photo-1531366936337-7c912a4589a7',
    'photo-1519681393784-d120267933ba',
    'photo-1519501025264-65ba15a82390',
    'photo-1501785888041-af3ef285b470',
    'photo-1469474968028-56623f02e42e',
    'photo-1506905925346-21bda4d32df4',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1426604966848-d7adac402bff',
    'photo-1472214103451-9374bd1c798e',
    'photo-1441974231531-c6227db76b6e',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1470770841072-f978cf4d019e',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1511497584788-876760111969',
    'photo-1433086966358-54859d0ed716',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1477959858617-67f85cf4f1df',
    'photo-1449824913935-59a10b8d2000',
    'photo-1514565131-fce0801e5785',
    'photo-1467269204594-9661b134dd2b',
  ]),
  desert: urls([
    'photo-1509316785289-025f5b846b35',
    'photo-1473580044384-7ba9967e16a0',
    'photo-1547234935-80c7145ec969',
    'photo-1682687220742-aba13b6e50ba',
    'photo-1469474968028-56623f02e42e',
    'photo-1501785888041-af3ef285b470',
    'photo-1506905925346-21bda4d32df4',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1426604966848-d7adac402bff',
    'photo-1472214103451-9374bd1c798e',
    'photo-1441974231531-c6227db76b6e',
    'photo-1500534314209-a25ddb2bd429',
    'photo-1418065460487-3e41a6c84dc5',
    'photo-1470770841072-f978cf4d019e',
    'photo-1519681393784-d120267933ba',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1475924156734-496f6cac6ec1',
    'photo-1433086966358-54859d0ed716',
    'photo-1500530855697-b586d89ba3ee',
    'photo-1511497584788-876760111969',
    'photo-1486870591958-9b9d0d1dda99',
    'photo-1483728642387-6c3bdd6c93e5',
    'photo-1454496522488-7a8e488e8606',
    'photo-1519904981063-b0cf448d479e',
  ]),
}

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = next[index]!
    next[index] = next[swap]!
    next[swap] = current
  }
  return next
}

export function pickExampleImages(count = 24): { category: TExampleImageCategory, images: string[] } {
  const wanted = Math.max(count, 24)
  const category = EExampleImageCategoryNames[Math.floor(Math.random() * EExampleImageCategoryNames.length)]!
  const unique = [...new Set(EExampleImageCategories[category])]
  const images = shuffle(unique).slice(0, wanted)
  if (images.length < wanted) {
    const extras = shuffle(
      Object.values(EExampleImageCategories).flat().filter((url) => !images.includes(url)),
    )
    images.push(...extras.slice(0, wanted - images.length))
  }
  return { category, images }
}

/** Static fallback used only where a constant array is required. Prefer pickExampleImages(). */
export const EExampleImages = EExampleImageCategories.nature.slice(0, 24)
