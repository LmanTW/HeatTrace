import typescript from 'typescript'
import wcwidth from 'wcwidth'
import path from 'path'
import fs from 'fs'

// Check The Codebase
export default () => {
  Log.add(` 🔎 Checking The Codebase\n`)

  let files = getFilesFromImport(path.resolve(__dirname, '../../HeatTrace/APP.ts'), [])

  Log.replace(` 🔎 Checking 0% (0 / ${files.length})`)

  const program = typescript.createProgram(files, compilerOptions.options)

  const messages: { type: 'warning' | 'error', content: string, lineContent: string, location: { filePath: string, line: number, linePosition: number }}[] = []

  files.forEach((filePath, index) => {
    program.getSemanticDiagnostics(program.getSourceFile(filePath)).forEach((diagnostic) => {
      if ([typescript.DiagnosticCategory.Warning, typescript.DiagnosticCategory.Error].includes(diagnostic.category)) {
        const locationInfo = getLocationInfo(program.getSourceFile(filePath)!.text, diagnostic.start!)

        messages.push({
          type: (diagnostic.category === typescript.DiagnosticCategory.Warning) ? 'warning' : 'error',

          content: (typeof diagnostic.messageText === 'string') ? diagnostic.messageText : diagnostic.messageText.messageText,
          lineContent: locationInfo.lineContent,

          location: {
            filePath,

            line: locationInfo.line,
            linePosition: locationInfo.linePosition
          } 
        })
      } 
    })

    Log.replace(` 🔎 Checking ${Math.round((100 / files.length) * index)}% (${index + 1} / ${files.length})`)
  })

  Log.replace(` 🔎 Checking 100% (${files.length} / ${files.length})\n`)

  let warning: number = 0
  let error: number = 0

  if (messages.length > 0) {
    Log.add('\n')

    Log.add(messages.map((message) => {
      if (message.type === 'warning') warning++
      else error++

      return ` ${(message.type === 'warning') ? `${TextColor.yellow}[Warning]` : `${TextColor.red}[Error]`}: ${message.content}\n ${TextColor.gray}| File: ${message.location.filePath}\n | Line: ${message.location.line}\n\n${TextColor.white} ${message.lineContent}\n ${' '.repeat(wcwidth(message.lineContent.substring(0, message.location.linePosition)))}^`
    }).join('\n\n')) 

    Log.add('\n\n')
  }

  Log.add(` ${TextColor.green}🔎 Successfully Checked The Codebase ${TextColor.white}(${TextColor.yellow}Warning: ${warning} ${TextColor.white}- ${TextColor.red}Error: ${error}${TextColor.white})\n\n${TextColor.reset}`)

  return messages.length === 0 
}

// Get Files From Import
function getFilesFromImport (filePath: string, files: string[]): string[] {
  const fileInfo = typescript.preProcessFile(fs.readFileSync(filePath, 'utf8'))

  fileInfo.importedFiles.forEach((module) => {
    const resolvedModule = typescript.resolveModuleName(module.fileName, filePath, compilerOptions.options, typescript.sys)

    if (resolvedModule.resolvedModule !== undefined && !resolvedModule.resolvedModule.isExternalLibraryImport) {
      if (!files.includes(resolvedModule.resolvedModule.resolvedFileName)) {
        files.push(resolvedModule.resolvedModule.resolvedFileName)

        files = getFilesFromImport(resolvedModule.resolvedModule.resolvedFileName, files)
      }
    }
  })

  return files
}

// Get Location Info 
function getLocationInfo (content: string, position: number): { line: number, lineContent: string, linePosition: number } {
  let start = position
  let end = position

  for (let i = start; i >= 0; i--) {
    if (content[start - 1] === '\n') break

    start--
  }

  for (let i = start; i < content.length; i++){ 
    if (content[start] === ' ') start++
    else break
  }

  for (let i = end; i < content.length; i++) {
    if (content[end + 1] === '\n') break

    end++
  }

  let line = 1

  for (let i = position; i >= 0; i--) {
    if (content[i] === '\n') line++
  }

  return { line, lineContent: content.substring(start, end + 1), linePosition: position - (content.substring(0, start).length) } 
}

import { Log, TextColor } from './Log'

const compilerOptions = typescript.parseJsonConfigFileContent(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../tsconfig.json'), 'utf8')), typescript.sys, './')
