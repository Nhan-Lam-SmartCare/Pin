import React, { useEffect, useState } from "react";
import type { PinSale } from "../../types";
import type { BusinessSettings } from "../../types/business";
import QRCode from "qrcode";

interface SalesInvoiceTemplateProps {
  sale: PinSale;
  onClose?: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + " đ";

const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export default function SalesInvoiceTemplate({ sale, onClose }: SalesInvoiceTemplateProps) {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Load business settings
    const saved = localStorage.getItem("businessSettings");
    if (saved) {
      setBusinessSettings(JSON.parse(saved));
    }

    // Generate QR code for bank transfer
    if (saved) {
      const settings: BusinessSettings = JSON.parse(saved);
      if (settings.bankAccount) {
        const qrData = `Bank: ${settings.bankName}\nSTK: ${settings.bankAccount}\nCTK: ${settings.bankBranch}\nAmount: ${sale.total}`;
        QRCode.toDataURL(qrData, { width: 120, margin: 1 })
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error(err));
      }
    }
  }, [sale.total]);

  const handlePrint = () => {
    window.print();
  };

  if (!businessSettings) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">
          Vui lòng cấu hình thông tin doanh nghiệp trong phần Cài đặt
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Print buttons */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          In hóa đơn
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Đóng
          </button>
        )}
      </div>

      {/* Invoice content */}
      <div className="max-w-2xl mx-auto p-8 invoice-content">
        {/* Header with logo and business info */}
        <div className="text-center mb-6">
          {businessSettings.logoUrl && (
            <div className="flex justify-center mb-2">
              <img src={businessSettings.logoUrl} alt="Logo" className="h-16 object-contain" />
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-900">{businessSettings.businessName}</h1>
          {businessSettings.slogan && (
            <p className="text-sm text-slate-600 italic">{businessSettings.slogan}</p>
          )}
          <div className="text-xs text-slate-700 mt-2 space-y-0.5">
            <p>
              📍 {businessSettings.address}
              {businessSettings.ward && `, ${businessSettings.ward}`}
              {businessSettings.district && `, ${businessSettings.district}`}
            </p>
            <p>
              📞 {businessSettings.phone}
              {businessSettings.email && ` • ✉️ ${businessSettings.email}`}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-1">HÓA ĐƠN BÁN HÀNG</h2>
        <div className="text-center text-sm text-slate-700 mb-4">
          <span className="font-semibold">Mã:</span> {sale.code || sale.id}
        </div>

        {/* Customer info */}
        <div className="border-t border-b border-slate-300 py-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">KH:</span> {sale.customer?.name || "Khách lẻ"}
            </div>
            <div>
              <span className="font-semibold">SĐT:</span> {sale.customer?.phone || ""}
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="text-left py-2 px-1">Sản phẩm</th>
                <th className="text-center py-2 px-1 w-16">SL</th>
                <th className="text-right py-2 px-1 w-28">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="py-2 px-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatCurrency(item.sellingPrice)} x {item.quantity}
                    </div>
                  </td>
                  <td className="text-center py-2 px-1">{item.quantity}</td>
                  <td className="text-right py-2 px-1 font-medium">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="border-t-2 border-slate-800 pt-3 mb-4">
          <div className="flex justify-between items-center text-lg font-bold mb-2">
            <span>TỔNG CỘNG:</span>
            <span className="text-2xl text-red-600">{formatCurrency(sale.total)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Giảm giá:</span>
              <span>-{formatCurrency(sale.discount)}</span>
            </div>
          )}
        </div>

        {/* Payment info with QR */}
        <div className="flex gap-4 mb-4">
          {/* Bank transfer info */}
          {businessSettings.bankAccount && (
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-900 mb-1">
                Chuyển khoản: {businessSettings.bankName}
              </div>
              <div className="text-xs text-blue-800">
                <div>
                  STK:{" "}
                  <span className="font-mono font-semibold">{businessSettings.bankAccount}</span>
                </div>
                <div>CTK: {businessSettings.bankBranch}</div>
              </div>
            </div>
          )}

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center justify-center px-3">
              <img
                src={qrCodeUrl}
                alt="QR Payment"
                className="w-24 h-24 border border-slate-200 rounded"
              />
              <p className="text-[9px] text-slate-600 mt-1 text-center">Quét mã thanh toán</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        {businessSettings.invoiceFooterNote && (
          <div className="text-center text-xs italic text-slate-600 mb-4 p-2 bg-amber-50 border border-amber-200 rounded">
            {businessSettings.invoiceFooterNote}
          </div>
        )}

        {/* Signature and date */}
        <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-dashed border-slate-300">
          <div className="mb-2">Cảm ơn quý khách!</div>
          <div>Hẹn gặp lại!</div>
          <div className="mt-3 font-medium">{formatDateTime(sale.date)}</div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-content, .invoice-content * {
            visibility: visible;
          }
          .invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
