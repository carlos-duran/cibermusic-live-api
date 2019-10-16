#! /usr/bin/env node
const shell = require('shelljs')

const env = process.env.NODE_ENV
if (!['prod', 'uat'].includes(env)) {
  throw new Error('Invalid environment.')
}

const user = 'carlos'
const domain = 'cibermusic.live'
const ssh = `${user}@${domain}`
const remotePath = `${domain}/${env}/api`

const remote = [
  `cd ${remotePath}`,
  `git pull origin master`,
  `pm2 restart api-${env}`
].join(' && ')

const cmd = `ssh ${ssh} "${remote}"`

shell.exec(cmd)
