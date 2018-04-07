'use strict'

const path = require('path')
const envPaths = require('env-paths')
const mkdirp = require('mkdirp')
const fs = require('fs')

const pkg = require('../package.json')

const cfgPath = path.join(envPaths(pkg.name, {suffix: ''}).data, 'config.json')

const writeConfig = (data) => {
	return new Promise((resolve, reject) => {
		data = JSON.stringify(data)

		mkdirp(path.dirname(cfgPath), (err) => {
			if (err) return reject(err)

			fs.writeFile(cfgPath, data, (err, data) => {
				if (err) reject(err)
				else resolve()
			})
		})
	})
}

module.exports = writeConfig
