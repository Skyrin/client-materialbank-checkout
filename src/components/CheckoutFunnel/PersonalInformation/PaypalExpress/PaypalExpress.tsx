import { AppContext, AppContextState } from "context/AppContext";
import { createPaypalTokenForCart } from "context/CheckoutAPI/api";
import * as React from "react";
import { get } from "lodash-es";
import { RESTRequest } from "../../../../RestClient";
import { getRegionFromCode } from "../../../../constants/regions";

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
        onShippingChange: this.handlePaypalShippingChange,
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

  handlePaypalShippingChange = async (data, actions) => {
    console.log("SHIPPING");
    console.log("DATA", data);
    console.log("ACTIONS", actions);
    const cartId = this.context.cart.id;
    const region = getRegionFromCode(get(data, "shipping_address.state", "NY"));
    const estimatedShippingResponse = await RESTRequest(
      "POST",
      `guest-carts/${cartId}/estimate-shipping-methods`,
      {
        address: {
          firstname: "mock",
          lastname: "mock",
          city: get(data, "shipping_address.city", "mock"),
          region: region.name,
          region_code: region.code,
          region_id: region.id,
          street: ["mock"],
          postcode: get(data, "shipping_address.postal_code", "10001"),
          telephone: "2025550133",
          country_id: "US",
        },
      }
    );
    const estimatedShipping = await estimatedShippingResponse.json();
    console.log("ESTIMATED SHIPPING RESP", estimatedShipping);
    const freeShipping =
      (estimatedShipping || []).find(
        (option) => option.method_code === "freeshipping"
      ) || {};
    const flatrate =
      (estimatedShipping || []).find(
        (option) => option.method_code === "flatrate"
      ) || {};
    const subtotalNoDiscounts =
      this.context.cart?.prices?.subtotal_including_tax?.value || 0;
    let shipping;
    if (freeShipping && freeShipping.amount !== undefined) {
      shipping = 0;
    } else {
      shipping = flatrate.amount || 0;
    }
    const discounts = this.context.cart?.prices?.discounts || [];
    const totalDiscounts = discounts
      .map((d) => d.amount.value)
      .reduce((acc, val) => acc + val, 0);
    const subtotal = subtotalNoDiscounts - totalDiscounts;
    console.log("DISCO", discounts);
    return actions.order.patch([
      {
        op: "replace",
        path: "/purchase_units/@reference_id=='default'/amount",
        value: {
          currency_code: "USD",
          value: subtotal + shipping,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: subtotal,
            },
            shipping: {
              currency_code: "USD",
              value: shipping,
            },
          },
        },
      },
    ]);
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
