let mergeComponents = {}
const modules = import.meta.globEager('./modules/*.js')
Object.keys(modules).forEach(path => {
  Object.assign(mergeComponents, modules[path]['components'])
})

export default mergeComponents
