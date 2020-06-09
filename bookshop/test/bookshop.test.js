
const cds = require('@sap/cds')

describe('Bookshop: OData Protocol Level Testing', () => {
  const app = require('express')()
  const request = require('supertest')(app)

  beforeAll(async () => {
    const option = {
      "mocked": true,
      "service": "all",
      "with-mocks": true
    }
    const model = cds.model = await cds.load((__dirname + '/../'))
    await cds.connect.to('db')
    await cds.serve().from(__dirname + '/../').in(app)

  })

  it('Service $metadata document', async () => {
    const response = await request
      .get('/browse/$metadata')
      .expect(200)
    const expectedVersion = '<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">'
    const expectedBooksEntitySet = '<EntitySet Name="Books" EntityType="CatalogService.Books">'
    expect(response.text.includes(expectedVersion)).toBeTruthy()
    expect(response.text.includes(expectedBooksEntitySet)).toBeTruthy()
  })

  it('Create Order', async () => {
    const response = await request
      .post('/browse/Orders')
      .send({
        "OrderNo": "10",
        "currency_code": "EUR",
        "Items": [
          {
            "amount": 1,
            "book_ID": 252
          }
        ]
      })
      .set('Accept', 'application/json')
      .expect(200)

      console.log(">>Create Order Success:",response.status, response.body)    
  })

  
  it('Service submitOrder', async () => {
    const response = await request
      .post('/browse/submitOrder')
      .send({ amount: 1, book: 252 })
      .set('Accept', 'application/json')
      .expect(200)

      expect(response.body.value).toEqual("Success")
      console.log(">>Submit Order:",response.status, response.body)
  })

  it('Service submitOrder Fail', async () => {
    const response = await request
      .post('/browse/submitOrder')
      .send({ amount: 1000, book: 252 })
      .set('Accept', 'application/json')
      .expect(409)

      console.log(">>Submit Order Failed:",response.status, response.body)
  })

  it('Get with select, expand and localized', async () => {
    const response = await request
      .get('/browse/Books?$select=title,author&$expand=currency&sap-language=de')
      .expect('Content-Type', /^application\/json/)
      .expect(200)

    expect(response.body.value.length).toEqual(5)
  })
})

describe('Bookshop: CDS Service Level Testing', () => {
  let srv, Books

  beforeAll(async () => {
    srv = await cds.serve('CatalogService').from(__dirname + '/../srv/cat-service')
    Books = srv.entities.Books
    expect(Books).toBeDefined()
  })

  it('GETs all books', async () => {
    const books = await srv.read(Books, b => { b.title })

    expect(books).toMatchObject([
      { title: 'Wuthering Heights' },
      { title: 'Jane Eyre' },
      { title: 'The Raven' },
      { title: 'Eleonora' },
      { title: 'Catweazle' }
    ])
  })
})