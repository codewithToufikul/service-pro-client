import React, { useEffect, useState } from 'react';
import { Calendar, CreditCard, CheckCircle, Clock, AlertCircle, Loader2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { getUserFromToken } from '../../AuthProvider/getUserFromToken';
import { useGetUser } from '../../AuthProvider/getUser';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const user = getUserFromToken();
  const { data, isLoading, isError, refetch } = useGetUser();

  useEffect(() => {
    const fetchMyPaymentsHistory = async () => {
      try {
        const response = await fetch(`https://servies-pro-server.onrender.com/payment-history/${user.userId}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchMyPaymentsHistory();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const generateInvoice = (payment) => {
    if (!payment || !data) {
      toast.error('Cannot generate invoice. Missing payment or user data.');
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
    pdf.text(`Trx ID  : ${payment.transactionId?.substring(0, 15) || ''}`, margin + 5, margin + 60);
    pdf.text(`Date    : ${new Date(payment.date).toLocaleDateString()}`, margin + 5, margin + 66);
    
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
    pdf.text(payment.serviceName || 'Service', margin + 5, tableTop + 20);
    
    // Add amount and status
    pdf.text(`$${payment.amount}`, margin + col1Width + col2Width / 2, tableTop + 10 + rowHeight / 2, { align: 'center' });
    pdf.text(payment.status || 'Paid', margin + col1Width + col2Width + col3Width / 2, tableTop + 10 + rowHeight / 2, { align: 'center' });
    
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
    pdf.save(`ServicePro_Invoice_${payment.transactionId ? payment.transactionId.substring(0, 8) : 'receipt'}.pdf`);
  };

  const filteredPayments = activeFilter === 'all' 
    ? payments 
    : payments.filter(payment => payment.orderStatus.toLowerCase() === activeFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="mt-1 text-gray-500">Track all your payment transactions in one place</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeFilter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('completed')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeFilter === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setActiveFilter('pending')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeFilter === 'pending' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setActiveFilter('failed')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeFilter === 'failed' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading your payment history...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  <p className="text-red-700">Error: {error}</p>
                </div>
              </div>
            )}

            {!loading && filteredPayments.length === 0 && (
              <div className="text-center py-16 px-4">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No payment history found</h3>
                <p className="max-w-md mx-auto mt-2 text-gray-500">
                  {activeFilter !== 'all' 
                    ? `You don't have any ${activeFilter} payments yet.`
                    : "You haven't made any payments yet. Your payment history will appear here once you complete a transaction."}
                </p>
              </div>
            )}

            {!loading && filteredPayments.length > 0 && (
              <div className="mt-4 overflow-hidden shadow-sm rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{payment.serviceName}</div>
                                <div className="text-xs text-gray-500">ID: {payment.serviceId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">${payment.amount}</div>
                            <div className="text-xs text-gray-500">{payment.method}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700">{formatDate(payment.date)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                <span className="ml-1">Payment: {payment.status}</span>
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.orderStatus)}`}>
                                {getStatusIcon(payment.orderStatus)}
                                <span className="ml-1">Order: {payment.orderStatus}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                            {payment.transactionId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => generateInvoice(payment)}
                              className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border-blue-600 cursor-pointer `}
                            >
                              <Download className="h-4 w-4 mr-1.5" />
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default PaymentHistory;