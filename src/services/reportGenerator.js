import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 

export const generateAdminReport = (stats, properties) => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // 1. Add Brand Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("REALTY OS - SYSTEM REPORT", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 14, 30);
    doc.text(`Status: Official Administrative Document`, 14, 35);

    // 2. Add Stats Summary Box
    doc.setDrawColor(230);
    doc.setFillColor(249, 250, 251);
    doc.rect(14, 45, 182, 30, "FD");

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Key Performance Indicators", 20, 52);

    doc.setFontSize(10);
    doc.text(`Total Users: ${stats.users}`, 20, 62);
    doc.text(`Total Bookings: ${stats.bookings}`, 80, 62);
    doc.text(`Total Properties: ${properties.length}`, 140, 62);

    // 3. Properties Table
    doc.setFontSize(14);
    doc.text("Inventory List", 14, 85);

    const tableRows = properties.map(p => [
        p.title,
        p.location,
        `INR ${p.price}`,
        p.type,
        p.featured ? "Yes" : "No"
    ]);

    autoTable(doc, {
        startY: 90,
        head: [['Property Name', 'Location', 'Price', 'Type', 'Featured']],
        body: properties.map(p => [
            p.title,
            p.location,
            `INR ${p.price}`,
            p.type,
            p.featured ? "Yes" : "No"
        ]),
        headStyles: { fillColor: [79, 70, 229], fontSize: 10 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // 4. Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount} - Confidential Property Data`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`RealtyOS_Report_${Date.now()}.pdf`);
};