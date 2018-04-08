# fasp-client-cli

**Control [Friendly Audio Streaming Protocol](https://github.com/derhuerst/friendly-audio-streaming-protocol) receivers from the command line.**

[![npm version](https://img.shields.io/npm/v/fasp-client-cli.svg)](https://www.npmjs.com/package/fasp-client-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/fasp-client-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install -g fasp-client-cli
```

Or use [`npx`](https://npmjs.com/package/npx).


## Usage

```js
fasp-server --scan
    Searches for receivers and lets you pick one. Also connects to it.
fasp-server
    Connects to the receiver you used the last time.
fasp-server [--receiver <id>]
    Connects to the receiver with the specified ID.
```


## Contributing

If you have a question or have difficulties using `fasp-client-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/fasp-client-cli/issues).
