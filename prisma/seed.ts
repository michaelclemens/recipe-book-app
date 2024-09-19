const emptyDb = async () => {}

const main = async () => {
  try {
    await emptyDb()

    console.log(`Database has been seeded. 🌱`)
  } catch (error) {
    throw error
  }
}

main().catch(err => {
  console.warn('Error While generating Seed: \n', err)
})
