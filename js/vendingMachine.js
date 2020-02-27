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
//  - inventory object(array of objects?):
//      - id
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

let vendo = class {
  constructor(name) {
    this.name = name;
  }
};
console.log(new vendo('vend-o-3000'));
