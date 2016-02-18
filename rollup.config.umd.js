import babel from 'rollup-plugin-babel'
import config from './rollup.config'

config.format = 'umd'
config.dest = 'build/soft.js'
config.plugins = [
  babel({
    presets: ['es2015-rollup']
  })
]

export default config
