import util  from 'util'
import yargs　from 'yargs'
import glob from 'glob'
import pupeteer from 'puppeteer'

import logger from '@libs/logger'
import urlGenerator from '@libs/url-generator'

// https://github.com/isaacs/node-glob/issues/228
const asyncGlob = util.promisify(glob)

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
  handler: async (args: yargs.Arguments<DefaultCommandArgs>) => {
    const [url, err] = urlGenerator(args.url)

    if (err) {
      throw err
    }

    let files = await asyncGlob(args.glob)

    if (!files || !files.length) {
      throw new Error('File not found')
    }

    if (args.root) {
      files = files.map(f => f.split('/').slice(1).join('/'))
    }

    const browser = await pupeteer.launch()

    await Promise.all(files.map(async file => {
      const page = await browser.newPage()
      const response = await page.goto(url + file)
        .catch(e => {
          logger.warn('ABORT:', {
            url: `${url}${file}`,
            message: e.message,
          })
        })

      if (!response) {
        return
      }

      const metrics = await page.metrics()
      const headers = response.headers()

      if (!response.ok) {
        logger.warn('FAIL:', {
          url: `${url}${file}`,
          status: response.status(),
        })

        return
      }

      logger.success('SUCCESS:', {
        url: `${url}${file}`,
        status: response.status(),
        byte: headers['content-length'],
        type: headers['content-type'],
        time: metrics.TaskDuration,
      })
    }))
  }
}
