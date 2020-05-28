const cds = require('@sap/cds')
module.exports = async function () {

  const db = await cds.connect.to('db') // connect to database service
  const { Books } = db.entities         // get reflected definitions

  // Reduce stock of ordered books if available stock suffices

  this.on('submitOrder', async req => {
    console.log(" On SubmitOrder")
    const { book, amount } = req.data
    const n = await UPDATE(Books, book)
      .with({ stock: { '-=': amount } })
      .where({ stock: { '>=': amount } })
    n > 0 || req.error(409, `${amount} exceeds stock for book #${book}`)
  })

  this.on('READ', 'Books', ()=> console.log('On Books Read'))

  // Add some discount for overstocked books
  this.after('READ', 'Books', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  // Reduce stock of books upon incoming orders
  this.before('CREATE', 'Orders', async (req) => {
    // const tx = cds.transaction(req), 
    // order = req.data;
    // if (order.Items) {
    //   const affectedRows = await tx.run(order.Items.map(item =>
    //     UPDATE(Books).where({ ID: item.book_ID })
    //       .and(`stock >=`, item.amount)
    //       .set(`stock -=`, item.amount)
    //   )
    // )
    // if (affectedRows.some(row => !row)) req.error(409, 'Sold out, sorry')
    // }

    const { Items: orderItems } = req.data

    return cds.transaction(req) .run (()=> orderItems.map (item =>
      UPDATE (Books)
        .set ('stock -=', item.amount)
        .where ('ID =', item.book_ID) .and ('stock >=', item.amount)
    )).then (all => all.forEach ((affectedRows,i) => {
      if (affectedRows === 0) {
        req.error (409, `${orderItems[i].amount} exceeds stock for book #${orderItems[i].book_ID}`)
      }
    }))    

  })

  //this.before ('*', (req) => { console.debug ('>>>', req.method, req.target) })
}


/** Reduce stock of ordered books if available stock suffices */
async function _reduceStock (req) {
  const { Items: orderItems } = req.data

  return cds.transaction(req) .run (()=> orderItems.map (item =>
    UPDATE (Books)
      .set ('stock -=', item.amount)
      .where ('ID =', item.book_ID) .and ('stock >=', item.amount)
  )).then (all => all.forEach ((affectedRows,i) => {
    if (affectedRows === 0) {
      req.error (409, `${orderItems[i].amount} exceeds stock for book #${orderItems[i].book_ID}`)
    }
  }))
}