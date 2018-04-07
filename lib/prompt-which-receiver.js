'use strict'

const selectPrompt = require('select-prompt')
const findFaspReceivers = require('search-fasp-receivers')

const timeout = 5 * 1000

const promptWhichReceiver = () => {
	const choices = []
	const onService = (srv) => {
		if (!srv || !srv.txtRecord || !srv.txtRecord.id) return null
		const id = srv.txtRecord.id
		choices.push({
			title: `${srv.name} (${id}) at ${srv.host}:${srv.port}`,
			value: id
		})
	}

	return new Promise((resolve, reject) => {
		findFaspReceivers(timeout, onService, () => {
			if (choices.length === 0) {
				return reject(new Error('No receivers found.'))
			}

			selectPrompt('Which receiver?', choices)
			.once('abort', () => {
				reject(new Error(`You didn't choose a receiver.`))
			})
			.once('submit', resolve)
		})
	})
}

module.exports = promptWhichReceiver
