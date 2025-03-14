import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Order, OrderItem } from '../models/Order';
import { Cart } from '../models/Cart';

// Hàm chuyển đổi tiếng Việt có dấu sang không dấu
const removeVietnameseAccents = (str: string): string => {
  if (!str) return '';
  
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  
  return str;
};

// Hàm tạo hóa đơn PDF từ đơn hàng
export const generateOrderPDF = (order: Order): string => {
  const doc = new jsPDF();
  
  // Tính finalAmount nếu không có
  if (order.finalAmount === undefined) {
    order.finalAmount = order.totalAmount;
    if (order.discount) order.finalAmount -= order.discount;
    if (order.tax) order.finalAmount += order.tax;
  }
  
  // Thêm tiêu đề
  doc.setFontSize(20);
  doc.text('HOA DON', 105, 15, { align: 'center' });
  
  // Thêm thông tin cửa hàng
  doc.setFontSize(12);
  doc.text('COFFEE SHOP', 105, 25, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM', 105, 30, { align: 'center' });
  doc.text('Dien thoai: 0123 456 789', 105, 35, { align: 'center' });
  
  // Thêm đường kẻ ngang
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Thêm thông tin đơn hàng
  doc.setFontSize(10);
  doc.text(`Ma don hang: ${order.orderNumber}`, 20, 50);
  doc.text(`Ngay: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`, 20, 55);
  doc.text(`Gio: ${new Date(order.createdAt).toLocaleTimeString('vi-VN')}`, 20, 60);
  
  // Thêm thông tin khách hàng
  doc.text(`Khach hang: ${removeVietnameseAccents(order.customerName)}`, 120, 50);
  if (order.customerPhone) {
    doc.text(`Dien thoai: ${order.customerPhone}`, 120, 55);
  }
  
  // Thêm bảng danh sách món
  const tableColumn = ["STT", "Ten mon", "So luong", "Don gia", "Thanh tien"];
  const tableRows: any[] = [];
  
  order.items.forEach((item, index) => {
    const itemData = [
      index + 1,
      removeVietnameseAccents(item.foodName),
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.subtotal)
    ];
    tableRows.push(itemData);
  });
  
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Lấy vị trí Y sau khi vẽ bảng
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Thêm thông tin tổng tiền
  doc.text('Tam tinh:', 130, finalY);
  doc.text(formatCurrency(order.totalAmount), 190, finalY, { align: 'right' });
  
  if (order.discount) {
    doc.text('Giam gia:', 130, finalY + 5);
    doc.text(formatCurrency(order.discount), 190, finalY + 5, { align: 'right' });
  }
  
  if (order.tax) {
    doc.text('Thue:', 130, finalY + 10);
    doc.text(formatCurrency(order.tax), 190, finalY + 10, { align: 'right' });
  }
  
  // Thêm đường kẻ ngang
  doc.setLineWidth(0.2);
  doc.line(130, finalY + 15, 190, finalY + 15);
  
  // Thêm tổng cộng
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Tong cong:', 130, finalY + 20);
  doc.text(formatCurrency(order.finalAmount), 190, finalY + 20, { align: 'right' });
  
  // Thêm thông tin thanh toán
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Phuong thuc thanh toan: ${getPaymentMethodName(order.paymentMethod)}`, 20, finalY + 30);
  doc.text(`Trang thai thanh toan: ${getPaymentStatusName(order.paymentStatus)}`, 20, finalY + 35);
  
  // Thêm ghi chú nếu có
  if (order.note) {
    doc.text('Ghi chu:', 20, finalY + 45);
    doc.text(removeVietnameseAccents(order.note), 20, finalY + 50);
  }
  
  // Thêm lời cảm ơn
  doc.setFontSize(10);
  doc.text('Cam on quy khach da su dung dich vu!', 105, finalY + 60, { align: 'center' });
  
  // Tạo URL cho PDF
  const pdfUrl = doc.output('datauristring');
  
  return pdfUrl;
};

// Hàm tải xuống PDF từ đơn hàng
export const downloadOrderPDF = (order: Order): void => {
  const doc = new jsPDF();
  
  // Tính finalAmount nếu không có
  if (order.finalAmount === undefined) {
    order.finalAmount = order.totalAmount;
    if (order.discount) order.finalAmount -= order.discount;
    if (order.tax) order.finalAmount += order.tax;
  }
  
  // Thêm tiêu đề
  doc.setFontSize(20);
  doc.text('HOA DON', 105, 15, { align: 'center' });
  
  // Thêm thông tin cửa hàng
  doc.setFontSize(12);
  doc.text('COFFEE SHOP', 105, 25, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM', 105, 30, { align: 'center' });
  doc.text('Dien thoai: 0123 456 789', 105, 35, { align: 'center' });
  
  // Thêm đường kẻ ngang
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Thêm thông tin đơn hàng
  doc.setFontSize(10);
  doc.text(`Ma don hang: ${order.orderNumber}`, 20, 50);
  doc.text(`Ngay: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`, 20, 55);
  doc.text(`Gio: ${new Date(order.createdAt).toLocaleTimeString('vi-VN')}`, 20, 60);
  
  // Thêm thông tin khách hàng
  doc.text(`Khach hang: ${removeVietnameseAccents(order.customerName)}`, 120, 50);
  if (order.customerPhone) {
    doc.text(`Dien thoai: ${order.customerPhone}`, 120, 55);
  }
  
  // Thêm bảng danh sách món
  const tableColumn = ["STT", "Ten mon", "So luong", "Don gia", "Thanh tien"];
  const tableRows: any[] = [];
  
  order.items.forEach((item, index) => {
    const itemData = [
      index + 1,
      removeVietnameseAccents(item.foodName),
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.subtotal)
    ];
    tableRows.push(itemData);
  });
  
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Lấy vị trí Y sau khi vẽ bảng
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Thêm thông tin tổng tiền
  doc.text('Tam tinh:', 130, finalY);
  doc.text(formatCurrency(order.totalAmount), 190, finalY, { align: 'right' });
  
  if (order.discount) {
    doc.text('Giam gia:', 130, finalY + 5);
    doc.text(formatCurrency(order.discount), 190, finalY + 5, { align: 'right' });
  }
  
  if (order.tax) {
    doc.text('Thue:', 130, finalY + 10);
    doc.text(formatCurrency(order.tax), 190, finalY + 10, { align: 'right' });
  }
  
  // Thêm đường kẻ ngang
  doc.setLineWidth(0.2);
  doc.line(130, finalY + 15, 190, finalY + 15);
  
  // Thêm tổng cộng
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Tong cong:', 130, finalY + 20);
  doc.text(formatCurrency(order.finalAmount), 190, finalY + 20, { align: 'right' });
  
  // Thêm thông tin thanh toán
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Phuong thuc thanh toan: ${getPaymentMethodName(order.paymentMethod)}`, 20, finalY + 30);
  doc.text(`Trang thai thanh toan: ${getPaymentStatusName(order.paymentStatus)}`, 20, finalY + 35);
  
  // Thêm ghi chú nếu có
  if (order.note) {
    doc.text('Ghi chu:', 20, finalY + 45);
    doc.text(removeVietnameseAccents(order.note), 20, finalY + 50);
  }
  
  // Thêm lời cảm ơn
  doc.setFontSize(10);
  doc.text('Cam on quy khach da su dung dich vu!', 105, finalY + 60, { align: 'center' });
  
  // Tải xuống PDF với tên là mã đơn hàng
  doc.save(`order_${order.orderNumber}.pdf`);
};

