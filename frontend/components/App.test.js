import AppFunctional from './AppFunctional'
import React from 'react'

// Write your tests here
test('sanity', () => {
  expect(
    AppFunctional.prototype &&
    AppFunctional.prototype.isReactComponent
  ).not.toBeTruthy()
  // expect(true).toBe(false)
})
