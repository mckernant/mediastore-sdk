# MediaStore SDK

This is the Cleeng official component library to be used with React.js.

MediaStore SDK Library consists of components that will allow you to build a seamless checkout process, help visitors become subscribers, and then allow them to manage their subscriptions.

To find out more about MediaStore SDK, see:

- [MediaStore SDK Components Library](https://developers.cleeng.com/docs/components-library)
- [API documentation](https://developers.cleeng.com/reference/getting-started)

#### Prerequisites

- node v14.15.0
- react v16.14.0

## Installation

Install the package with:

**NPM**

```
npm i @cleeng/mediastore-sdk
```

or

**Yarn**

```
yarn add @cleeng/mediastore-sdk
```

---

You may need to install `styled-components` by:

```
npm i styled-components
```

or

```
yarn add styled-components
```

## Usage

### Configuration

If you have the package downloaded locally and you want to begin to use it, you should start with the configuration. You can do this by using the `Config` class which has a few important methods to do it. Components may require additional config, so check the requirements for a component that you want to use.

Config functions save data to local storage (as `CLEENG_*` items). These data are required to make components work. <b>You need to call these functions, before MSSDK components mount, usually only once.</b>

##### Setting environment

```javascript
import { Config } from "@cleeng/mediastore-sdk";

Config.setEnvironment("sandbox");
```

Setting the environment is required for all components. The environment is one of the listed below:

- `sandbox` (default)
- `production`

##### Other Config methods

```javascript
Config.setJWT("xxx"); // save customer authorization token (jwt)
Config.setRefreshToken("yyy"); // save customer refresh token

Config.setPublisher("publisherId"); // `publisherId` is your broadcaster ID in the Cleeng system.
Config.setOffer("offerId"); // `offerId` is the ID of the offer created for your broadcaster in the Cleeng system.

Config.setCheckoutPayPalUrls({
  // PayPal redirection URLs, required for Paypal payment
  successUrl: "https://client-website.com/checkout/success",
  cancelUrl: "https://client-website.com/checkout",
  errorUrl: "https://client-website.com/checkout/error" // query param 'message' with a readable error message will be added to this URL when an error will occur
});
Config.setMyAccountPayPalUrls({
  // PayPal redirection URLs, required for update PayPal payment details
  successUrl: "https://client-website.com/my-account/payment-info",
  cancelUrl: "https://client-website.com/my-account/payment-info",
  errorUrl: "https://client-website.com/my-account/paypal-error" // query param 'message' with a readable error message will be added to this URL when an error will occur
});
Config.setMyAccountUrl("https://client-website.com/my-account"); // needed checkout legal notes

Config.setTheme(); // more informations in the [Styling] section.

// Auth methods
Auth.isLogged(); // returns true if the user is authenticated (valid JWT or existing refresh token in local storage)
Auth.logout(); // removes all Cleeng data from local storage
```

**Usage sample**

```javascript
import { useEffect } from 'react';
import { Config, Purchase, Auth } from '@cleeng/mediastore-sdk';

export default function Home() {
  Config.setEnvironment("sandbox");
  Config.setPublisher('123456789');
  Config.setJWT('customer-jwt-from-your-middleware');
  Config.setRefreshToken('customer-refresh-token-from-your-middleware');

  useEffect(() => {
    // your logic on mount
  }, []);

  return (
    <>
     {Auth.isLogged() ? (
        <Purchase offerId="S222222222_US"/>
      ) : (
        <YourCustomLogin>
      )}
    </>
  )
}
```

### Available components

You can build a complete flow - allowing customers to buy your offering and use their customer accounts - with two main components:

- [Checkout](#checkout-header) - a full purchase flow (starting from registration to purchase)
- [MyAccount](#my-account-header) - a complete customer account environment

If you prefer smaller components, you can use these to implement the exact features you need:

- [Register](#register-header)
- [Login](#login-header)
- [Capture](#capture-header)
- [Checkout Consents](#checkout-consents-header)
- [Purchase](#purchase-header)
- [PasswordReset](#password-reset-header)
- [Subscriptions](#subscriptions-header)
- [SubscriptionSwitches](#subscription-switches-header)
- [PlanDetails](#plan-details-header)
- [PaymentInfo](#payment-info-header)
- [TransactionList](#transaction-list-header)
- [UpdateProfile](#update-profile-header)

### Communication

[See how you can react to the actions that happened in the components.](#events)

#### <a id="checkout-header"></a><h2 align="center">Checkout</h2>

`Checkout` is a complex component that covers the whole checkout process, from the registration to the purchase. It contains components listed below:

- [Register](#register-header)
- [Login](#login-header)
- [Capture](#capture-header)
- [Checkout Consents](#checkout-consents-header)
- [Purchase](#purchase-header)
- [PasswordReset](#password-reset-header)

**Config methods**

```javascript
Config.setPublisherId("123456789"); // required
Config.setMyAccountUrl("https://client-website.com/my-account"); // required for legal notes
Config.setCheckoutPayPalUrls({
  // PayPal redirection URLs, required for PayPal payment
  successUrl: "https://client-website.com/checkout/success",
  cancelUrl: "https://client-website.com/checkout",
  errorUrl: "https://client-website.com/checkout/error"
});
```

**Props**

- `offerId` \* - ID of Cleeng offer, for which Checkout component should be opened
- `onSuccess` - function called after a successful checkout process
- `availablePaymentMethods` - array of the available payment methods. If provided, call for payment-methods will be skipped. Every payment method object should have `id`, `methodName` and `paymentGateway`. Payment method can be selected as a default by adding default property.

**Usage**

```javascript
const availablePaymentMethods = [
  {
    id: 142029029,
    methodName: "card",
    paymentGateway: "adyen",
    default: true
  },
  {
    id: 153379135,
    methodName: "paypal",
    paymentGateway: "paypal"
  }
];

<Checkout
  onSuccess={() => console.log("success")}
  offerId={"S531234647_PL"}
  availablePaymentMethods={availablePaymentMethods}
/>;
```

#### <a id="my-account-header"></a><h2 align="center">MyAccount</h2>

`MyAccount` is a big component that contains the whole **My Account** feature. The following sections are available in `MyAccount`:

- [Login](#login-header)
- [PlanDetails (manage subscriptions)](#plan-details-header)
- [PaymentsInfo](#payment-info-header)
- [UpdateProfile](#update-profile-header)

**Config methods**

```javascript
Config.setPublisher("111111111"); // required when JWT or refreshToken are not provided
Config.setJWT("xxx"); // optional, when Login should be skipped
Config.setRefreshToken("yyy"); // optional
Config.setMyAccountPayPalUrls({
  // PayPal redirection URLs, required for update PayPal payment details
  successUrl: "https://client-website.com/my-account/payment-info",
  cancelUrl: "https://client-website.com/my-account/payment-info",
  errorUrl: "https://client-website.com/my-account/paypal-error"
});
```

**Props**

- `customCancellationReasons` - array of the custom cancellation reasons. List of that reasons will be displayed on unsubscribe popup. The provided cancellation reasons will replace our default ones. Every cancellation reason should have key and value.
- `availablePaymentMethodIds` - object of the available payment methods IDs. If provided, call for payment-methods will be skipped (used in 'Edit payment method' section). Object properties should have a payment gateway name as a key, and a paymentMethodId as a value.

**Usage sample**

```javascript
import { MyAccount, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

const cancellationReasons = [
  { value: "Poor customer support", key: "support" },
  { value: "Switch to a different service", key: "service" }
];

const availablePaymentMethodIds = {
  adyen: 142029029,
  paypal: 153379135
};

<Provider store={store}>
  <MyAccount
    customCancellationReasons={cancellationReasons}
    availablePaymentMethodIds={availablePaymentMethodIds}
  />
</Provider>;
```

**All MyAccount components (PlanDetails, PaymentInfo, UpdateProfile, and all inside) require to be wrapped by the store.**

**Server-side rendering**
This component should be rendered in the browser. Sample of usage with **NextJS**

```javascript
import dynamic from "next/dynamic";

const MyAccount = dynamic(
  () => import("@cleeng/mediastore-sdk").then(mod => mod.MyAccount),
  { ssr: false }
);

function UserAccountPage() {
  return (
    <>
      <Header />
      <MyAccount />
      <Footer />
    </>
  );
}

export default UserAccountPage;
```

#### <a id="register-header"></a><h2 align="center">Register</h2>

`Register` component is a basic Cleeng registration form (see an example [here](https://developers.cleeng.com/docs/purchase-flow#register)).

**Config methods**

```javascript
Config.setPublisher("111111111"); // required
```

**Props**

- `onSuccess` \* - callback function called after successful registration
- `onHaveAccountClick` \* - function called when user clicks **Have an account?** below the registration form

\* - required

**Usage sample**

```javascript
import {Auth, Config, Register} from '@cleeng/mediastore-sdk';

Config.setPublisher("111111111");

{Auth.isLogged() ? (
   // your logic, when the user is logged in
  ) : (
    <Register
      onSuccess={() => console.log("success")}
      onHaveAccountClick={() => console.log("have an account clicked")}
    />
)}

```

#### <a id="login-header"></a><h2 align="center">Login</h2>

`Login` component is a basic Cleeng login form (see an example [here](https://developers.cleeng.com/docs/purchase-flow#login)).

**Config methods**

```javascript
Config.setPublisher("111111111"); // required
Config.setOffer("S123456789_US"); // optional, can be used as a replacement of setPublisher
```

**Props**

- `onSuccess` \* - callback function called after successful login
- `onRegisterClick` - function called when user clicks `Go to register` button
- `onPasswordResetClick` - function called when user clicks `Forgot password?` button

\* - required

**Usage sample**

```javascript
Config.setPublisher("111111111");

<Login
  onSuccess={() => console.log("success")}
  onRegisterClick={() => console.log("register button clicked")}
  onPasswordResetClick={() => console.log("password reset button clicked")}
/>;
```

#### <a id="password-reset-header"></a><h2 align="center">PasswordReset</h2>

`PasswordReset` is a basic reset password form that can be used for resetting passwords (see an example [here](https://developers.cleeng.com/docs/purchase-flow#passwordreset)). You can pass a function that will be called after successful processing of the request with `onSuccess` prop.

**Config methods**

```javascript
Config.setPublisher("111111111"); // required
```

**Props**

- `onSuccess` \* - callback function called after a successful reset password request

**Usage sample**

```javascript
<PasswordReset onSuccess={() => console.log("success")} />
```

#### <a id="purchase-header"></a><h2 align="center">Purchase</h2>

`Purchase` is a component that gives you a possibility to buy an offer in the Cleeng system. You have to be logged in before showing that component.

**Props**

- `offerId` \* - ID of Cleeng offer, for which Purchase component should be opened. If not provided, it will use the item from local storage with name 'CLEENG_OFFER_ID'
- `onSuccess` - function called after a successful payment process
- `availablePaymentMethods` - array of the available payment methods. If provided, call for payment-methods will be skipped. Every payment method object should have `id`, `methodName` and `paymentGateway`. Payment method can be selected as a default by adding default property.

\* - required

**Config methods**

```javascript
Config.setJWT("xxx"); // required conditionally, if Login or Register component is not used
Config.setRefreshToken("yyy"); // optional
Config.setMyAccountUrl("https://client-website.com/my-account"); // required for legal notes
Config.setCheckoutPayPalUrls({
  // PayPal redirection URLs, required for PayPal payment
  successUrl: "https://client-website.com/my-account",
  cancelUrl: "https://client-website.com/my-account",
  errorUrl: "https://client-website.com/my-account/paypal-error"
});
```

**Usage sample**

```javascript
import { Config, Purchase } from "@cleeng/mediastore-sdk";

const availablePaymentMethods = [
  {
    id: 142029029,
    methodName: "card",
    paymentGateway: "adyen",
    default: true
  },
  {
    id: 153379135,
    methodName: "paypal",
    paymentGateway: "paypal"
  }
];

<Purchase
  offerId="S538257415_PL"
  onSuccess={() => console.log("success")}
  availablePaymentMethods={availablePaymentMethods}
/>;
```

#### <a id="subscriptions-header"></a><h2 align="center">Subscriptions</h2>

`Subscriptions` is a component that will list all subscriptions that are linked with a given logged in subscriber. There is an option to cancel or resume the selected subscription from the list of subscriptions.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Usage sample**

```javascript
import { Subscriptions, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

<Provider store={store}>
  <Subscriptions />
</Provider>;
```

#### <a id="subscription-switches-header"></a><h2 align="center">SubscriptionSwitches</h2>

This component shows a list of available switches (upgrade options) for a given subscription passed in `offerId` prop.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Props**

- `offerId` \* - ID of Cleeng offer, for which possible switches should be displayed. User has to have access to this offer

- `toOfferId` - Use to open the switch popup by default. It's a ID of Cleeng offer to which user wants to switch.
- `onCancel` - required when `toOfferId` is provided. A function that will be called when the user resigns from the switch. This function should, at least, unmount the SubscriptionSwitches component
- `onSwitchSuccess` - required when `toOfferId` is provided. A function that will be called when the switch succeeds and the user will click the 'Back to settings' button. This function should, at least, unmount the SubscriptionSwitches component

If you are providing the `toOfferId` prop you need to validate if this switch is possible for the customer. It is, when <a href="https://developers.cleeng.com/reference/fetch-available-switches">available switches endpoint</a> for `offerId` will return `toOfferId` offer ID in `available` array.

**Usage sample**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Usage sample**

```javascript
import { SubscriptionSwitches, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

<Provider store={store}>
  <SubscriptionSwitches offerId={"S538257415_PL"} />
</Provider>;
```

#### <a id="plan-details-header"></a><h2 align="center">PlanDetails</h2>

`PlanDetails` is a component that contains previously described components

- [Subscriptions](#subscriptions-header)
- [SubscriptionSwitches](#subscription-switches-header)

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Props**

- `customCancellationReasons` - array of the custom cancellation reasons. List of that reasons will be displayed on unsubscribe popup. The provided cancellation reasons will replace our default ones. Every cancellation reason should have key and value.

**Usage sample**

```javascript
import { PlanDetails } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

const cancellationReasons = [
  { value: "Poor customer support", key: "support" },
  { value: "Switch to a different service", key: "service" }
];

<Provider store={store}>
  <PlanDetails customCancellationReasons={cancellationReasons} />
</Provider>;
```

**All MyAccount components (PlanDetails, PaymentInfo, UpdateProfile, and all inside) require to be wrapped by the store.**

#### <a id="payment-info-header"></a><h2 align="center">PaymentInfo</h2>

PaymentInfo is a component that contains all information about customer payments. A customer will be able to:

- see or change his/her payment methods, and
- check all transactions that took place in the past.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
Config.setMyAccountPayPalUrls({
  // PayPal redirection URLs, required for update PayPal payment details
  successUrl: "https://client-website.com/my-account/payment-info",
  cancelUrl: "https://client-website.com/my-account/payment-info",
  errorUrl: "https://client-website.com/my-account/paypal-error"
});
```

**Props**

- `availablePaymentMethodIds` - object of the available payment methods IDs. If provided, call for payment-methods will be skipped (used in 'Edit payment method' section). Object properties should have a payment gateway name as a key, and a paymentMethodId as a value.

**Usage sample**

```javascript
import { PaymentInfo, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

const availablePaymentMethodIds = {
  adyen: 142029029,
  paypal: 153379135
};

<Provider store={store}>
  <PaymentInfo availablePaymentMethodIds={availablePaymentMethodIds} />
</Provider>;
```

**All MyAccount components (PlanDetails, PaymentInfo, UpdateProfile, and all inside) require to be wrapped by the store.**

#### <a id="transaction-list-header"></a><h2 align="center">TransactionList</h2>

`TransactionList` is a part of the `PaymentInfo` component and contains only information about all transactions that took place in the past.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Usage sample**

```javascript
import { TransactionList, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

<Provider store={store}>
  <TransactionList />
</Provider>;
```

**All MyAccount components (PlanDetails, PaymentInfo, UpdateProfile, and all inside) require to be wrapped by the store.**

#### <a id="update-profile-header"></a><h2 align="center">UpdateProfile</h2>

`UpdateProfile` is a component that displays all information about a current customer. It also gives the possibility to change that profile information.

Customers will also be able to reset their password or update consents from the `UpdateProfile` component.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Usage sample**

```javascript
import { UpdateProfile, store } from "@cleeng/mediastore-sdk";
import { Provider } from "react-redux";

<Provider store={store}>
  <UpdateProfile />
</Provider>;
```

**All MyAccount components (PlanDetails, PaymentInfo, UpdateProfile, and all inside) require to be wrapped by the store.**

#### <a id="checkout-consents-header"></a><h2 align="center">CheckoutConsents</h2>

`CheckoutConsents` is a simple form that contains all consents that have to be confirmed by a customer.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Props**

- `onSuccess` \* - callback function called after successful form submission, or, if there are no available consents fields to update, immediate

```javascript
<CheckoutConsents onSuccess={() => console.log("success")} />
```

#### <a id="capture-header"></a><h2 align="center">Capture</h2>

`Capture` component is a form that was created for collecting user data that a broadcaster wants to collect. A broadcaster can enable the capture feature and configure its settings in the Cleeng broadcaster dashboard. For more information, see [Cleeng Capture](https://publisher.support.cleeng.com/hc/en-us/articles/222325667-Cleeng-Capture).

If there are any required, and unanswered, capture questions, this component will show a proper form. If there are no available capture fields and no `onSuccess` it will show the loader.

**Config methods**

```javascript
Config.setJWT("xxx"); // required
Config.setRefreshToken("yyy"); // optional
```

**Props**

- `onSuccess` \* - callback function called after successful form submission, or, if there are no available capture fields, immediate

**Usage sample**

```javascript
<Capture onSuccess={() => console.log("success")} />
```

### <a id="styling-header"></a><h2>Styling</h2>

### Font

If your application doesn't have a font specified, you can apply the default font (OpenSans) for all MSSDK components by:

```javascript
import "@cleeng/mediastore-sdk/dist/styles/msdFont.css";
```

### Styling options

There are two ways of styling MediaStore SDK components:

- [SetTheme function](#set-theme-header)
- [Custom styles](#custom-styles-header)

#### <a id="set-theme-header"></a>SetTheme function

The setTheme() function gives you a possibility to change basic colors for all MediaStore SDK components.

Here is an example how to do it:

```javascript
Config.setTheme({
  fontColor: "#ffffff",
  backgroundColor: "#292525",
  cardColor: "#675d5d",
  successColor: "#435dc5",
  primaryColor: "#435dc5",
  loaderColor: "#cccccc",
  errorColor: "red",
  logoUrl: "link-to-the-logo"
});
```

#### <a id="custom-styles-header"></a>Custom styles

Another way of styling components from the library is creating custom styles and overriding default styles by those that you have created.
Every MediaStore SDK library component has many classes that can be used to select an element that needs to be styled. Their names are based on BEM.

Here is a simple example how styles can be added:

```css
.msd__header {
  background: #292525;
  border-bottom: none;
}
.msd__header div {
  background-image: url("./logo\ —\ white.png");
  background-size: auto 60%;
}
.msd__auth-wrapper {
  background: #292525;
}
.msd__input {
  color: #fff;
}
.msd__input__label {
  background: #292525;
  color: #fff;
}
```

### <a id="events"></a><h2>Communication</h2>

Components provide a way of communication with your application. Components are sending the Events when important actions occur. Most of the events send additional data that is returned in the `detail` field. The `Event detail` column, in the table below, presents what is returned from `detail` object.
To react to events add an event listener, like in the sample below:

```javascript
window.addEventListener("MSSDK:Purchase-loaded", () =>
  console.log("Purchase component loaded")
);
window.addEventListener("MSSDK:redeem-coupon-failed", evt =>
  console.log("User tried to apply coupon:", evt.detail.coupon)
);
```

##### List of available events

| Event                                | Event detail                                                                             | Description                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MSSDK:Purchase-loaded`              | `null`                                                                                   | The event will be emitted when Purchase component data is loaded.                                                                                                                                                     |
| `MSSDK:purchase-successful`          | `{payment: { ...paymentResponse}`                                                        | The event will be emitter after successful Adyen payment action. `paymentResponse` object is just as the repsonse from [Adyen payment response](https://developers.cleeng.com/reference/payment-with-adyen-connector) |
| `MSSDK:purchase-failed`              | `{reason: "Rejection reason"}`                                                           | The event will be emitter after failed Adyen payment action.                                                                                                                                                          |
| `MSSDK:redeem-coupon-success`        | `{coupon: "coupon code"}`                                                                | The event will be emitted after a successful coupon application in the checkout process.                                                                                                                              |
| `MSSDK:redeem-coupon-failed`         | `{coupon: "coupon code"}`                                                                | The event will be emitted after a failed coupon application in the checkout process.                                                                                                                                  |
| `MSSDK:unsubscribe-button-clicked`   | `{offerId: "S123456789_US"}`                                                             | The event will be emitted after clicking the unsubscribe button in my account. This button opens an unsubscribe pop up.                                                                                               |
| `MSSDK:unsubscribe-action-confirmed` | `{offerId: "S123456789_US"}`                                                             | The event will be emitted after clicking confirm unsubscribe button in my account. This button cancels the subscription.                                                                                              |
| `MSSDK:resume-button-clicked`        | `{offerId: "S123456789_US"}`                                                             | The event will be emitted after clicking the resume button in my account. This button opens a resume pop up.                                                                                                          |
| `MSSDK:resume-action-confirmed`      | `{offerId: "S123456789_US"}`                                                             | The event will be emitted after clicking confirm resume button in my account. This button reactivates the subscription.                                                                                               |
| `MSSDK:switch-button-clicked`        | `{fromOfferId: "S123456789_US", toOfferId: "S123336741_US", switchDirection: "upgrade"}` | The event will be emitted after clicking the subscription switch (upgrade/downgrade) button in my account. This button opens an offer switch pop up.                                                                  |
| `MSSDK:edit-payment-button-clicked`  | `{paymentMethod: "card"}`                                                                | The event will be emitted after clicking Edit Payment button in my account.                                                                                                                                           |

### <a id="Translations"></a><h2>Translations</h2>

Translations allow you to add a new language version or to change default wording.
Currently, `mediastore-sdk` components are available only in English.

Below, you can find a short guide on how to implement custom copies or translations.

1. Create a `cleeng-translations` folder inside `/public` folder in your application
2. In previously created folder you can create separate folders for needed languages, eg. `/es` for Spanish.
3. Create new file in language folder and name it `translations.json`. Copy the content from [English version](https://github.com/Cleeng/mediastore-sdk/tree/main/src/translations/en) and translate the values in that file to the needed language. If you only want to modify wording, you can add and update only the needed keys with values.
4. To enable new language you have to add `?lng=es` at the end of your url or set an entry in your local storage.

```
localStorage.setItem('i18nextLng', 'es');
```

# Related documentation:

- [MediaStore SDK Reference Materials](https://developers.cleeng.com/docs/mediastore-overview)
- [API documentation](https://developers.cleeng.com/reference/getting-started)

# License

The Cleeng MediaStore SDK is open source and available under the BSD 3-Clause License. See the [LICENSE](LICENSE.md) file for more information.
