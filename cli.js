#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})

if (argv.help || argv.h) {
	process.stdout.write(`
todo
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`fasp-client v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (process.env.NODE_DEBUG === pkg.name) console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

const createClient = require('fasp-client')

const readConfig = require('./lib/read-config')
const promptWhichReceiver = require('./lib/prompt-which-receiver')
const writeConfig = require('./lib/write-config')
const findReceiverAddress = require('./lib/find-receiver-address')
const createUi = require('./lib/ui')

const main = async () => {
	let cfg = await readConfig()
	if (!cfg || !cfg.receiver) {
		cfg.receiver = await promptWhichReceiver()
		await writeConfig(cfg)
	}

	const address = await findReceiverAddress(cfg.receiver)

	const onStatus = (status) => {
		ui.setStatus(status)
	}
	const client = createClient(address, onStatus)
	const ui = createUi(client)
}

main()
.catch(showError)
