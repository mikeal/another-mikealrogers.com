import Papa from 'papaparse'

export default csv => new Promise((complete, error) => {
  Papa.parse(csv, { download: true, header: true, complete, error })
})
