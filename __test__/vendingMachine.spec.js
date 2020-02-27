const VendingMachine = require('../js/VendingMachine');
const inventory = require('../mockData.json');

describe('VendingMachine', () => {
  let vendingMachine;
  beforeEach(() => {
    vendingMachine = new VendingMachine(inventory);
  });

  //   describe('if VendingMachine does not start with inventory', () => {
  //     it('should throw error', () => {
  //       expect(new VendingMachine()).toThrow();
  //     });
  //   });

  describe('if VendingMachine args are empty', () => {
    it('should throw an error', () => {
      expect(() => new VendingMachine()).toThrow();
    });
  });

  describe('when inventory is checked', () => {
    it('should print the inventory', () => {
      expect(vendingMachine.printInventory()).toEqual(inventory.items);
    });
  });
});

// inventory should print the current items count that are greater than 0 -- SHOULD it print all items? items including those at 0 count?
// refill should reset item count to max count - return that is succeeded and what the refill amount was -- SHOULD it be all items or 1 specific refill item, sould I have both methods?
// re-supply change should reset change count to max - return that it succeeded and what the refill amount was - SOULD it execute a specific coin count?
// dispense should reduce item count by 1, but only when change is equal or greater than cost of item, if change is greater than cost - calculate difference and dispense extra change
// if coins entered equal/exceed total coin reject all incoming coins
// if coins arent divisible by 5, reject amount of coins to hit a number that is divisible by 5 (remove all pennies immeditatly)
// if coins is full, test should immediatly return full
// if inventory is full, test should immediatly return full

////////////////////////////////////////////// TODO
// Print vending machine inventory
// Refill vending machine inventory
// Re-supply vending machine change
// Dispense inventory based on payment
// Return change as coins (e.g. \$0.35 is 1 quarter and 1 dime)
