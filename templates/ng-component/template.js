module.exports = {
  filesDir: './files',
  outDir: './web/src',
  variables: [
    "fileNameC",
    "inputArr"
  ],
  onComplete: (vars) => {
    let inputStr = ''
    let selectorStr = 'wt-' + vars.fileName
    if (vars.inputArr.length) {
      inputStr = ` ${vars.inputArr.map(i => `[${i}]="${i}"`).join(' ')}`
    }
// log usagemessage
    console.log(`
Now import this component using:

   import { ${vars.fileNameC}Component } from './${vars.fileName}/${vars.fileName}.component'

and use it with:

   <${selectorStr}${inputStr}></${selectorStr}>

`
    )
  }
}