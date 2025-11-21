import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    price: string;
    quantity: number;
    hsn: string;
  }>;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  totals: {
    subtotal: number;
    gst: number;
    shipping: number;
    total: number;
  };
}

export default function InvoicePage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Generate dummy invoice data
    const generateInvoiceData = (): InvoiceData => {
      const currentOrderNumber = orderNumber || `DLF${Date.now().toString().slice(-6)}`;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${currentOrderNumber}`;
      const orderDate = new Date().toLocaleDateString('en-IN');

      // Mock items with HSN codes
      const items = [
        { name: 'Mixed Masala Blend', price: '₹249', quantity: 1, hsn: '09109990' },
        { name: 'Moringa Leaf Powder', price: '₹399', quantity: 2, hsn: '12119090' },
        { name: 'Golden Turmeric Powder', price: '₹199', quantity: 1, hsn: '09103000' }
      ];

      const subtotal = 1246;
      const gst = Math.round(subtotal * 0.12); // 12% GST
      const shipping = 0;
      const total = subtotal + gst + shipping;

      return {
        orderNumber: currentOrderNumber,
        invoiceNumber,
        orderDate,
        items,
        customerDetails: {
          name: 'Customer Name',
          email: 'customer@example.com',
          phone: '+91 9876543210',
          address: '123, Sample Street, Sample City, Sample State - 123456'
        },
        totals: {
          subtotal,
          gst,
          shipping,
          total
        }
      };
    };

    setInvoiceData(generateInvoiceData());
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, you would use a library like jsPDF or html2pdf
    alert('PDF download functionality would be implemented here using libraries like jsPDF');
  };

  if (!invoiceData) {
    return <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Hidden in print */}
        <div className="mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none">
          {/* Company Header */}
          <div className="border-b-2 border-amber-600 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-amber-700 mb-2">DL Foods</h2>
                <div className="text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>123, Food Street, Nutrition City, Health State - 560001</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>orders@dlfoods.com</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-2">INVOICE</div>
                <div className="text-gray-600">
                  <div>Invoice #: {invoiceData.invoiceNumber}</div>
                  <div>Order #: {invoiceData.orderNumber}</div>
                  <div className="flex items-center justify-end mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Date: {invoiceData.orderDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Details</h3>
              <div className="text-gray-600 space-y-1">
                <div><strong>GSTIN:</strong> 29ABCDE1234F1Z5</div>
                <div><strong>PAN:</strong> ABCDE1234F</div>
                <div><strong>State Code:</strong> 29 (Karnataka)</div>
                <div><strong>CIN:</strong> U74999KA2020PTC132123</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="text-gray-600 space-y-1">
                <div><strong>{invoiceData.customerDetails.name}</strong></div>
                <div>{invoiceData.customerDetails.email}</div>
                <div>{invoiceData.customerDetails.phone}</div>
                <div className="mt-2">{invoiceData.customerDetails.address}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left">Item Description</th>
                    <th className="border border-gray-300 px-4 py-3 text-center">HSN Code</th>
                    <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Rate</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => {
                    const rate = parseInt(item.price.replace('₹', ''));
                    const amount = rate * item.quantity;
                    return (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-3">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.hsn}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">₹{rate}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">₹{amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>₹{invoiceData.totals.subtotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>CGST (6%):</span>
                  <span>₹{Math.round(invoiceData.totals.gst / 2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>SGST (6%):</span>
                  <span>₹{Math.round(invoiceData.totals.gst / 2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping:</span>
                  <span>{invoiceData.totals.shipping === 0 ? 'Free' : `₹${invoiceData.totals.shipping}`}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>₹{invoiceData.totals.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p className="text-sm text-gray-600">
                  Payment Method: Cash on Delivery<br />
                  Payment Status: Pending
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Goods once sold will not be taken back</li>
                  <li>• All disputes subject to jurisdiction of Karnataka courts</li>
                  <li>• This is a computer generated invoice</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="mt-8 text-right">
            <div className="inline-block">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Digitally signed by:</div>
                <div className="font-semibold">DL Foods Pvt Ltd</div>
                <div className="text-sm text-gray-500">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                background: white !important;
              }
              .print\\:hidden { 
                display: none !important; 
              }
              .print\\:shadow-none { 
                box-shadow: none !important; 
              }
              .print\\:rounded-none { 
                border-radius: 0 !important; 
              }
              @page { 
                margin: 1cm; 
                size: A4; 
              }
            }
          `
        }} />
      </div>
    </div>
  );
}