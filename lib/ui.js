'use strict'

const stripAnsi = require('strip-ansi')
const chalk = require('chalk')
const wrap = require('prompt-skeleton')
const termSize = require('window-size').get

const cleanStr = str => stripAnsi(str).replace(/(\n|\r|\r\n)/g, ' ')

const UI = {
	abort: function () {
		if (this.takingInput) {
			this.input = ''
			this.takingInput = false
			this.render()
		} else {
			clearInterval(this.renderInterval)
			this.close()
		}
	},
	submit: function () {
		if (!this.takingInput) return this.bell()
		this.client.queue(this.input)
		this.input = ''
		this.takingInput = false
		this.render()
	},

	_: function (key) {
		if (this.takingInput) {
			this.input += key
			this.render()
			return
		}

		const c = this.client
		if (key === 'h') c.prev()
		else if (key === ' ') {
			c.playPause()
			this.status.playing = !this.status.playing
			this.render()
		} else if (key === 'l') this.next()
		else if (key === '.') c.stop()
		else if (key === ':') {
			this.takingInput = true
			this.render()
		}
	},
	delete: function () {
		if (!this.takingInput || !this.input) return this.bell()
		this.input = this.input.slice(0, -1)
		this.render()
	},

	next: function () {
		this.client.next()
	},

	up: function () {
		let v = this.status.volume
		if (!this.status.playing || v === 100) return this.bell()
		else if (v === null || v === undefined) v = 50
		else v += 5
		this.client.setVolume(v)
		this.status.volume = v
		this.render()
	},
	down: function () {
		let v = this.status.volume
		if (!this.status.playing || v === 0) return this.bell()
		else if (v === null || v === undefined) v = 30
		else v -= 5
		this.client.setVolume(v)
		this.status.volume = v
		this.render()
	},

	left: function () {
		let p = this.status.progress
		if (!this.status.playing || p === null || p === undefined || p < .1) {
			return this.bell()
		}
		this.status.progress = Math.max(p - 5, 0)
		this.client.seek(this.status.progress)
		this.render()
	},
	right: function () {
		const s = this.status
		let p = s.progress
		const l = s.length
		if (!s.playing || p === null || p === undefined || l === null || p > (l - .1)) {
			return this.bell()
		}
		s.progress = Math.min(p + 5, l - .1)
		this.client.seek(s.progress)
		this.render()
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

		const {width} = termSize()
		const ratio = Math.round(s.progress / s.length * width)
		if (!Number.isNaN(ratio)) lines.push(chalk.gray('+'.repeat(ratio)))
		else lines.push('')

		const vol = s.volume === null || s.volume === undefined
			? '-'
			: Math.round(s.volume)
		lines.push([
			`${chalk.red(s.playing ? 'pause' : 'play')} space`,
			`${chalk.red('◀︎')} h l ${chalk.red('▶︎')}`,
			`${chalk.red('vol')} ↑${chalk.gray(vol)}↓`,
			`${chalk.red('stop')} .`,
			`${chalk.red('seek')} ← →`,
			`${chalk.red('queue')} :`
			// todo: seek to position with number keys
		].join('  '))

		if (this.takingInput) lines.push(chalk.inverse('> ' + this.input))

		this.out.write(lines.join('\n') + '\n')
	}
}

const defaults = {
	status: null,
	client: null,
	renderInterval: null,

	input: '',
	takingInput: false
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
