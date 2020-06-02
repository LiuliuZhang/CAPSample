using from './zcomm';
using { Currency, managed, cuid, sap } from '@sap/cds/common';
//using { sap.capire.products.Products } from '@capire/products';
namespace sap.capire.bookshop;


entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
} 
/*
entity Books : Products {
  author : Association to Authors;
  genre  : Association to Genres;
}*/

// entity Magazines : Products {
//   publisher : String;
// }

@cds.autoexpose
entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}

entity Orders : cuid, managed {
  //key ID   : UUID;
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
}
entity OrderItems: cuid{
  //key ID   : UUID;
  parent   : Association to Orders;
  book     : Association to Books;
  amount   : Integer;
  netAmount : Decimal(9,2);
}

entity Movies: additionalInfo {
    key ID   : Integer;
    name     : String(111); 
}

aspect additionalInfo{
    genre: String(100);
    language: String(200);
}