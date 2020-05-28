using { sap.capire.orders as my } from '../db/schema';
using { sap.capire.bookshop as books } from '@capire/bookshop';
service OrdersService {
  entity Orders as projection on my.Orders;
  entity Books as projection on books.Books;
}