// Hàm tạo hóa đơn PDF từ giỏ hàng
export const generateCartPDF = (cart: Cart, customerInfo: { 
  customerName: string; 
  customerPhone?: string; 
  paymentMethod: string;
  note?: string;
}): string => {
  // Tạo đơn hàng tạm thời từ giỏ hàng
  const tempOrder: Order = {
    id: 'temp-' + Date.now(),
    orderNumber: 'TEMP-' + Date.now().toString().slice(-6),
    customerName: customerInfo.customerName,
    customerPhone: customerInfo.customerPhone,
    items: cart.items.map(item => ({
      id: item.id,
      foodId: item.foodId,
      foodName: item.foodName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      note: item.note
    })),
    totalAmount: cart.totalAmount,
    discount: cart.discount,
    tax: cart.tax,
    finalAmount: cart.finalAmount,
    status: 'PENDING',
    paymentMethod: customerInfo.paymentMethod as any,
    paymentStatus: 'PENDING',
    note: customerInfo.note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return generateOrderPDF(tempOrder);
};

// Hàm tải xuống PDF từ giỏ hàng
export const downloadCartPDF = (cart: Cart, customerInfo: { 
  customerName: string; 
  customerPhone?: string; 
  paymentMethod: string;
  note?: string;
}): void => {
  // Tạo đơn hàng tạm thời từ giỏ hàng
  const tempOrder: Order = {
    id: 'temp-' + Date.now(),
    orderNumber: 'TEMP-' + Date.now().toString().slice(-6),
    customerName: customerInfo.customerName,
    customerPhone: customerInfo.customerPhone,
    items: cart.items.map(item => ({
      id: item.id,
      foodId: item.foodId,
      foodName: item.foodName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      note: item.note
    })),
    totalAmount: cart.totalAmount,
    discount: cart.discount,
    tax: cart.tax,
    finalAmount: cart.finalAmount,
    status: 'PENDING',
    paymentMethod: customerInfo.paymentMethod as any,
    paymentStatus: 'PENDING',
    note: customerInfo.note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  downloadOrderPDF(tempOrder);
};

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(amount)
    .replace('₫', 'd');
};

// Hàm lấy tên phương thức thanh toán
const getPaymentMethodName = (method: string): string => {
  switch (method) {
    case 'CASH': return 'Tien mat';
    case 'CARD': return 'The';
    case 'TRANSFER': return 'Chuyen khoan';
    case 'MOMO': return 'MoMo';
    case 'ZALOPAY': return 'ZaloPay';
    default: return method;
  }
};

// Hàm lấy tên trạng thái thanh toán
const getPaymentStatusName = (status: string): string => {
  switch (status) {
    case 'PENDING': return 'Cho thanh toan';
    case 'PAID': return 'Da thanh toan';
    case 'FAILED': return 'Thanh toan that bai';
    case 'REFUNDED': return 'Da hoan tien';
    default: return status;
  }
}; 