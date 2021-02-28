const TEST_QUIZ_URL = '/quiz/900'
const messageId = '#message'

describe('Quiz', () => {
  it('Should display warning message if user click check button with empty input', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('#checkBtn').click()
    cy.verifyMessage(messageId, 'Make sure fill all missing letters.')
  })
  it('Should display error message if user click check button with incorrect input', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('[data-index="0"]').type('t', { timeout: 5000 })
    cy.get('#checkBtn').click()
    cy.verifyMessage(messageId, 'Please try again')
  })
  it('Should display valid message if user click check button with correct input', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('[data-index="0"]').type('T', { timeout: 5000 })
    cy.get('#checkBtn').click()
    cy.verifyMessage(messageId, 'Yayy')
  })
  it('Should display next question if user click next button', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('[data-index="0"]').type('T', { timeout: 5000 })
    cy.get('#checkBtn').click()
    cy.get('#nextBtn').click()
    cy.verifyMessage('#question-number', '2')
  })
  it('Should display sorry message if user unable to answer within time limit', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('[data-index="0"]').type('T', { timeout: 5000 })
    cy.get('#checkBtn').click()
    cy.get('#nextBtn').click()
    cy.verifyMessage(messageId, 'Sorry...')
  })
  it('Should display sorry message if user unable to answer within time limit', () => {
    cy.visit(TEST_QUIZ_URL)
    cy.get('[data-index="0"]').type('T', { timeout: 5000 })
    cy.get('[data-index="0"]').type('i', { timeout: 5000 })
    cy.get('#checkBtn').click()
    cy.get('#nextBtn').click()
    cy.verifyMessage(messageId, 'Yayy')
  })
})