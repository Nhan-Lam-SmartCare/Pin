import React, { useEffect, useState } from "react";
import type { PinRepairOrder } from "../../types";
import type { BusinessSettings } from "../../types/business";
import QRCode from "qrcode";

interface RepairInvoiceTemplateProps {
  repairOrder: PinRepairOrder;
  onClose?: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + " đ";

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${formatDate(d)}`;
};

export default function RepairInvoiceTemplate({
  repairOrder,
  onClose,
}: RepairInvoiceTemplateProps) {
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
        const qrData = `Bank: ${settings.bankName}\nSTK: ${settings.bankAccount}\nCTK: ${settings.bankBranch}`;
        QRCode.toDataURL(qrData, { width: 120, margin: 1 })
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error(err));
      }
    }
  }, []);

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

  const total = Number((repairOrder as any).total || 0);
  const deposit = Number((repairOrder as any).depositAmount || 0);
  const remaining = total - deposit;

  return (
    <div className="bg-white">
      {/* Print buttons */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          In phiếu
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
      <div className="max-w-3xl mx-auto p-8 invoice-content">
        {/* Header */}
        <div className="border-2 border-slate-800 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            {/* Logo and business info */}
            <div className="flex items-start gap-3">
              {businessSettings.logoUrl && (
                <img
                  src={businessSettings.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {businessSettings.businessName}
                </h1>
                {businessSettings.slogan && (
                  <p className="text-xs text-slate-600 italic">{businessSettings.slogan}</p>
                )}
              </div>
            </div>

            {/* QR Code for payment */}
            {qrCodeUrl && (
              <div className="text-center">
                <img src={qrCodeUrl} alt="QR Payment" className="w-20 h-20" />
                <p className="text-[8px] text-slate-600 mt-1">QR Thanh toán</p>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="text-xs space-y-0.5 text-slate-700">
            <p>
              <span className="inline-block w-4">📍</span> {businessSettings.address}
              {businessSettings.ward && `, ${businessSettings.ward}`}
              {businessSettings.district && `, ${businessSettings.district}`}
              {businessSettings.city && `, ${businessSettings.city}`}
            </p>
            <div className="flex gap-6">
              <p>
                <span className="inline-block w-4">📞</span> {businessSettings.phone}
              </p>
              {businessSettings.email && (
                <p>
                  <span className="inline-block w-4">✉️</span> {businessSettings.email}
                </p>
              )}
            </div>
            {businessSettings.taxCode && (
              <p>
                <span className="inline-block w-4">🏢</span> MST: {businessSettings.taxCode}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold text-slate-900 mb-2">
          PHIẾU DỊCH VỤ SỬA CHỮA
        </h2>
        <div className="text-center text-sm text-slate-700 mb-4">
          <span className="font-semibold">Mã số:</span> {repairOrder.id}
        </div>

        {/* Customer info */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div>
              <span className="font-semibold">Khách hàng:</span>{" "}
              {(repairOrder as any).customerName || ""}
            </div>
            <div>
              <span className="font-semibold">SĐT:</span> {(repairOrder as any).customerPhone || ""}
            </div>
            <div>
              <span className="font-semibold">Loại xe:</span>{" "}
              {(repairOrder as any).deviceModel || (repairOrder as any).deviceName || ""}
            </div>
            <div>
              <span className="font-semibold">Biển số:</span>{" "}
              {(repairOrder as any).licensePlate || ""}
            </div>
          </div>
        </div>

        {/* Issue description */}
        <div className="mb-4 text-sm">
          <div className="font-semibold mb-1">Mô tả sự cố:</div>
          <div className="border border-slate-300 p-2 rounded min-h-[40px] text-slate-700">
            {(repairOrder as any).issueDescription || "Không có mô tả"}
          </div>
        </div>

        {/* Service items table */}
        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Phụ tùng sử dụng:</div>
          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-1.5 text-left">Tên phụ tùng</th>
                <th className="border border-slate-400 px-2 py-1.5 text-center w-16">SL</th>
                <th className="border border-slate-400 px-2 py-1.5 text-right w-24">Đơn giá</th>
                <th className="border border-slate-400 px-2 py-1.5 text-right w-28">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {(repairOrder as any).partsUsed?.map((part: any, index: number) => (
                <tr key={index}>
                  <td className="border border-slate-400 px-2 py-1.5">
                    {part.partName || part.part_name || part.name || ""}
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-center">
                    {part.quantity || 1}
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-right">
                    {formatCurrency(part.price || 0)}
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-right font-medium">
                    {formatCurrency((part.price || 0) * (part.quantity || 1))}
                  </td>
                </tr>
              ))}

              {/* Labor cost */}
              {(repairOrder as any).laborCost && (repairOrder as any).laborCost > 0 && (
                <tr>
                  <td className="border border-slate-400 px-2 py-1.5">Công sửa chữa</td>
                  <td className="border border-slate-400 px-2 py-1.5 text-center">1</td>
                  <td className="border border-slate-400 px-2 py-1.5 text-right">
                    {formatCurrency((repairOrder as any).laborCost)}
                  </td>
                  <td className="border border-slate-400 px-2 py-1.5 text-right font-medium">
                    {formatCurrency((repairOrder as any).laborCost)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="border-t-2 border-slate-800 pt-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Tiền phụ tùng:</span>
            <span className="text-base font-medium">
              {formatCurrency(total - (repairOrder as any).laborCost || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Phí dịch vụ:</span>
            <span className="text-base font-medium">
              {formatCurrency((repairOrder as any).laborCost || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Giá công/Đặt hàng:</span>
            <span className="text-base">0 đ</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-slate-400 pt-2 mb-2">
            <span>TỔNG CỘNG:</span>
            <span className="text-red-600">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Đã thanh toán:</span>
            <span className="font-medium">{formatCurrency(deposit)}</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold text-red-600 mt-1">
            <span>Hình thức thanh toán:</span>
            <span>Tiền mặt</span>
          </div>
        </div>

        {/* Bank info */}
        {businessSettings.bankAccount && (
          <div className="bg-amber-50 border border-amber-300 p-3 mb-4 text-xs">
            <div className="font-semibold mb-1">Chuyển khoản:</div>
            <div>
              <span className="font-medium">{businessSettings.bankName}</span> - STK:{" "}
              {businessSettings.bankAccount}
            </div>
            <div>CTK: {businessSettings.bankBranch}</div>
          </div>
        )}

        {/* Footer note */}
        {businessSettings.invoiceFooterNote && (
          <div className="bg-yellow-50 border-2 border-yellow-400 p-3 text-center text-xs font-medium mb-4">
            {businessSettings.invoiceFooterNote}
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 text-center text-sm mt-6">
          <div>
            <div className="font-semibold mb-12">Khách hàng</div>
            <div className="text-xs italic text-slate-600">(Ký và ghi rõ họ tên)</div>
          </div>
          <div>
            <div className="font-semibold mb-12">Nhân viên</div>
            <div className="text-xs">
              {businessSettings.representativeName || (repairOrder as any).technician || ""}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-center text-xs text-slate-500 mt-6">
          {formatDateTime((repairOrder as any).createdDate || repairOrder.created_at || new Date())}
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
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
