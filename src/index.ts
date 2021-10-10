import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import logger from '@libs/logger'
import { defaultCommand } from '@commands/default'

async function main() {
  await yargs(hideBin(process.argv))
    .locale('en')
    .command(defaultCommand)
    .parse()

  process.exit()
}

main().catch(err => {
  logger.error(err)
  process.exit(1)
})
