module.exports = {
  filesDir: './files',
  outDir: './web/src',
  variables: [
    "fileNameC",
    "inputArr"
  ],
  onComplete: (vars) => {
    console.log('Now import this component using:')
    console.log('')
    console.log(`   import { ${vars.fileNameC}Component } from './${vars.fileName}/${vars.fileName}.component'`)
    console.log('')

    let inputStr = ''
    let selectorStr = 'wt-' + vars.fileName
    if (vars.inputArr.length) {
      inputStr = ` ${vars.inputArr.map(i => `[${i}]="${i}"`).join(' ')}`
    }

    console.log('and use it with:')
    console.log('')
    console.log(`   <${selectorStr}${inputStr}></${selectorStr}>`)
    console.log('')
  }
}