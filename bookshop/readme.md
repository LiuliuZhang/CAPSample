# Bookshop Getting Started Sample

This stand-alone sample introduces the essential tasks in the development of CAP-based services as also covered in the [Getting Started guide in capire](https://cap.cloud.sap/docs/get-started/in-a-nutshell).

## Hypothetical Use Cases

1. Build a service that allows to browse _Books_ and _Authors_.
2. Books have assigned _Genres_ which are organized hierarchically.
3. All users may browse books without login.
4. All entries are maintained by Administrators.
5. End users may order books (the actual order mgmt being out of scope)

## Running the Sample

```sh
npm run watch
```

## Content & Best Practices

| Links to capire                                                                                           | Sample files / folders               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Project Setup and Layouts](https://cap.cloud.sap/docs/get-started/projects#sharing-and-reusing-content)  | [`./`](./)                           |
| [Defining Domain Models](https://cap.cloud.sap/docs/guides/domain-models)                                 | [`./db/schema.cds`](./db/schema.cds) |
| [Defining Services](https://cap.cloud.sap/docs/guides/providing-services)                                 | [`./srv/*.cds`](./srv)               |
| [Single-purposed Services](https://cap.cloud.sap/docs/guides/providing-services#single-purposed-services) | [`./srv/*.cds`](./srv)               |
| [Generic Providers](https://cap.cloud.sap/docs/guides/providing-services)                                  | http://localhost:4004                |
| Using Databases                                            | [`./db/data/*.csv`](./db/data)       |
| [Adding Custom Logic](https://cap.cloud.sap/docs/guides/service-impl)                                     | [`./srv/*.js`](./srv)                |
| Adding Tests                                                 | [`./test`](./test)                   |
| [Sharing for Reuse](https://cap.cloud.sap/docs/get-started/projects#sharing-and-reusing-content)          | [`./index.cds`](./index.cds)         |


get Order with item
http://localhost:4004/browse/Orders/64e718c9-ff99-47f1-8ca3-950c850777d4?%24expand=Items

