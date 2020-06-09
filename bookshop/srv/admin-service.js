const cds = require('@sap/cds')

/** Service implementation for AdminService */
module.exports = cds.service.impl(srv => {
  const {  OrderItems } = srv.entities('sap.capire.bookshop')
  
  srv.after(['READ', 'EDIT'], 'Orders', _calculateTotals)

  srv.before('EDIT', 'Orders', _orderhelp)

  srv.before ('*', async (req, res, context) => { 
     
    const db = await cds.connect.to('db')
    const { Orders } = db.entities
    console.log ('>>>Service Called in Before:', req.method, req.event, req.user.id)
    // req.user.id = "leo.zhang@google.com" 
    // req.reply
  })
  async function _orderhelp(context){
    // context.user.id = "leo.zhang@google.com" 
    // context.reply
    // console.log("Edit Log")

  }
  // on-the-fly calculate the total Order price based on the OrderItems' netAmounts
  async function _calculateTotals(orders, req) {
    const ordersByID = Array.isArray(orders)
      ? orders.reduce((all, o) => { (all[o.ID] = o).total = 0; return all }, {})
      : { [orders.ID]: orders }
    return cds.transaction(req).run(
      SELECT.from(OrderItems).columns('parent_ID', 'netAmount')
        .where({ parent_ID: { in: Object.keys(ordersByID) } })
    ).then(items =>
      items.forEach(item => ordersByID[item.parent_ID].total += item.netAmount)
    )
  }

})
