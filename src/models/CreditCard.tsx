export default class CreditCard {
  cardType: string;
  expires: string;
  last4: string;
  method: string;
  token: string;
  type: string;

  constructor(obj?: any) {
    this.cardType = obj?.cardType;
    this.expires = obj?.expires;
    this.last4 = obj?.last4;
    this.method = obj?.method;
    this.token = obj?.token;
    this.type = obj?.type;
  }
}
//
//   getObfuscatedNumber() {
//     let i = 0,
//       v = this.number.toString();
//     return this.getMaskType(this.getCreditCardBrand()).replace(/#/g, (_) => {
//       if (i >= v.length - 4) {
//         if (i >= v.length) {
//           return "";
//         }
//         return v[i++];
//       } else {
//         i++;
//         return "x";
//       }
//     });
//   }
//
//   getShortObfuscatedNumber() {
//     return (
//       "*" + this.number.substring(this.number.length - 4, this.number.length)
//     );
//   }
//
//   getMaskType(cardType: CreditCardType) {
//     switch (cardType) {
//       case CreditCardType.AmericanExpress:
//         return "#### ###### #####";
//       case CreditCardType.MasterCard:
//         return "#### #### #### ####";
//       case CreditCardType.Visa:
//         return "#### #### #### ####";
//       case CreditCardType.Diners:
//         return "#### #### #### ##";
//       case CreditCardType.Discover:
//         return "#### #### #### ####";
//       case CreditCardType.JCB:
//       case CreditCardType.Unknown:
//         return "#### #### #### ####";
//     }
//   }
//
//   getCreditCardBrand() {
//     // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
//     // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also
//
//     //JCB
//     const jcb_regex = new RegExp("^(?:2131|1800|35)[0-9]{0,}$"); //2131, 1800, 35 (3528-3589)
//     // American Express
//     const amex_regex = new RegExp("^3[47][0-9]{0,}$"); //34, 37
//     // Diners Club
//     const diners_regex = new RegExp("^3(?:0[0-59]{1}|[689])[0-9]{0,}$"); //300-305, 309, 36, 38-39
//     // Visa
//     const visa_regex = new RegExp("^4[0-9]{0,}$"); //4
//     // MasterCard
//     const mastercard_regex = new RegExp(
//       "^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$"
//     ); //2221-2720, 51-55
//     const maestro_regex = new RegExp("^(5[06789]|6)[0-9]{0,}$"); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
//     //Discover
//     const discover_regex = new RegExp(
//       "^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$"
//     );
//     ////6011, 622126-622925, 644-649, 65
//
//     // get rid of anything but numbers
//     let cur_val = this.number.replace(/\D/g, "");
//
//     // checks per each, as their could be multiple hits
//     //fix: ordering matter in detection, otherwise can give false results in rare cases
//     let sel_brand: CreditCardType = CreditCardType.Unknown;
//     if (cur_val.match(jcb_regex)) {
//       sel_brand = CreditCardType.JCB;
//     } else if (cur_val.match(amex_regex)) {
//       sel_brand = CreditCardType.AmericanExpress;
//     } else if (cur_val.match(diners_regex)) {
//       sel_brand = CreditCardType.Diners;
//     } else if (cur_val.match(visa_regex)) {
//       sel_brand = CreditCardType.Visa;
//     } else if (cur_val.match(mastercard_regex)) {
//       sel_brand = CreditCardType.MasterCard;
//     } else if (cur_val.match(discover_regex)) {
//       sel_brand = CreditCardType.Discover;
//     } else if (cur_val.match(maestro_regex)) {
//       if (cur_val[0] === "5") {
//         //started 5 must be mastercard
//         sel_brand = CreditCardType.MasterCard;
//       } else {
//         sel_brand = CreditCardType.Unknown; //maestro is all 60-69 which is not something else, thats why this condition in the end
//       }
//     }
//
//     return sel_brand;
//   }
// }
