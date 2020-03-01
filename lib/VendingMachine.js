// ASSUMPTIONS
// this is a canadian machine that only accepts coins that are currently in cirruclation ie no pennies
// this machine does not accept bills - only $2, $1, ¢25, ¢10, ¢5
// this machine rejects purchases when stock of item or coins is at zero
// there will only ever be one currency - no currency exchange

module.exports = class VendingMachine {
  constructor(inventory) {
    if (!inventory) {
      throw new Error('Inventory cannot be empty');
    }
    this.inventory = inventory;
  }

  //PRINTS ALL INVENTORY
  printInventory() {
    return this.inventory;
  }

  //SIMPLE CAPATILIZE FIRST LETTER FUNCTION
  capatilizeFirstLetter(name) {
    return name.replace(name.slice(0, 1), letter => {
      return letter.toUpperCase();
    });
  }

  //REFILLS EITHER ITEMS OR COINS BASED ON INPUT
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

  //THROWS ERROR ON INCORRECT INPUT TYPES
  validateInput(itemId, payment) {
    if (typeof itemId !== 'string' || typeof payment !== 'object') {
      throw new Error('This input is not valid');
    }
  }

  //CHECKS IF ITEM IS CURRENTLY IN STOCK
  itemValidate(itemId) {
    return this.inventory.items.find(item => item.id === itemId);
  }

  //IMMEDITATELY REJECTS MONIES OVER $2 AKA BILLS
  billReject(payment) {
    return payment.find(money => money > 2);
  }

  //CALCULATES TOTAL OF INSTERTED COINS
  coinTotal(payment) {
    let initVal = 0;

    const total = payment.reduce((acc, item) => {
      return acc + item;
    }, initVal);

    if (total < 0) {
      throw new Error('You cannot pay with negative monies');
    } else {
      return total;
    }
  }

  //CHECK IF COINS IN INVENTORY ARE AVAILABLE
  availableCoins(total, payment) {
    let initVal = 0;
    const availableCoins = this.inventory.coins.reduce((acc, coin) => {
      return acc + coin.value * coin.currentCount;
    }, initVal);

    return availableCoins;
  }

  // THIS CALCULATES THE LEAST AMOUNT OF RETURNED CHANGE REQUIRED
  calculateChange(dispensedItem, totalCoin) {
    const coinReturn = [];
    //LOOP THROUGH ALL COIN TYPES IN DATA
    for (let i = 0; i < this.inventory.coins.length; i++) {
      //LOOP UNTIL CURRENT COIN IS GREATER THAN REMAINING VALUE
      while (
        (totalCoin - dispensedItem.cost).toFixed(2) >=
        this.inventory.coins[i].value
      ) {
        coinReturn.push(this.inventory.coins[i].value);
        totalCoin = (totalCoin - this.inventory.coins[i].value).toFixed(2);
        this.inventory.coins[i].currentCount--;
      }
    }
    return coinReturn;
  }

  //ADDS PAYMENT COINS TO SEPERATE COIN COUNTING OBJECT
  addToDropBox(payment) {
    payment.forEach(coin => {
      if (coin === 2) {
        this.inventory.dropBox.toonie++;
      }
      if (coin === 1) {
        this.inventory.dropBox.loonie++;
      }
      if (coin === 0.25) {
        this.inventory.dropBox.quarter++;
      }
      if (coin === 0.1) {
        this.inventory.dropBox.dime++;
      }
      if (coin === 0.05) {
        this.inventory.dropBox.nickel++;
      }
    });
    return this.inventory.dropBox;
  }

  //DISPENSES ITEM IF REQUIREMENTS ARE MET
  dispense(itemId, payment) {
    //ALWAYS CHECK YOUR INPUTS!
    this.validateInput(itemId, payment);
    let coinReturn;

    //REJECTS PURCHASE IF BILLS ARE USED
    let bills = this.billReject(payment);
    if (bills) {
      return `Only coins are accepted\nReturned change: ${payment}`;
    }

    //TO FIXED CONVERTS NUMBER DATA TYPE TO STRING, TO CONVERT BACK USE EVAL TO CONVERT STRING TYPE TO NUM
    //ADDS COINS AS A TOTAL
    let totalCoin = eval(this.coinTotal(payment).toFixed(2));
    //FINDS AVAILABLE COINS IN INVENTORY
    let availableCoins = eval(
      this.availableCoins(totalCoin, payment).toFixed(2)
    );
    if (totalCoin > availableCoins) {
      return `COIN INVENTORY IS EMPTY RETURNED CHANGE: ${payment}`;
    }

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
    } else if (dispensedItem.cost === totalCoin) {
      this.addToDropBox(payment);
      return `Dispensed Item: ${dispensedItem.name}`;
    } else {
      this.addToDropBox(payment);
      coinReturn = this.calculateChange(dispensedItem, totalCoin);
    }

    //REDUCES ITEM COUNT BY 1
    dispensedItem.currentCount--;
    return `Dispensed Item: ${dispensedItem.name}\nExtra change: ${coinReturn}`;
  }
};
