import uglify from 'rollup-plugin-uglify'
import config from './rollup.config'

config.entry = 'build/soft.js'
config.dest = 'build/soft.min.js'
config.plugins = [
  uglify()
]

export default config
