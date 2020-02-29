const VendingMachine = require('../lib/VendingMachine');
const inventory = require('../mockData.json');
const outOfStock = require('../outOfStockData.json');

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
        vendingMachine.dispense('A1', [0.25, 0.25, 0.25, 0.1, , 0.1, 0.1])
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
});

//////////////DONE
// inventory should print the current items count that are greater than 0 -- SHOULD it print all items? items including those at 0 count?
// refill should reset item count to max count - return that is succeeded and what the refill amount was -- SHOULD it be all items or 1 specific refill item, sould I have both methods?
// re-supply change should reset change count to max - return that it succeeded and what the refill amount was - SOULD it execute a specific coin count?
// if coins is full, test should immediatly return full
// if inventory is full, test should immediatly return full
// dispense should reduce item count by 1, but only when change is equal or greater than cost of item, if change is greater than cost - calculate difference and dispense extra change
// if coins entered equal/exceed total coin reject all incoming coins

//////////////TODO
// if coins arent divisible by 5, reject amount of coins to hit a number that is divisible by 5 (remove all pennies immeditatly)

////////////////////////////////////////////// TODO
// Print vending machine inventory
// Refill vending machine inventory
// Re-supply vending machine change
// Dispense inventory based on payment
// Return change as coins (e.g. \$0.35 is 1 quarter and 1 dime)
