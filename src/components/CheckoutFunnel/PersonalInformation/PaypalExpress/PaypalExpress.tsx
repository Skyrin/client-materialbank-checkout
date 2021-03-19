import { AppContext, AppContextState } from "context/AppContext";
import { createPaypalTokenForCart } from "context/CheckoutAPI/api";
import * as React from "react";
import { get } from "lodash-es";

declare var paypal: any;

type Props = {
  className?: string;
  onTransactionApproved: Function;
};

export default class PaypalExpress extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  componentDidMount() {
    console.log(paypal);
    paypal
      .Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          height: 50,
        },
        createOrder: this.createPaypalToken,
        onApprove: this.handlePaypalTransactionApprove,
      })
      .render("#paypal-express");
  }

  createPaypalToken = async () => {
    const response = await createPaypalTokenForCart(
      this.context,
      this.context.cart.id,
      true
    );
    console.log(response);
    return response["token"];
  };

  handlePaypalTransactionApprove = async (data, actions) => {
    console.log("DATA", data);
    // Get order details from Paypal
    // It contains info about the customer and the selected shipping address
    const order = await actions.order.get(data.orderID);
    console.log("ORDER", order);

    // Extract customer + shipping address info from order
    const shippingAddress = get(
      order,
      "purchase_units[0].shipping.address",
      {}
    );
    const shippingContact = get(
      order,
      "purchase_units[0].shipping.name.full_name",
      ""
    );
    const customer = get(order, "payer");
    const [shippingFirstName, shippingLastName] = shippingContact.split(" ");

    // If user is logged in, save only the paypal tokens as we already have the customer info + shipping
    this.props.onTransactionApproved({
      // Save paypal tokens so we can set the payment method on submit
      paypalExpressInfo: {
        token: data.orderID,
        payer_id: data.payerID,
      },
      customer: {
        firstname: customer.name.given_name,
        lastname: customer.name.surname,
        email: customer.email_address,
      },
      shippingAddress: {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        city: shippingAddress.admin_area_2,
        region: shippingAddress.admin_area_1,
        address: shippingAddress.address_line_1,
        aptNumber: shippingAddress.address_line_2 || "",
        zipCode: shippingAddress.postal_code,
      },
    });
  };

  render() {
    return <div id="paypal-express" className={this.props.className} />;
  }
}
