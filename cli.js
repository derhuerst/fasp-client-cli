#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'scan'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
fasp-client --scan
    Searches for receivers and lets you pick one. Also connects to it.
fasp-client
    Connects to the receiver you used the last time.
fasp-client [--receiver <id>]
    Connects to the receiver with the specified ID.
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`fasp-client v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (!err) return;
	if (process.env.NODE_DEBUG === pkg.name) console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

const createClient = require('fasp-client')
const withLocalFiles = require('fasp-client/with-local-files')
const pump = require('pump')
const split = require('split2')
const {Writable} = require('stream')

const readConfig = require('./lib/read-config')
const promptWhichReceiver = require('./lib/prompt-which-receiver')
const writeConfig = require('./lib/write-config')
const findReceiverAddress = require('./lib/find-receiver-address')
const createUi = require('./lib/ui')

const queueMode = argv._[0] === 'queue'

const main = async () => {
	let cfg = (await readConfig()) || {}
	if (argv.receiver) cfg.receiver = argv.receiver

	if (!queueMode && (argv.scan || !cfg || !cfg.receiver)) {
		cfg.receiver = await promptWhichReceiver()
		await writeConfig(cfg)
	}

	const address = await findReceiverAddress(cfg.receiver)

	let setProp = () => {}
	const onProp = (prop, val) => setProp(prop, val)
	const client = createClient(address, onProp)
	withLocalFiles(client)

	if (queueMode) {
		pump(
			process.stdin,
			split(),
			new Writable({
				objectMode: true,
				write: (url, _, cb) => {
					client.queue(url) // todo: listen for success?
					console.info('queued', url)
					cb()
				},
				final: (cb) => {
					// todo: close client nicely
					process.exit()
				}
			}),
			showError
		)
	} else {
		const ui = createUi(client)
		setProp = ui.setProp.bind(ui)
	}
}

main()
.catch(showError)
