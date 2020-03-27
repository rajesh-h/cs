import { StoreDB } from '@/services/fireinit.js'

const fetchCategories = () => {
  try {
    StoreDB.collection('categories')
      .doc('categories')
      .get()
      .then((res) => {
        // eslint-disable-next-line no-console
        return res
      })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      'Error Fetching Data from firestore, As Precaution Error message is not printed here. Go Ahead and print error message on debug mode'
    )
    // console.log(e)
    // alert(e)
    alert('Error Fetching Data, please contact Webmaster')
  }
}

export { fetchCategories }
