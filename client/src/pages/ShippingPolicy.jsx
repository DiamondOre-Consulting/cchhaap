import React, { useEffect } from 'react';

const ShippingPolicy = () => {

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  
  return (
    <div className="min-h-screen  text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white border-b border-gray-100 pb-4 mb-8">
          Shipping Policy
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Order Processing & Shipping
            </h2>
            <p className="mb-4">
              The orders for the user are shipped through registered domestic courier companies and/or speed post only.
            </p>
            <p className="mb-4">
              Orders are shipped within 10 - 15 days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Delivery Timeframes & Liability
            </h2>
            <p className="mb-4">
              Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.
            </p>
            <p>
              Delivery of all orders will be made to the address provided by the buyer at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Delivery Confirmation
            </h2>
            <p className="mb-4">
              Delivery of our services will be confirmed on your email ID as specified at the time of registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Shipping Costs
            </h2>
            <p>
              If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Additional Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not ship internationally at this time</li>
              <li>Shipping times may be extended during holiday seasons or sale periods</li>
              <li>Please ensure your shipping address is complete and accurate</li>
              <li>Signature may be required upon delivery for certain items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Tracking Your Order
            </h2>
            <p>
              Once your order has been shipped, you will receive a tracking number via email that you can use to monitor your package's journey.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;