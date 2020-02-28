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

  refillItems() {
    let itemDiff = false;

    this.inventory.items.forEach(item => {
      if (item.currentCount !== item.maxCount) {
        item.currentCount = item.maxCount;
        itemDiff = true;
      }
    });
    if (!itemDiff) return 'Items are full!';
    return this.printInventory();
  }
  refillCoins() {
    let coinDiff = false;

    this.inventory.coins.forEach(coin => {
      if (coin.currentCount !== coin.maxCount) {
        coin.currentCount = coin.maxCount;
        coinDiff = true;
      }
    });
    if (!coinDiff) return 'Coins are full!';

    return this.printInventory();
  }

  //GRABS ITEM BY ID AND TAKES AN UNKNOWN AMOUNT OF CHANGE AS ARGS
  dispense(itemId, [...change]) {
    const result = [];
    const coinReturn = [];

    //CHECKS IF TOTAL COINS IS SUFFICIENT FOR PURCHASE
    let initVal = 0;
    let totalCoin = change.reduce((acc, item) => {
      return acc + item;
    }, initVal);

    // TODO - CREATE AN ARRAY THAT RETURNS ALL COMBINATION OF COINS ABOVE $2??
    // let initVal = 0;
    // change.forEach(coin => {
    //   if (initVal > 2) {
    //     // console.log((initVal - 2).toFixed(2));
    //     // return (initVal - 2).toFixed(2);
    //     return coinReturn.push((initVal - 2).toFixed(2));
    //   }
    //   initVal = initVal + coin;
    //   // return;
    // });

    // const addedCoin = this.inventory.coins.find(
    //   coin => coin.value === change.find(coin => coin === 1)
    // );

    const dispensedItem = this.inventory.items.find(item => item.id === itemId);

    if (dispensedItem.cost > totalCoin) {
      return 'Insufficient funds';
    }

    dispensedItem.currentCount--;
    result.push(dispensedItem);

    return `Extra change: ${coinReturn}`;
  }
};
