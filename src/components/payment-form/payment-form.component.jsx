import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";

import { PaymentFormContainer, FormContainer } from "./payment-form.styles";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        const response = await fetch('/.netlify/functions/create-payment-intent', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: 100000 })
        }).then(res => res.json())

        const clientSecret = response.paymentIntent.client_secret;

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Ala Marchewka'
                }
            }
        })

        if (paymentResult.error) {
            alert(paymentResult.error)
        } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
                alert('Payment Succesfull')
            }
        }
    }
    return (
        <PaymentFormContainer>
            <FormContainer onSubmit={paymentHandler}>
                <CardElement />
                <Button buttonType={BUTTON_TYPE_CLASSES.inverted}>Pay now</Button>
            </FormContainer>
        </PaymentFormContainer>
    )
}

export default PaymentForm;