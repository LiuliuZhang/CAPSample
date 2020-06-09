using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse')  {

  //http://localhost:4004/browse/Books?$expand=author
  @readonly entity Books as SELECT from my.Books {*} excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  action submitOrder (book : Books.ID, amount: Integer) returns String;

  //@requires_: 'authenticated-user'
  //@insertonly 
  entity Orders as projection on my.Orders;
}
