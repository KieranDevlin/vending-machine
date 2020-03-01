const VendingMachine = require('../lib/VendingMachine');
const outOfStock = require('../outOfStockData.json');
const inventory = require('../mockData.json');

describe('VendingMachine', () => {
  let vendingMachine;

  beforeEach(() => {
    vendingMachine = new VendingMachine(inventory);
  });

  describe('if VendingMachine args are empty', () => {
    it('should throw an error', () => {
      expect(() => new VendingMachine()).toThrow();
    });
  });

  describe('when inventory is checked', () => {
    it('should print the inventory', () => {
      expect(vendingMachine.printInventory()).toBe(inventory);
    });
  });

  describe('when items are refilled', () => {
    it('should refill to the maxCount and print the inventory', () => {
      vendingMachine.inventory.items.forEach(item => (item.currentCount = 20));
      expect(vendingMachine.refill('items')).toBe(inventory);
    });
  });
  describe('when coins are refilled', () => {
    it('should refill to the maxCount and print the inventory', () => {
      vendingMachine.inventory.coins.forEach(coin => (coin.currentCount = 20));
      expect(vendingMachine.refill('coins')).toBe(inventory);
    });
  });
  describe('when items are full but refilled is executed', () => {
    it('should return "Items are full!"', () => {
      expect(vendingMachine.refill('items')).toBe('Items are full!');
    });
  });
  describe('when coins are full but refilled is executed', () => {
    it('should return "Coins are full!"', () => {
      expect(vendingMachine.refill('coins')).toBe('Coins are full!');
    });
  });
  describe('when attempt to purchase item with no available stock', () => {
    it('should return "Item is out of stock"', () => {
      const outOfStockMachine = new VendingMachine(outOfStock);
      expect(outOfStockMachine.dispense('A1', [1])).toBe(
        'Item is out of stock\nReturned change: 1'
      );
    });
  });
  describe('when attempt to purchase item with the wrong input types', () => {
    it('should throw an error', () => {
      expect(() => vendingMachine.dispense(1, 'hello')).toThrow(
        'This input is not valid'
      );
    });
  });
  describe('when attempt to purchase item that does not exsist in inventory', () => {
    it('should return "Item does not exsist"', () => {
      expect(vendingMachine.dispense('Z9', [1])).toBe(
        'Item does not exsist\nReturned change: 1'
      );
    });
  });
  describe('when attempt to purchase item with a negative amount of money', () => {
    it('should throw an error', () => {
      expect(() => vendingMachine.dispense('A1', [-1])).toThrow(
        'You cannot pay with negative monies'
      );
    });
  });
  describe('when attempt to purchase item with a bill', () => {
    it('should return "Only coins are accepted"', () => {
      expect(vendingMachine.dispense('A1', [5])).toBe(
        'Only coins are accepted\nReturned change: 5'
      );
      expect(vendingMachine.dispense('A1', [1, 0.25, 0.25, 5])).toBe(
        'Only coins are accepted\nReturned change: 1,0.25,0.25,5'
      );
    });
  });
  describe('when item is purchased with excessive change', () => {
    it('should return all extra coins', () => {
      expect(vendingMachine.dispense('A1', [1, 1, 1, 1, 1])).toBe(
        'Dispensed Item: COKE\nExtra change: 2,2'
      );
      expect(
        vendingMachine.dispense('A1', [0.25, 0.25, 0.25, 0.25, 0.05, 1])
      ).toBe('Dispensed Item: COKE\nExtra change: 1,0.05');
      expect(
        vendingMachine.dispense('A2', [0.25, 0.25, 0.25, 0.25, 0.05, 1])
      ).toBe('Dispensed Item: ORANGE\nExtra change: 0.1,0.05');
      expect(vendingMachine.dispense('A3', [2, 2, 2, 2, 2])).toBe(
        'Dispensed Item: PURPLE\nExtra change: 2,2,2,2,0.25,0.25,0.25'
      );
      expect(vendingMachine.dispense('A1', [1, 0.25, 0.1])).toBe(
        'Dispensed Item: COKE\nExtra change: 0.25,0.1'
      );
      expect(vendingMachine.dispense('A1', [1, 0.1, 0.05])).toBe(
        'Dispensed Item: COKE\nExtra change: 0.1,0.05'
      );
      expect(
        vendingMachine.dispense('A1', [0.25, 0.25, 0.25, 0.1, 0.1, 0.1])
      ).toBe('Dispensed Item: COKE\nExtra change: 0.05');
    });
  });
  describe('when attempt to purchase item with insufficient funds', () => {
    it('should return "Insufficient funds"', () => {
      expect(vendingMachine.dispense('A1', [0.5])).toBe('Insufficient funds');
    });
  });
  describe('when item is purchased with exact change', () => {
    it('should return only the item', () => {
      expect(vendingMachine.dispense('A1', [1])).toBe('Dispensed Item: COKE');
    });
  });
  describe('when item is purchased', () => {
    it('add payment to dropbox', () => {
      const testDropBox = new VendingMachine(outOfStock);
      expect(
        testDropBox.addToDropBox([2, 1, 0.25, 0.25, 0.1, 0.05, 0.05])
      ).toStrictEqual({
        toonie: 1,
        loonie: 1,
        quarter: 2,
        dime: 1,
        nickel: 2
      });
    });
  });
  describe('when item is purchased but no change is available', () => {
    it('should return inital payment with apology', () => {
      const outOfStockMachine = new VendingMachine(outOfStock);
      expect(
        outOfStockMachine.dispense('C3', [0.25, 0.25, 0.25, 0.1, 0.1, 0.1])
      ).toBe(
        'COIN INVENTORY IS EMPTY RETURNED CHANGE: 0.25,0.25,0.25,0.1,0.1,0.1'
      );
    });
  });
});
