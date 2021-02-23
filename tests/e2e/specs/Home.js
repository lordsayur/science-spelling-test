// https://docs.cypress.io/api/introduction/api.html

describe('Home', () => {
  it('Should display Science Spelling Test', () => {
    cy.visit('/')
    cy.contains('h1', 'Science Spelling Test')
  })
})
