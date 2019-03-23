const getFruit = async (name) => {
  const fruits = {
    pineapple: '🍍',
    peach:     '🍑',
    strawberry: '🍓'
    }

    return fruits[name]
}

const makeSmoothie = async () => {
  const a = await getFruit('pineapple')
  const b = await getFruit('peach')
  const c = await getFruit('strawberry')

  return [a, b]
}

// makeSmoothie().then(console.log)

getFruit('peach').then(console.log)