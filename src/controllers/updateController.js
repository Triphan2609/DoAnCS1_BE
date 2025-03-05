import pool from "../config/database.js";

const updateAccount = async (req, res) => {
    const id_taiKhoan = req.params.id_taiKhoan;
    const { tenTaiKhoan } = req.body;
    try {
        const sql = `UPDATE taiKhoan
            set tenTaiKhoan = ? WHERE id_taiKhoan = ?
            `;
        await pool.query(sql, [tenTaiKhoan, id_taiKhoan]);
        res.status(200).json({
            EC: 0,
            EM: "Cập nhật tài khoản thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Cập nhật tài khoản thất bại",
            Err: err,
        });
    }
};

const updateBook = async (req, res) => {
    const id_sach = req.params.id_sach;
    const {
        tenSach,
        tacGia,
        nhaXB,
        nguoiDich,
        namXB,
        ngonNgu,
        trongLuongGr,
        kichThuocBaoBi,
        soTrang,
        giaSach,
        soLuongTonKho,
        hinhThucSach,
        maTheLoaiSach,
    } = req.body;
    const thumbnail = req.file;
    try {
        if (thumbnail) {
            const sql = `UPDATE Sach 
            set tenSach = ?, tacGia = ?, nhaXB = ?, nguoiDich = ?, namXB = ?, ngonNgu = ?, trongLuongGr = ?, 
            kichThuocBaoBi = ?, soTrang = ?, giaSach = ?, soLuongTonKho = ?, hinhThucSach = ?, maTheLoaiSach = ?, thumbnail = ?
            WHERE id_sach = ?`;
            await pool.query(sql, [
                tenSach,
                tacGia,
                nhaXB,
                nguoiDich,
                +namXB,
                ngonNgu,
                +trongLuongGr,
                kichThuocBaoBi,
                +soTrang,
                +giaSach,
                +soLuongTonKho,
                hinhThucSach,
                maTheLoaiSach,
                thumbnail.filename,
                id_sach,
            ]);
            res.status(200).json({
                EC: 0,
                EM: "Cập nhật sách thành công",
            });
        } else {
            const sql = `UPDATE Sach
            set tenSach = ?, tacGia = ?, nhaXB = ?, nguoiDich = ?, namXB = ?, ngonNgu = ?, trongLuongGr = ?,
            kichThuocBaoBi = ?, soTrang = ?, giaSach = ?, soLuongTonKho = ?,  hinhThucSach = ?, maTheLoaiSach = ? WHERE id_sach = ?
            `;
            await pool.query(sql, [
                tenSach,
                tacGia,
                nhaXB,
                nguoiDich,
                +namXB,
                ngonNgu,
                +trongLuongGr,
                kichThuocBaoBi,
                +soTrang,
                +giaSach,
                +soLuongTonKho,
                hinhThucSach,
                maTheLoaiSach,
                +id_sach,
            ]);
            res.status(200).json({
                EC: 0,
                EM: "Cập nhật sách thành công",
            });
        }
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Cập nhật sách thất bại",
            Err: err,
        });
    }
};

const updateCategory = async (req, res) => {
    const maTheLoaiSach = req.params.maTheLoaiSach;
    const { tenTheLoaiSach } = req.body;
    try {
        const sql = `UPDATE Theloaisach
            set tenTheLoaiSach = ? WHERE maTheLoaiSach = ?
            `;
        await pool.query(sql, [tenTheLoaiSach, maTheLoaiSach]);
        res.status(200).json({
            EC: 0,
            EM: "Cập nhật thể loại sách thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Cập nhật thể loại sách thất bại",
            Err: err,
        });
    }
};

const updateCartQuantity = async (req, res) => {
    const id_gioHang = req.params.id_gioHang;
    const { soLuongSach } = req.body;

    try {
        const sql = `UPDATE GioHang
            set soLuongSach = ? WHERE id_gioHang = ?
            `;
        await pool.query(sql, [soLuongSach, id_gioHang]);
        res.status(200).json({
            EC: 0,
            EM: "Cập nhật số lượng sách thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Cập nhật số lượng sách thất bại",
            Err: err,
        });
    }
};

const resolveOrder = async (req, res) => {
    const id_donHang = req.params.id_donHang;
    try {
        const sql = `UPDATE DonHang
            set trangThaiDonHang = 'Đã duyệt' WHERE id_donHang = ?
            `;
        await pool.query(sql, [id_donHang]);
        res.status(200).json({
            EC: 0,
            EM: "Xác nhận đơn hàng thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Xác nhận đơn hàng thất bại",
            Err: err,
        });
    }
};

const rejectOrder = async (req, res) => {
    const id_donHang = req.params.id_donHang;
    try {
        const sql = `UPDATE DonHang
            set trangThaiDonHang = 'Đã hủy' WHERE id_donHang = ?
            `;
        await pool.query(sql, [id_donHang]);
        res.status(200).json({
            EC: 0,
            EM: "Đã từ chối đơn hàng",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Từ chối thất bại",
            Err: err,
        });
    }
};

const addInformations = async (req, res) => {
    const id_taiKhoan = req.params.id_taiKhoan;
    const { tenNhanHang, diaChiNhanHang, SDTNhanHang } = req.body;
    try {
        const sql = `UPDATE TaiKhoan
            set tenNhanHang = ?, diaChiNhanHang = ?, SDTNhanHang = ? WHERE id_taiKhoan = ?
            `;
        await pool.query(sql, [
            tenNhanHang,
            diaChiNhanHang,
            SDTNhanHang,
            id_taiKhoan,
        ]);
        res.status(200).json({
            DATA: {
                tenNhanHang,
                diaChiNhanHang,
                SDTNhanHang,
            },
            EC: 0,
            EM: "Thêm thông tin giao hàng thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Thêm thông tin giao hàng thất bại",
            Err: err,
        });
        console.log(err);
    }
};

export {
    updateAccount,
    updateBook,
    updateCategory,
    updateCartQuantity,
    resolveOrder,
    rejectOrder,
    addInformations,
};
