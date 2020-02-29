// ASSUMPTIONS
// this is a canadian machine that only accepts coins that are currently in cirruclation ie no pennies
// this machine does not accept bills - only $2, $1, ¢25, ¢10, ¢5
// this machine refills stock automatically at zero inventory of that particular item
// UI will be a bonus
// there will only ever be one currency - no currency exchange

// vend-o-3000 should have the following properties
//
// an inventory object which includes :
//  - total coin
//  - inventory object(array of objects):
//      - id will be the index of the item in the array
//      - name
//      - max count
//      - current count
//      - cost
//
//  - print inventory method
//  - refill inventory method
//  - refill total coin method
//  - dispense item with extra change if needed
//
//
//  needs to be a class and have a minimum of 10 test
//
//
//

module.exports = class VendingMachine {
  constructor(inventory) {
    if (!inventory) {
      throw new Error('Inventory cannot be empty');
    }
    this.inventory = inventory;
  }

  ////////////////////////////////////////////////
  ///// PRINTS ALL CURRENT ITEMS AND COINS ///////
  ////////////////////////////////////////////////
  printInventory() {
    return this.inventory;
  }

  // THIS IS FOR SUPPLY CHAIN SO THE VENDING MACHINE OWNER KNOWS HOW MUCH INVENTORY THEY TURNOVER/REFILL
  // refillInventory() {
  // let itemDiff = [];
  // let coinDiff = [];

  // itemDiff = this.inventory.items.map(
  //   item =>
  //     item.currentCount !== item.maxCount && {
  //       id: item.id,
  //       diff: item.maxCount - item.currentCount
  //     }
  // );
  // coinDiff = this.inventory.coins.map(
  //   coin =>
  //     coin.currentCount !== coin.maxCount && {
  //       id: coin.id,
  //       diff: coin.maxCount - coin.currentCount
  //     }
  // );

  // if (itemDiff.length === 0 && coinDiff.length === 0) {
  //   return 'Inventory is full!';
  // } else {
  //   itemDiff.forEach(item => (item.id === this.inventory.items.id) && this.inventory.items);
  // }
  //   return this.printInventory();
  // }

  ////////////////////////////////////////////////////////////////////////////////////////
  // LOOPS THROUGH ALL COINS OR ITEMS TO SEE IF THEY ARE AT MAX COUNT, REPLACS IF < MAX //
  ////////////////////////////////////////////////////////////////////////////////////////

  capatilizeFirstLetter(name) {
    return name.replace(name.slice(0, 1), letter => {
      return letter.toUpperCase();
    });
  }

  refill(type) {
    let diff = false;

    this.inventory[type].forEach(value => {
      if (value.currentCount !== value.maxCount) {
        value.currentCount = value.maxCount;
        diff = true;
      }
    });

    //CAPATILIZE FIRST LETTER TO MEET TEST REQUIREMENTS
    const typeName = this.capatilizeFirstLetter(type);

    if (!diff) return `${typeName} are full!`;

    return this.printInventory();
  }

  itemValidate(itemId) {
    return this.inventory.items.find(item => item.id === itemId);
  }

  billReject(payment) {
    return payment.find(money => money > 2);
  }

  coinTotal(payment) {
    let initVal = 0;

    return payment.reduce((acc, item) => {
      return acc + item;
    }, initVal);
  }

  calculateChange(dispensedItem, totalCoin) {
    const coinReturn = [];

    for (let i = 0; i < this.inventory.coins.length; i++) {
      while (
        (totalCoin - dispensedItem.cost).toFixed(2) >=
        this.inventory.coins[i].value
      ) {
        coinReturn.push(this.inventory.coins[i].value);
        totalCoin -= this.inventory.coins[i].value;
        this.inventory.coins[i].currentCount--;
      }
    }
    return coinReturn;
  }

  ////////////////////////////////////////////////////////////////////
  // GRABS ITEM BY ID AND TAKES AN UNKNOWN AMOUNT OF CHANGE AS ARGS //
  ////////////////////////////////////////////////////////////////////
  dispense(itemId, payment) {
    let coinReturn;

    //REJECTS PURCHASE IF BILLS ARE USED
    // let bills = payment.find(money => money > 2);
    let bills = this.billReject(payment);
    if (bills) {
      return `Only coins are accepted\nReturned change: ${payment}`;
    }

    //ADDS COINS AS A TOTAL
    let totalCoin = this.coinTotal(payment);

    // const dispensedItem = this.inventory.items.find(item => item.id === itemId);
    const dispensedItem = this.itemValidate(itemId);
    if (!dispensedItem) {
      return `Item does not exsist\nReturned change: ${payment}`;
    }
    if (dispensedItem.currentCount === 0) {
      return `Item is out of stock\nReturned change: ${payment}`;
    }
    //DISPENSES APPROPIRATE AMOUNT OF CHANGE AND ADJUSTS COIN INVENTORY OR DENIES PURCHASE IF INSUFFICIENT FUNDS
    if (dispensedItem.cost > totalCoin) {
      return 'Insufficient funds';
    } else {
      coinReturn = this.calculateChange(dispensedItem, totalCoin);
    }

    //REDUCES ITEM COUNT BY 1
    dispensedItem.currentCount--;
    return `Dispensed Item: ${dispensedItem.name}\nExtra change: ${coinReturn}`;
  }
};
