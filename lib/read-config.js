'use strict'

const path = require('path')
const envPaths = require('env-paths')
const fs = require('fs')

const pkg = require('../package.json')

const cfgPath = path.join(envPaths(pkg.name, {suffix: ''}).data, 'config.json')

const readConfig = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(cfgPath, {encoding: 'utf8'}, (err, data) => {
			if (err) {
				if (err.code === 'ENOENT') return resolve(null)
				return reject(err)
			}
			try {
				data = JSON.parse(data)
			} catch (err) {
				return reject(err)
			}
			resolve(data)
		})
	})
}

module.exports = readConfig
