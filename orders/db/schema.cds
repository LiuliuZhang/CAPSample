using { sap.capire.bookshop.Books } from '@capire/bookshop';
//using { sap.capire.products.Products } from '@capire/products';
using { Currency, managed, cuid } from '@sap/cds/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  currency : Currency;
}

entity OrderItems : cuid {
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}

// entity Books : Products {

// }
