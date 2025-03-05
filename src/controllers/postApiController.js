import "dotenv/config";
import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const postCreateBook = async (req, res) => {
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
    const thumbnail = req.file.filename;
    try {
        const sql = `insert into Sach 
        (tenSach, tacGia, nhaXB, nguoiDich, namXB, ngonNgu, trongLuongGr, 
        kichThuocBaoBi, soTrang, giaSach, soLuongTonKho, thumbnail, hinhThucSach, maTheLoaiSach)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
            thumbnail,
            hinhThucSach,
            maTheLoaiSach,
        ]);
        res.status(200).json({
            EC: 0,
            EM: "Tạo sách thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Tạo sách thất bại",
            Err: err,
        });
    }
};
const postCreateAccount = async (req, res) => {
    const { email, tenTaiKhoan, matKhau, vaiTro } = req.body;
    const hashedPassword = bcrypt.hashSync(matKhau, 8);
    try {
        const sql =
            "INSERT INTO taikhoan (email,tenTaiKhoan,matKhau,vaiTro) VALUES (?, ?, ?, ?)";
        await pool.query(sql, [email, tenTaiKhoan, hashedPassword, vaiTro]);
        res.status(200).json({
            EC: 0,
            EM: "Tạo tài khoản thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Tạo tài khoản thất bại",
            Err: err,
        });
    }
};

const postCreateCategory = async (req, res) => {
    const { maTheLoaiSach, tenTheLoaiSach } = req.body;
    try {
        const sql =
            "insert into TheLoaiSach (maTheLoaiSach, tenTheLoaiSach) VALUES (?, ?)";
        await pool.query(sql, [maTheLoaiSach, tenTheLoaiSach]);
        res.status(200).json({
            EC: 0,
            EM: "Tạo thể loại sách thành công",
        });
    } catch (err) {
        // let ErrMessage = "";
        // if (err.errno === 1048) ErrMessage = "cannot be null";
        res.status(500).json({
            EC: 1,
            EM: "Tạo thể loại sách thất bại",
            Err: err,
        });
    }
};

// Hàm xử lý việc tải lên nhiều ảnh
const uploadImages = async (req, res) => {
    const { id_sach } = req.body;
    const imagePaths = req.files.map((file) => file.filename);

    const sql = `INSERT INTO HinhAnhSach (id_sach, hinhAnh) VALUES ?`;
    const values = imagePaths.map((path) => [id_sach, path]);

    try {
        await pool.query(sql, [values]);
        res.status(200).json({
            EC: 0,
            EM: "Thêm hình ảnh sách thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Thêm hình ảnh sách thất bại",
            Err: err,
        });
    }
};

const uploadDesc = async (req, res) => {
    const { id_sach, noiDung } = req.body;
    const sql = `INSERT INTO MoTaSach (id_sach, noiDung) VALUES (?, ?)`;

    try {
        await pool.query(sql, [id_sach, noiDung]);
        res.status(200).json({
            EC: 0,
            EM: "Thêm nội dung sách thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Thêm nội dung sách thất bại",
            Err: err,
        });
    }
};

const postCreateCart = async (req, res) => {
    const { id_sach, id_taiKhoan, soLuongSach } = req.body;
    const checkSql = `SELECT * FROM GioHang WHERE id_sach = ? AND id_taiKhoan = ?`;
    const updateSql = `UPDATE GioHang SET soLuongSach = soLuongSach + ? WHERE id_sach = ? AND id_taiKhoan = ?`;
    const insertSql = `INSERT INTO GioHang (id_sach, id_taiKhoan, soLuongSach) VALUES (?, ?, ?)`;

    try {
        const [rows] = await pool.query(checkSql, [id_sach, id_taiKhoan]);

        if (rows.length > 0) {
            // Sách đã tồn tại trong giỏ hàng, cập nhật số lượng
            await pool.query(updateSql, [soLuongSach, id_sach, id_taiKhoan]);
            res.status(200).json({
                EC: 0,
                EM: "Cập nhật số lượng sách trong giỏ hàng thành công",
            });
        } else {
            // Sách chưa tồn tại trong giỏ hàng, thêm sách vào giỏ hàng
            await pool.query(insertSql, [id_sach, id_taiKhoan, soLuongSach]);
            res.status(200).json({
                EC: 0,
                EM: "Thêm sách vào giỏ hàng thành công",
            });
        }
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Thêm vào giỏ hàng sách thất bại",
            Err: err,
        });
    }
};

const postCreateOrder = async (req, res) => {
    const {
        id_taiKhoan,
        hoTenKH,
        diaChiKH,
        SDT,
        soLuongSanPham,
        tongTien,
        sach,
    } = req.body;

    const sql = `INSERT INTO DonHang (id_taiKhoan, hoTenKH, diaChiKH, SDT, soLuongSanPham, tongTien) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        await pool.query(sql, [
            id_taiKhoan,
            hoTenKH,
            diaChiKH,
            SDT,
            soLuongSanPham,
            tongTien,
        ]);
        res.status(200).json({
            EC: 0,
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            Err: err,
        });
    }
};

