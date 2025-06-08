import hljs from 'highlight.js/lib/core'

import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import kotlin from 'highlight.js/lib/languages/kotlin'
import swift from 'highlight.js/lib/languages/swift'
import ruby from 'highlight.js/lib/languages/ruby'
import dart from 'highlight.js/lib/languages/dart'
import shell from 'highlight.js/lib/languages/shell'
import rLang from 'highlight.js/lib/languages/r'
import perl from 'highlight.js/lib/languages/perl'
import lua from 'highlight.js/lib/languages/lua'
import haskell from 'highlight.js/lib/languages/haskell'
import elixir from 'highlight.js/lib/languages/elixir'
import scala from 'highlight.js/lib/languages/scala'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

const mostUsedLanguages = [
  "html", "css", "javascript", "typescript", "python", "java", "c", "cpp", "csharp",
  "php", "sql", "go", "rust", "kotlin", "swift", "ruby", "dart", "shell", "bash",
  "r", "perl", "assembly", "scala", "haskell", "elixir", "lua"
]

export function registerHighlightLanguages() {
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('python', python)
  hljs.registerLanguage('sql', sql)
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('cpp', cpp)
  hljs.registerLanguage('csharp', csharp)
  hljs.registerLanguage('php', php)
  hljs.registerLanguage('go', go)
  hljs.registerLanguage('rust', rust)
  hljs.registerLanguage('kotlin', kotlin)
  hljs.registerLanguage('swift', swift)
  hljs.registerLanguage('ruby', ruby)
  hljs.registerLanguage('dart', dart)
  hljs.registerLanguage('shell', shell)
  hljs.registerLanguage('r', rLang)
  hljs.registerLanguage('perl', perl)
  hljs.registerLanguage('lua', lua)
  hljs.registerLanguage('haskell', haskell)
  hljs.registerLanguage('elixir', elixir)
  hljs.registerLanguage('scala', scala)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('xml', xml)
}

export function detectLanguage(code = '') {
  const result = hljs.highlightAuto(code)
  const lang = result.language?.toLowerCase() || 'unknown'
  return mostUsedLanguages.includes(lang) ? lang : 'unknown'
}
