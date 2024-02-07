class Product {
    constructor(sku, name, description, price, onHandQuantity, lastReceivedDate) {
      this.sku = sku;
      this.name = name;
      this.description = description;
      this.price = price;
      this.onHandQuantity = onHandQuantity;
      this.lastReceivedDate = lastReceivedDate;
    }
  }
  
  module.exports = Product;
  