// Check Values
export default (checks: Check[]): void => {
  const errors: string[] = []

  checks.forEach((check) => {
    const result = checkValue(check)

    if (result.error) errors.push(result.message!)
  })

  if (errors.length > 0) throw new Error(`Values Check Failed (${errors.length}):\n${errors.map((error) => `| ${error}`).join('\n')}\n`)
}

// Check A Value
function checkValue (check: Check): { error: boolean, message?: string } {
  if (check.min !== undefined && check.value < check.min) return { error: true, message: `Value "${check.name}" Is Less Than ${check.min} (Requirement: >= ${check.min}${(check.max === undefined) ? '' : ` And <= ${check.max}`})` }
  else if (check.max !== undefined && check.value > check.max) return { error: true, message: `Value "${check.name}" Is More Than ${check.max} (Requirement: ${(check.min === undefined) ? '' : `>= ${check.min} And `}<= ${check.max})` }

  return { error: false }
}

// Check 
interface Check {
  name: string,

  value: any,

  min?: number,
  max?: number
}
