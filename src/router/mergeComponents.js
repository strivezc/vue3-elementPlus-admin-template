let mergeComponents = {}
const modules = import.meta.globEager('./modules/*.js');
console.log(modules,'modules');
Object.keys(modules).forEach((path) => {
  Object.assign(mergeComponents,modules[path]['components']);
});

export default mergeComponents;
