import path from 'path-browserify'
const modules = {}
const files = import.meta.globEager('../api/*.js')
Object.keys(files).forEach((item) => {
  const name = path.basename(item, '.js')
  modules[name] = files[item]
})
export default modules
