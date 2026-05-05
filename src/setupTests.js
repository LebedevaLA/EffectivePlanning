import '@testing-library/jest-dom'
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    })
  }
})()

global.localStorage = localStorageMock

global.console.log = jest.fn()