const postCreateOrderDetail = async (req, res) => {
    const { id_donHang, dataBooksCart } = req.body;

    // Lặp qua mảng dataBooksCart để lấy các giá trị cần thiết
    const values = dataBooksCart.map((item) => [
        id_donHang,
        item.id_sach,
        item.soLuongSach,
    ]);

    const sql = `INSERT INTO Chitietdonhang (id_donHang, id_sach, soLuongSach) VALUES ?`;

    try {
        await pool.query(sql, [values]);
        res.status(200).json({
            EC: 0,
            EM: "Thêm chi tiết đơn hàng thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Thêm chi tiết đơn hàng thất bại",
            Err: err,
        });
    }
};

// Authentication
const register = async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const checkEmailSql = "SELECT * FROM taikhoan WHERE email = ?";
        const [existingUsers] = await pool.query(checkEmailSql, [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({
                EC: 1,
                EM: "Tài khoản đã tồn tại",
            });
        }

        const sql =
            "INSERT INTO taikhoan (email, tenTaiKhoan, matKhau, vaiTro) VALUES (?, ?, ?, 'USER')";
        await pool.query(sql, [email, username, hashedPassword]);

        res.status(200).json({
            EC: 0,
            EM: "Đăng ký thành công",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Đăng ký thất bại",
            Err: err.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM taikhoan WHERE email = ?";
        const [rows] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                EC: 1,
                EM: "Tài khoản không hợp lệ",
            });
        }

        const user = rows[0];
        const passwordIsValid = bcrypt.compareSync(password, user.matKhau); // Chú ý thứ tự các tham số trong compareSync
        if (!passwordIsValid) {
            return res.status(401).json({
                EC: 1,
                EM: "Sai mật khẩu",
            });
        }

        const token = jwt.sign(
            { id: user.id_taiKhoan, role: user.vaiTro },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            DATA: {
                id_taiKhoan: user.id_taiKhoan,
                email: user.email,
                tenTaiKhoan: user.tenTaiKhoan,
                tenNhanHang: user.tenNhanHang,
                diaChiNhanHang: user.diaChiNhanHang,
                SDTNhanHang: user.SDTNhanHang,
            },
            token: token,
            EC: 0,
            EM: "Đăng nhập thành công!",
        });
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Đăng nhập thất bại",
            Err: err.message,
        });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const token = req.headers["access-token"];

    try {
        if (!token) {
            return res.status(401).json({
                EC: 1,
                EM: "Access Denied",
            });
        }
        console.log(process.env.SECRET_KEY);
        // Verify token và lấy thông tin user từ token
        jwt.verify(
            token.split(" ")[1],
            process.env.SECRET_KEY,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        EC: 1,
                        EM: "Không tìm thấy token",
                    });
                }

                const sql = "SELECT * FROM taikhoan WHERE id_taiKhoan = ?";
                const [rows] = await pool.query(sql, [decoded.id]);

                if (rows.length === 0) {
                    return res.status(404).json({
                        EC: 1,
                        EM: "Không tìm thấy người dùng",
                    });
                }
                const user = rows[0];

                // Kiểm tra mật khẩu cũ
                const passwordIsValid = bcrypt.compareSync(
                    oldPassword,
                    user.matKhau
                );
                if (!passwordIsValid) {
                    return res.status(401).json({
                        EC: 1,
                        EM: "Sai mật khẩu",
                    });
                }

                // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới có khớp nhau không
                if (newPassword !== confirmNewPassword) {
                    return res.status(400).json({
                        EC: 1,
                        EM: "Xác nhận mật khẩu không trùng khớp",
                    });
                }

                // Mã hóa mật khẩu mới
                const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

                // Update mật khẩu trong database
                const updateSql =
                    "UPDATE taikhoan SET matKhau = ? WHERE id_taiKhoan = ?";
                await pool.query(updateSql, [
                    hashedNewPassword,
                    user.id_taiKhoan,
                ]);

                res.status(200).json({
                    EC: 0,
                    EM: "Thay đổi mật khẩu thành công!",
                });
            }
        );
    } catch (err) {
        res.status(500).json({
            EC: 1,
            EM: "Failed to change password",
            Err: err.message,
        });
    }
};

export {
    postCreateOrderDetail,
    postCreateCategory,
    postCreateAccount,
    postCreateOrder,
    postCreateCart,
    postCreateBook,
    changePassword,
    uploadImages,
    uploadDesc,
    register,
    login,
};
