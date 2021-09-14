# glob-crawler
A simple crawler that makes a request to a specific domain based on a local file list specified in glob format.

It is used as a countermeasure against delay of TTFB due to cache purge immediately after deploy such as firebase hosting.

## Depends
- Node.js (>= 14.x)

## Usage
```sh
# Install
$ npm i -D glob-crawler

# Crawling your website
#
# ref. https://github.com/isaacs/node-glob#glob-primer
#
$ npx glob-crawler 'https://example.com' '+(images|fonts)/**/*.*'

# Ignore webroot (first) directory
$ npx glob-crawler  'https://example.com' 'dist/**/*.*' -r
```
