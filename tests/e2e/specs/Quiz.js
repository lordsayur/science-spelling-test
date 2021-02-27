describe('Quiz', () => {
  it('Shoud display warning message if user click check button with empty input', () => {
    cy.visit('/quiz/1')
    cy.get('#checkBtn').click()
    cy.get('#message').should((message) => {
      expect(message).to.contain('Make sure fill all missing letters.')
    })
  })
  it('Shoud display error message if user click check button with incorrect input', () => {
    cy.visit('/quiz/1')
    cy.get('input').type('h')
    cy.get('#checkBtn').click()
    cy.get('#message').should((message) => {
      expect(message).to.contain('Please try again')
    })
  })
  it('Shoud display valid message if user click check button with correct input', () => {
    cy.visit('/quiz/1')
    cy.get('input').type('H')
    cy.get('#checkBtn').click()
    cy.get('#message').should((message) => {
      expect(message).to.contain('Yayy')
    })
  })
  it('Shoud display next question if user click next button', () => {
    cy.visit('/quiz/1')
    cy.get('input').type('H')
    cy.get('#checkBtn').click()
    cy.get('#nextBtn').click()
    cy.get('#question-number').should((message) => {
      expect(message).to.contain('2')
    })
  })
  it('Shoud display sorry message if user unable to answer within time limit', () => {
    cy.visit('/quiz/1')
    cy.get('input').type('H')
    cy.get('#checkBtn').click()
    cy.get('#checkBtn').click()
    cy.get('#message', { timeout: 10000 }).should((message) => {
      expect(message).to.contain('Sorry...')
    })
  })
})