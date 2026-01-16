import React, { useMemo, useState } from "react";
import Papa from "papaparse";

export type ImportRow = {
  name: string;
  sku?: string;
  unit?: string;
  purchasePrice?: number;
  retailPrice?: number;
  wholesalePrice?: number;
  quantity?: number;
  supplier?: string;
  supplierPhone?: string;
};

const FIELD_SYNONYMS: Record<keyof ImportRow, string[]> = {
  name: [
    "tên",
    "ten",
    "họ tên",
    "ho ten",
    "customer",
    "name",
    "material",
    "material name",
    "product",
    "sản phẩm",
    "san pham",
    "vật tư",
    "vat tu",
  ],
  sku: [
    "sku",
    "mã",
    "ma",
    "mã hàng",
    "ma hang",
    "mã sp",
    "ma sp",
    "code",
    "item code",
    "product code",
  ],
  unit: ["đơn vị", "don vi", "unit", "uom"],
  purchasePrice: [
    "giá nhập",
    "gia nhap",
    "purchase price",
    "cost",
    "đơn giá nhập",
    "don gia nhap",
    "giá vốn",
    "gia von",
    "price",
  ],
  retailPrice: ["giá bán lẻ", "gia ban le", "retail price", "giá lẻ", "gia le"],
  wholesalePrice: [
    "giá bán sỉ",
    "gia ban si",
    "wholesale price",
    "giá sỉ",
    "gia si",
  ],
  quantity: ["số lượng", "so luong", "sl", "qty", "quantity", "s.lượng"],
  supplier: ["nhà cung cấp", "nha cung cap", "supplier", "ncc"],
  supplierPhone: [
    "số điện thoại",
    "so dien thoai",
    "điện thoại",
    "dien thoai",
    "số dt",
    "so dt",
    "sđt",
    "sdt",
    "đt",
    "dt",
    "tel",
    "telephone",
    "mobile",
    "phone",
    "supplier phone",
    "ncc phone",
  ],
};

function normalizeHeader(h: string) {
  return (h || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[_\-]/g, " ");
}

function parseNumber(v: any) {
  if (v === null || v === undefined) return undefined;
  // Normalize formats: 1.234.567,89 / 1,234,567.89 / 1234567 / 1 234 567
  const s = String(v)
    .replace(/\s/g, "")
    .replace(/[₫]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  const n = Number(s.replace(/[^\d.]/g, ""));
  return isNaN(n) ? undefined : n;
}

function autoDetectMapping(headers: string[]) {
  const map: Record<keyof ImportRow, string | undefined> = {
    name: undefined,
    sku: undefined,
    unit: undefined,
    purchasePrice: undefined,
    retailPrice: undefined,
    wholesalePrice: undefined,
    quantity: undefined,
    supplier: undefined,
    supplierPhone: undefined,
  };
  const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));

  (Object.keys(FIELD_SYNONYMS) as (keyof ImportRow)[]).forEach((field) => {
    const candidates = FIELD_SYNONYMS[field].map(normalizeHeader);
    const found = normalized.find((h) =>
      candidates.some((c) => h.norm.includes(c))
    );
    if (found) map[field] = found.raw;
  });

  // Fallbacks
  if (!map.name) map.name = headers[0];
  if (!map.quantity)
    map.quantity = headers.find((h) =>
      /(qty|sl|số lượng|so luong|quantity)/i.test(h)
    );
  if (!map.purchasePrice)
    map.purchasePrice = headers.find((h) =>
      /(price|giá|gia|cost|vốn|von)/i.test(h)
    );

  return map;
}

const MaterialImportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: ImportRow[]) => Promise<void>;
}> = ({ isOpen, onClose, onImport }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [mapping, setMapping] = useState<
    Record<keyof ImportRow, string | undefined>
  >({
    name: undefined,
    sku: undefined,
    unit: undefined,
    purchasePrice: undefined,
    retailPrice: undefined,
    wholesalePrice: undefined,
    quantity: undefined,
    supplier: undefined,
    supplierPhone: undefined,
  });
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);

  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  const handleFile = (file: File) => {
    setParsing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "utf-8",
      complete: (res: Papa.ParseResult<any>) => {
        const data = (res.data as any[]).filter((r) =>
          Object.values(r).some(Boolean)
        );
        const hdrs =
          (res.meta.fields as string[]) || Object.keys(data[0] || {});
        setHeaders(hdrs);
        setRows(data);
        setMapping(autoDetectMapping(hdrs));
        setParsing(false);
      },
      error: () => setParsing(false),
    });
  };

  const normalizedRows: ImportRow[] = useMemo(
    () =>
      rows.map((r) => ({
        name:
          (mapping.name ? r[mapping.name] : r[headers[0]])
            ?.toString()
            ?.trim() || "",
        sku: mapping.sku ? r[mapping.sku] : undefined,
        unit: (mapping.unit ? r[mapping.unit] : undefined) || "cái",
        purchasePrice: parseNumber(
          mapping.purchasePrice ? r[mapping.purchasePrice] : undefined
        ),
        retailPrice: parseNumber(
          mapping.retailPrice ? r[mapping.retailPrice] : undefined
        ),
        wholesalePrice: parseNumber(
          mapping.wholesalePrice ? r[mapping.wholesalePrice] : undefined
        ),
        quantity:
          parseNumber(mapping.quantity ? r[mapping.quantity] : undefined) ?? 1,
        supplier: mapping.supplier
          ? r[mapping.supplier]?.toString()?.trim() || undefined
          : undefined,
        supplierPhone: mapping.supplierPhone
          ? r[mapping.supplierPhone]?.toString()?.trim() || undefined
          : undefined,
      })),
    [rows, headers, mapping]
  );

  const canImport = normalizedRows.some(
    (r) => r.name && (r.purchasePrice ?? 0) > 0
  );

  const startImport = async () => {
    if (!canImport) return;
    setImporting(true);
    try {
      await onImport(
        normalizedRows.filter((r) => r.name && (r.purchasePrice ?? 0) > 0)
      );
      onClose();
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
        <div className="px-5 py-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              Upload danh sách vật tư
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tự nhận biết: Tên, SKU, Đơn vị, Giá nhập, SL, NCC, SĐT…
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              id="material-csv-file"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
              disabled={parsing || importing}
            />
            <label
              htmlFor="material-csv-file"
              className="inline-flex px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
            >
              {parsing ? "Đang đọc file..." : "Chọn file CSV"}
            </label>
            <div className="text-xs text-gray-500 mt-2">
              Hỗ trợ tiêu đề: "Tên", "Name", "SL", "Số lượng", "Giá nhập",
              "Cost", "Supplier", "NCC", "Phone", "SDT"…
            </div>
          </div>

          {headers.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(mapping) as (keyof ImportRow)[]).map((field) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cột cho {field}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={mapping[field] || ""}
                      onChange={(e) =>
                        setMapping((m) => ({
                          ...m,
                          [field]: e.target.value || undefined,
                        }))
                      }
                    >
                      <option value="">(Bỏ qua)</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="text-sm font-semibold mt-2">
                Xem trước (5 dòng)
              </div>
              <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left">Tên</th>
                      <th className="px-2 py-1 text-left">SKU</th>
                      <th className="px-2 py-1 text-left">Đơn vị</th>
                      <th className="px-2 py-1 text-right">Giá nhập</th>
                      <th className="px-2 py-1 text-right">SL</th>
                      <th className="px-2 py-1 text-left">NCC</th>
                      <th className="px-2 py-1 text-left">SĐT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((_, i) => {
                      const n = normalizedRows[i];
                      return (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1">{n?.name}</td>
                          <td className="px-2 py-1">{n?.sku || "-"}</td>
                          <td className="px-2 py-1">{n?.unit || "cái"}</td>
                          <td className="px-2 py-1 text-right">
                            {n?.purchasePrice ?? "-"}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {n?.quantity ?? 1}
                          </td>
                          <td className="px-2 py-1">{n?.supplier || "-"}</td>
                          <td className="px-2 py-1">
                            {n?.supplierPhone || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t dark:border-gray-700 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Hủy
          </button>
          <button
            onClick={startImport}
            disabled={!canImport || importing}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {importing ? "Đang import..." : "Import vật tư"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialImportModal;
