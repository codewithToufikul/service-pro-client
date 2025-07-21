import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../../AuthProvider/getUserFromToken';
import { jsPDF } from 'jspdf';
import { useGetUser } from '../../AuthProvider/getUser';

function ServicePayment() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const user = getUserFromToken();
  const [clientSecret, setClientSecret] = useState('');
  const [price, setPrice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // To handle modal display
  const [transactionDetails, setTransactionDetails] = useState({});
  const stripe = useStripe();
  const elements = useElements();
  const { data, isLoading, isError, error, refetch } = useGetUser();
  // No need for showInvoice state or ref with direct PDF creation approach

  useEffect(() => {
    if (price && !isNaN(price)) {
      fetch('https://servies-pro-server.onrender.com/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(price), serviceId, userId: user.userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
  }, [price]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://servies-pro-server.onrender.com/services/${serviceId}`);
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id,
      }
    );

    if (confirmError) {
      toast.error(confirmError.message);
    } else {
      toast.success('Payment successful!');
      setPaymentSuccess(true);  // Show success modal
      setTransactionDetails({
        amount: price,
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        serviceId: serviceId,
      });

      // Send payment data to backend
      await fetch("https://servies-pro-server.onrender.com/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          userName: data.name,
          userProfileImage: data?.profileImage || "https://i.ibb.co/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
          serviceId,
          serviceName: service.title,
          amount: price,
          transactionId: paymentIntent.id,
          status: paymentIntent.status,
          orderStatus: "Pending"
        }),
      });
    }

    setIsProcessing(false);
  };

  const formatDate = () => {
    const currentDate = new Date();
    return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  };

  const generateInvoice = () => {
    if (!service || !data) {
      toast.error('Cannot generate invoice. Missing service or user data.');
      return;
    }
    
    // Create PDF directly without using html2canvas
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Define page dimensions and margins
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    
    // Add border around the page
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
    // Add header with background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, margin, pageWidth - 2 * margin, 50, 'F');
    
    // Add company name and tagline
    pdf.setTextColor(0, 119, 189); // Blue color
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('SERVICE PRO', margin + 5, margin + 15);
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    pdf.text('SMART SERVICES FOR SMART BUSINESSES', margin + 5, margin + 22);
    
    
    // Add bill to section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BILL TO:', margin + 5, margin + 30);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Name    : ${data.name || ''}`, margin + 5, margin + 36);
    pdf.text(`Phone   : ${data.number || ''}`, margin + 5, margin + 42);
    pdf.text(`Email   : ${data.email || ''}`, margin + 5, margin + 48);
    pdf.text(`Address : ${data.address || ''}`, margin + 5, margin + 54);
    pdf.text(`Trx ID  : ${transactionDetails.transactionId?.substring(0, 15) || ''}`, margin + 5, margin + 60);
    pdf.text(`Date    : ${new Date().toLocaleDateString()}`, margin + 5, margin + 66);
    
    // Add payment to section
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT TO:', pageWidth / 2 + 5, margin + 30);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name    : Service Pro`, pageWidth / 2 + 5, margin + 36);
    pdf.text(`Phone   : +8801675408601`, pageWidth / 2 + 5, margin + 42);
    pdf.text(`Email   : servicepro24x@gmail.com`, pageWidth / 2 + 5, margin + 48);
    pdf.text(`Address : North Zone B, LP 80/2, Road No. 276`, pageWidth / 2 + 5, margin + 54);
    pdf.text(`          Khalispur, Khulna 9000, Bangladesh`, pageWidth / 2 + 5, margin + 60);

    
    // Add colored triangles
    pdf.setFillColor(0, 119, 189); // Blue
    pdf.triangle(pageWidth - margin - 35, margin + 48, pageWidth - margin - 28, margin + 45, pageWidth - margin - 28, margin + 51, 'F');
    
    pdf.setFillColor(255, 152, 0); // Orange
    pdf.triangle(pageWidth - margin - 25, margin + 48, pageWidth - margin - 18, margin + 45, pageWidth - margin - 18, margin + 51, 'F');
    
    pdf.setFillColor(76, 175, 80); // Green
    pdf.triangle(pageWidth - margin - 15, margin + 48, pageWidth - margin - 8, margin + 45, pageWidth - margin - 8, margin + 51, 'F');
    
    // Add table header
    const tableTop = margin + 75;
    const col1Width = (pageWidth - 2 * margin) * 0.5;
    const col2Width = (pageWidth - 2 * margin) * 0.25;
    const col3Width = (pageWidth - 2 * margin) * 0.25;
    
    pdf.setDrawColor(0, 119, 189); // Blue color for borders
    pdf.setLineWidth(0.3);
    
    // Draw table header
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, tableTop, col1Width, 10, 'FD');
    pdf.rect(margin + col1Width, tableTop, col2Width, 10, 'FD');
    pdf.rect(margin + col1Width + col2Width, tableTop, col3Width, 10, 'FD');
    
    // Table header text
    pdf.setTextColor(0, 119, 189);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('SERVICE DESCRIPTION', margin + col1Width / 2, tableTop + 6, { align: 'center' });
    pdf.text('TOTAL AMOUNT', margin + col1Width + col2Width / 2, tableTop + 6, { align: 'center' });
    pdf.text('PAYMENT STATUS', margin + col1Width + col2Width + col3Width / 2, tableTop + 6, { align: 'center' });
    
    // Table content
    const rowHeight = 50;
    pdf.setDrawColor(0, 119, 189);
    pdf.rect(margin, tableTop + 10, col1Width, rowHeight, 'D');
    pdf.rect(margin + col1Width, tableTop + 10, col2Width, rowHeight, 'D');
    pdf.rect(margin + col1Width + col2Width, tableTop + 10, col3Width, rowHeight, 'D');
    
    
    // Add service description
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.text(service?.title || 'Service', margin + 5, tableTop + 20);
    
    // Add amount and status
    pdf.text(`${price}`, margin + col1Width + col2Width / 2, tableTop + 10 + rowHeight / 2, { align: 'center' });
    pdf.text(transactionDetails.status || 'Paid', margin + col1Width + col2Width + col3Width / 2, tableTop + 10 + rowHeight / 2, { align: 'center' });
    
    // Add footer
    const footerTop = tableTop + 10 + rowHeight + 20;
    
    // Add colored triangles in footer
    pdf.setFillColor(0, 119, 189); // Blue
    pdf.triangle(margin + 5, footerTop, margin + 12, footerTop - 3, margin + 12, footerTop + 3, 'F');
    
    pdf.setFillColor(255, 152, 0); // Orange
    pdf.triangle(margin + 15, footerTop, margin + 22, footerTop - 3, margin + 22, footerTop + 3, 'F');
    
    pdf.setFillColor(76, 175, 80); // Green
    pdf.triangle(margin + 25, footerTop, margin + 32, footerTop - 3, margin + 32, footerTop + 3, 'F');
    
    // Add circle
    pdf.setDrawColor(0, 119, 189);
    pdf.circle(margin + 45, footerTop, 3, 'D');
    
    
    // Add authorization text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AUTHORIZED BY', pageWidth - margin - 25 + 10, footerTop + 10, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.text('servicepro24x7.com', pageWidth - margin - 25 + 10, footerTop + 15, { align: 'center' });
    
    
    // Add thank you message
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text('Thank you for choosing Service Pro', pageWidth / 2, pageHeight - margin - 10, { align: 'center' });
    
    // Save the PDF
    pdf.save(`ServicePro_Invoice_${transactionDetails.transactionId ? transactionDetails.transactionId.substring(0, 8) : 'receipt'}.pdf`);
  };
  
  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-20">Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">
          Service Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Enter Amount ($)</label>
            <input
              type="number"
              min="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Card Details</label>
            <div className="border p-3 rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: { color: '#9e2146' },
                  },
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || !clientSecret || isProcessing}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Pay $${price || 0}`}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-center">Payment Successful!</h3>
            <p className="mt-4 text-center">Your payment has been processed successfully.</p>
            <button
              onClick={generateInvoice}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Download Invoice
            </button>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-14 bg-[#f9fafe] p-12 border-y-2 border-gray-300">
        <div className="max-w-[700px] mx-auto text-center">
          <h1 className="text-2xl font-bold pb-2 text-[#012970]">
            Join Our Newsletter
          </h1>
          <p className="text-lg text-gray-600 ">
            Subscribe to our newsletter to receive updates, exclusive offers, and more.
          </p>
          <div className="join mt-4">
            <input className="input join-item" placeholder="Email" />
            <button className="btn join-item rounded-r-full bg-blue-600 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ServicePayment;