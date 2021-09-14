import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { defaultCommand } from '@commands/default'

yargs(hideBin(process.argv))
  .locale('en')
  .command(defaultCommand)
  .help()
  .argv
