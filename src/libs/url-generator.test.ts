import urlGenerator from './url-generator'

describe('Regular cases', () => {
  const valid   = 'https://example.com'
  const invalid = '://example.com'

  test('Returns URL object without error, when valid format.', () => {
    const [url, err] = urlGenerator(valid)

    expect(url).toStrictEqual(new URL(url))
    expect(err).toBeFalsy()
  })

  test('Returns Error without URL object, when invalid format.', () => {
    const [url, err] = urlGenerator(invalid)

    expect(url).toBeFalsy()
    expect(err.code).toBe('ERR_INVALID_URL')
  })
})
