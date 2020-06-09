const cds = require('@sap/cds')
module.exports = async function () {

  const db = await cds.connect.to('db') // connect to database service
  const { Books, Orders } = db.entities         // get reflected definitions

  // Reduce stock of ordered books if available stock suffices

  this.on('submitOrder', async (req,next) => {
    console.log(" On SubmitOrder", req.data)
    const { book, amount } = req.data
    const n = await UPDATE(Books, book)
      .with({ stock: { '-=': amount } })
      .where({ stock: { '>=': amount } })
    if(n>0) req.reply("Success")    
    else    req.error(409, `${amount} exceeds stock for book #${book}`)     
  })

  this.on('READ', 'Books', ()=> console.log('On Books Read'))

  // Add some discount for overstocked books
  this.after('READ', 'Books', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  // Reduce stock of books upon incoming orders
  this.before('CREATE', 'Orders', async (req) => {

    const { OrderNo: OrderID, Items: orderItems } = req.data
    const one = await SELECT.from(Orders).where({OrderNo:OrderID})
    if(one.length){
      console.log('Already Exist')
      return req.error(409, `Order ${OrderID} Already Exist`)      
    }

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

  this.before('UPDATE', 'Orders',  (req) => { 
     req.data.currency_code = "EUR"  
     req.reply
  })
}