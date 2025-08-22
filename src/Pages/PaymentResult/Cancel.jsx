import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';

function PaymentCancel(){
  const [params] = useSearchParams();
  const tranId = params.get('tran_id');
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto my-16 bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-yellow-700">Payment Cancelled</h1>
        <p className="mt-2 text-gray-600">You cancelled the payment process.</p>
        {tranId && <p className="mt-2 text-sm text-gray-500">Transaction ID: {tranId}</p>}
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/services" className="px-4 py-2 bg-blue-600 text-white rounded">Try Again</Link>
          <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Go Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentCancel;


