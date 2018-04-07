'use strict'

const stripAnsi = require('strip-ansi')
const chalk = require('chalk')
const wrap = require('prompt-skeleton')

const cleanStr = str => stripAnsi(str).replace(/(\n|\r|\r\n)/g, ' ')

const controls = [
	[chalk.red('prev'), 'h'],
	[chalk.red('play/pause'), 'space'],
	[chalk.red('next'), 'l'],
	[chalk.red('vol+'), 'k'],
	[chalk.red('vol-'), 'j'],
	[chalk.red('stop'), '.']
	// todo: play/queue, query url
	// todo: seek +/-5s
].map(l => l.join(' ')).join('  ')

const UI = {
	abort: function () {
		clearInterval(this.renderInterval)
		this.close()
	},
	submit: function () {
		clearInterval(this.renderInterval)
		this.close()
	},

	_: function (key) {
		const c = this.client

		if (key === 'h') c.prev()
		else if (key === ' ') c.playPause()
		else if (key === 'l') c.next()
		else if (key === 'k') {
			let v = this.status.volume
			if (v === 100) return this.bell()
			else if (v === null) v = 50
			else v += 5
			c.setVolume(v)
			this.status.volume = v
			this.render()
		} else if (key === 'j') {
			let v = this.status.volume
			if (v === 0) return this.bell()
			else if (v === null) v = 30
			else v -= 5
			c.setVolume(v)
			this.status.volume = v
			this.render()
		} else if (key === '.') c.stop()
	},

	render: function (first) {
		const s = this.status
		const lines = []

		// todo: use cleanStr
		if (s.title || s.filename) {
			let str = s.title
			if (!str) str = decodeURIComponent(s.filename)
			lines.push(chalk.bold(str))
		}
		if (s.artist) lines.push(chalk.yellow(s.artist))
		if (s.album) lines.push(chalk.blue(s.album))

		lines.push(controls)

		this.out.write(lines.join('\n') + '\n')
	}
}

const defaults = {
	status: null,
	client: null,
	renderInterval: null
}

const createUI = (client) => {
	const ui = Object.assign(Object.create(UI), defaults)
	ui.status = {}
	ui.client = client

	ui.renderInterval = setInterval(() => {
		ui.render()
	}, 1000)

	const setStatus = (status) => {
		ui.status = status || {}
		ui.render()
	}

	wrap(ui)
	return {setStatus}
}

module.exports = createUI
