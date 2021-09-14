import glob from 'glob'
import https from 'https'
import yargs　from 'yargs'

import logger from '@libs/logger'
import urlGenerator from '@libs/url-generator'

interface DefaultCommandArgs extends yargs.Arguments {
  url: string;
  glob: string;
  root: boolean;
}

export const defaultCommand = {
  // https://github.com/yargs/yargs/blob/master/docs/advanced.md#default-commands
  command: '$0 <url> <glob>',
  description: 'Crawl to url by file glob.',
  builder: (args: yargs.Argv) => {
    return args
      .positional('url', {
        describe: 'Host URL to crawling',
        demandOption: true,
        type: 'string',
      })
      .positional('glob', {
        describe: 'Glob pattern of file for crawling',
        demandOption: true,
        type: 'string',
      })
      .option('root', {
        alias: 'r',
        describe: 'Webroot (first directory) abbreviation flag',
        type: 'boolean',
        default: false,
      })
  },
  handler: (args: yargs.Arguments<DefaultCommandArgs>) => {
    const [url, err] = urlGenerator(args.url)

    if (err) {
      logger.error(err)
      return
    }

    glob(args.glob, (err, files) => {
      if (err) {
        logger.error(err)
        return
      }

      if (args.root) {
        files = files.map(f => f.split('/').slice(1).join('/'))
      }

      files.forEach((file) => {
        https
          .get(url + file, (res) => {
            const isOk = (res.statusCode === 200)

            if (isOk) {
              logger.success('SUCCESS:', {
                url: `${url}${file}`,
                status: res.statusCode,
                message: res.statusMessage,
                byte: res.headers['content-length'],
                type: res.headers['content-type'],
              })
            } else {
              logger.warn('FAIL:', {
                url: `${url}${file}`,
                status: res.statusCode,
                message: res.statusMessage,
              })
            }
          })
          .on('error', (err) => {
            logger.error(err)
          })
      })
    })
  }
}
