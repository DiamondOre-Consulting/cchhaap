const ReturnRefundPolicy = () => {
  window.scrollTo(0, 0);

  return (
    <div className="min-h-screen text-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">
           Return & Refund Policy
        </h1>

        <div className="bg-c1 shadow-lg rounded-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Exchange Conditions
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Items must be{" "}
              <span className="font-medium text-white">
                unused, unwashed, and undamaged
              </span>
            </li>
            <li>All original packaging and tags must be intact</li>
            <li>
              Items must include all original components (hangers,
              polyester bags, tags, shoe boxes, etc.)
            </li>
            <li>
              Any items that have been damaged, soiled or altered will not be
              accepted
            </li>
            <li className="font-medium text-white">
              We do not offer returns or refunds - exchanges only for size/color
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white/20  backdrop-blur rounded-lg p-6 border border-red-600/20">
            <h3 className="text-xl font-semibold text-gray-100 mb-3">
              Exchange Policy Details
            </h3>
            <div className="space-y-3 text-gray-100">
              <p className="flex items-start">
                <span className="bg-c1 text-blue-200 font-bold px-2 py-1 rounded mr-2">
                  7
                </span>
                <span>Days to request an exchange from delivery date</span>
              </p>
              <p className="flex items-start">
                <span className="bg-c1 text-blue-200 font-bold px-2 py-1 rounded mr-2">
                  24
                </span>
                <span>
                  Hours to report defective/damaged products from delivery time
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-600 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-300">
                Important Note
              </h3>
              <div className="mt-2 text-sm text-yellow-200">
                <p>
                  Non-compliant exchange requests will be sent back to the customer with
                  shipping charges applied.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-c1 p-6 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-white mb-3">
            Exchange Process
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-300">
            <li>
              Initiate exchange request through our website within 7 days of delivery
            </li>
            <li>
              Pack the item securely in its original packaging with all tags
              attached
            </li>
            <li>Wait for exchange approval and shipping instructions</li>
            <li>
              Once received and verified, we will process your size/color exchange
            </li>
            <li>
              Customer is responsible for shipping costs for the exchange
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;