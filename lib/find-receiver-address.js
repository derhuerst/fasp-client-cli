'use strict'

const search = require('search-fasp-receivers')

const timeout = 5 * 1000
const version = '2' // FASP v2

const findReceiverAddress = (id) => {
	if ('string' !== typeof id || !id) {
		throw new Error('id must be a non-empty string.')
	}

	// todo: use pify?
	return new Promise((resolve, reject) => {
		search.byId(id, version, timeout, (err, service) => {
			if (err) return reject(err)
			else resolve(`ws://${service.host}:${service.port}/`)
		})
	})
}

module.exports = findReceiverAddress
