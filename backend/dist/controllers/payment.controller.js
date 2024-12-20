"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getPayments = void 0;
const client_1 = require("@prisma/client");
console.log('Initializing payment controller...');
const prisma = new client_1.PrismaClient();
const getPayments = async (req, res) => {
    console.log('\n=== Get Payments ===');
    try {
        console.log('Getting payments...');
        const { residentId } = req.query;
        console.log('Query params:', { residentId });
        const payments = await prisma.payment.findMany({
            where: {
                residentId: residentId ? Number(residentId) : undefined
            },
            include: {
                resident: {
                    include: {
                        room: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        console.log(`Found ${payments.length} payments`);
        res.json(payments);
    }
    catch (error) {
        console.error('Error getting payments:', error);
        res.status(500).json({ message: 'Failed to get payments' });
    }
    console.log('=================\n');
};
exports.getPayments = getPayments;
const createPayment = async (req, res) => {
    try {
        const { residentId, amount, type, status, notes } = req.body;
        const payment = await prisma.payment.create({
            data: {
                residentId: Number(residentId),
                amount: Number(amount),
                type,
                status,
                notes,
                date: new Date(),
            },
            include: {
                resident: true
            }
        });
        res.status(201).json(payment);
    }
    catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Failed to create payment' });
    }
};
exports.createPayment = createPayment;
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, status, notes, date } = req.body;
        const payment = await prisma.payment.update({
            where: { id: Number(id) },
            data: {
                amount: Number(amount),
                type,
                status,
                notes,
                date: date ? new Date(date) : undefined,
            },
            include: {
                resident: true
            }
        });
        res.json(payment);
    }
    catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Gagal mengupdate pembayaran' });
    }
};
exports.updatePayment = updatePayment;
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.payment.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Pembayaran berhasil dihapus' });
    }
    catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Gagal menghapus pembayaran' });
    }
};
exports.deletePayment = deletePayment;
//# sourceMappingURL=payment.controller.js.map