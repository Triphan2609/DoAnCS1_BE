import pool from "../config/database.js";

const getAllBooks = async (req, res) => {
    try {
        const [rows, fields] = await pool.query(
            `SELECT * FROM Sach, TheLoaiSach 
            WHERE Sach.maTheLoaiSach = TheLoaiSach.maTheLoaiSach`
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getAllBooksWithPaginations = async (req, res) => {
    const { tenSach, page, limit } = req.query;
    const offset = (page - 1) * limit;

    if (tenSach) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM Sach, TheLoaiSach 
            WHERE Sach.maTheLoaiSach = TheLoaiSach.maTheLoaiSach and tenSach LIKE ? ORDER BY id_sach DESC LIMIT ? OFFSET ?`,
                [`%${tenSach}%`, +limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM Sach Where tenSach LIKE ?",
                [`%${tenSach}%`]
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    } else {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM Sach, TheLoaiSach 
            WHERE Sach.maTheLoaiSach = TheLoaiSach.maTheLoaiSach ORDER BY id_sach DESC LIMIT ? OFFSET ?`,
                [+limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM Sach"
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            r;
        }
    }
};

const getBookSortByDate = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute(
            "SELECT id_sach, tenSach, thumbnail, ngayThemMoi FROM Sach ORDER BY ngayThemMoi DESC LIMIT 8"
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getAllCategoryBook = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute(
            "SELECT maTheLoaiSach, tenTheLoaiSach FROM TheLoaiSach ORDER BY tenTheLoaiSach"
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getAllBooksOfCategory = async (req, res) => {
    const { maTheLoaiSach } = req.params;
    try {
        const [rows, fields] = await pool.query(
            `SELECT 
            maTheLoaiSach, 
            id_sach,
            tenSach,
            thumbnail
        FROM (
            SELECT 
                maTheLoaiSach, 
                id_sach,
                tenSach,
                thumbnail,
                ROW_NUMBER() OVER (PARTITION BY maTheLoaiSach ORDER BY id_sach) AS rn
            FROM Sach
            WHERE maTheLoaiSach = ?
        ) AS RankedBooks
        WHERE rn <= 8;`,
            [maTheLoaiSach]
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getAllBooksOfCategoryWithPag = async (req, res) => {
    const { maTheLoaiSach } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    try {
        const [[{ totalData }]] = await pool.query(
            "SELECT COUNT(*) AS totalData FROM Sach WHERE maTheLoaiSach = ?",
            [maTheLoaiSach]
        );

        const [rows, fields] = await pool.query(
            `SELECT 
            maTheLoaiSach, 
            id_sach,
            tenSach,
            giaSach,
            thumbnail
        FROM (
            SELECT 
                maTheLoaiSach, 
                id_sach,
                tenSach,
                giaSach,
                thumbnail,
                ROW_NUMBER() OVER (PARTITION BY maTheLoaiSach ORDER BY id_sach) AS rn
            FROM Sach
            WHERE maTheLoaiSach = ?
        ) AS RankedBooks
        WHERE rn <= 8 LIMIT ? OFFSET ?;`,
            [maTheLoaiSach, +limit, +offset]
        );
        return res.status(200).json({
            data: rows,
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit),
        });
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getBookForm = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute("SELECT * FROM HinhThucSach");
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(404).send("Error: " + error.message);
    }
};

const getImagesBook = async (req, res) => {
    const { id_sach } = req.params;
    try {
        const [rows, fields] = await pool.query(
            "SELECT hinhAnh FROM HinhAnhSach WHERE id_sach = ?",
            [id_sach]
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getAllUsersWithPaginations = async (req, res) => {
    const { tenTaiKhoan, page, limit } = req.query;
    const offset = (page - 1) * limit;

    if (tenTaiKhoan) {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM Taikhoan WHERE tenTaiKhoan LIKE ? LIMIT ? OFFSET ?",
                [`%${tenTaiKhoan}%`, +limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM Taikhoan WHERE tenTaiKhoan LIKE ?",
                [`%${tenTaiKhoan}%`]
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    } else {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM Taikhoan ORDER BY ngayThemMoi desc LIMIT ? OFFSET ?",
                [+limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM Taikhoan"
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    }
};

const getAllCategoriesWithPaginations = async (req, res) => {
    const { tenTheLoaiSach, page, limit } = req.query;
    const offset = (page - 1) * limit;
    if (tenTheLoaiSach) {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM TheLoaiSach Where tenTheLoaiSach Like ? LIMIT ? OFFSET ?",
                [`%${tenTheLoaiSach}%`, +limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM TheLoaiSach Where tenTheLoaiSach LIKE ? ",
                [`%${tenTheLoaiSach}%`]
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    } else {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM TheLoaiSach LIMIT ? OFFSET ?",
                [+limit, +offset]
            );
            const [[{ totalData }]] = await pool.query(
                "SELECT COUNT(*) AS totalData FROM TheLoaiSach"
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    }
};

const getDescriptionBook = async (req, res) => {
    const { id_sach } = req.params;
    try {
        const [rows, fields] = await pool.query(
            "SELECT * FROM MoTaSach WHERE id_sach = ?",
            [id_sach]
        );
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

// Tìm kiếm sách
const searchBooks = async (req, res) => {
    const { query, page, limit } = req.query;
    const offset = (page - 1) * limit;
    if (!query) {
        return res.status(400).json({
            EC: 1,
            EM: "Không thể tìm kiếm",
        });
    }
    try {
        const sql = `SELECT * FROM Sach 
                     WHERE tenSach LIKE ? LIMIT ? OFFSET ?`;

        const [rows] = await pool.query(sql, [`%${query}%`, +limit, +offset]);

        const [[{ totalData }]] = await pool.query(
            `SELECT COUNT(*) as totalData FROM Sach WHERE tenSach LIKE ?`,
            [`%${query}%`]
        );

        return res.status(200).json({
            data: rows,
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            EC: 1,
            EM: "Không tìm thấy sách!",
        });
    }
};

const getCart = async (req, res) => {
    const { id_taiKhoan } = req.params;
    const sql = `SELECT * from Sach, GioHang, taikhoan 
    WHERE sach.id_sach = gioHang.id_sach 
    AND gioHang.id_taiKhoan = taikhoan.id_taiKhoan 
    AND taikhoan.id_taiKhoan = ?;`;

    try {
        const [rows] = await pool.query(sql, [id_taiKhoan]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getOrders = async (req, res) => {
    const { id_taiKhoan } = req.params;
    const sql = `SELECT id_donHang, email, tenTaiKhoan, hoTenKH, diaChiKH, SDT, soLuongSanPham, tongTien, DATE_FORMAT(ngayDatHang,'%d/%m/%Y %H:%i:%s') as ngayDatHang FROM DonHang, TaiKhoan 
                WHERE DonHang.id_taiKhoan = ?;`;

    try {
        const [rows] = await pool.query(sql, [id_taiKhoan]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getOrdersNewest = async (req, res) => {
    const { id_taiKhoan } = req.params;
    const sql = `SELECT id_donHang FROM DonHang WHERE id_taiKhoan = ? ORDER BY ngayDatHang DESC LIMIT 1;;`;

    try {
        const [rows] = await pool.query(sql, [id_taiKhoan]);
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getOrdersWithPaginations = async (req, res) => {
    const { trangThaiDonHang, page, limit } = req.query;
    const offset = (page - 1) * limit;

    if (trangThaiDonHang) {
        try {
            const sql = `SELECT id_donHang, email, tenTaiKhoan, hoTenKH, diaChiKH, SDT, soLuongSanPham, tongTien, trangThaiDonHang, DATE_FORMAT(ngayDatHang,'%d/%m/%Y %H:%i:%s') as ngayDatHang FROM DonHang, TaiKhoan 
                WHERE DonHang.id_taiKhoan = TaiKhoan.id_taiKhoan AND trangThaiDonHang LIKE ? order by ngayDatHang desc LIMIT ? OFFSET ? `;

            const [rows] = await pool.query(sql, [
                `%${trangThaiDonHang}%`,
                +limit,
                +offset,
            ]);

            const [[{ totalData }]] = await pool.query(
                `SELECT COUNT(*) as totalData FROM DonHang Where trangThaiDonHang LIKE ?`,
                [`%${trangThaiDonHang}%`]
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    } else {
        try {
            const sql = `SELECT id_donHang, email, tenTaiKhoan, hoTenKH, diaChiKH, SDT, soLuongSanPham, tongTien, trangThaiDonHang, DATE_FORMAT(ngayDatHang,'%d/%m/%Y %H:%i:%s') as ngayDatHang FROM DonHang, TaiKhoan 
                WHERE DonHang.id_taiKhoan = TaiKhoan.id_taiKhoan order by ngayDatHang desc LIMIT ? OFFSET ? `;

            const [rows] = await pool.query(sql, [+limit, +offset]);

            const [[{ totalData }]] = await pool.query(
                `SELECT COUNT(*) as totalData FROM DonHang`
            );

            return res.status(200).json({
                data: rows,
                page,
                limit,
                totalData,
                totalPages: Math.ceil(totalData / limit),
            });
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
    }
};

const getBooksInOrder = async (req, res) => {
    const { id_donHang } = req.params;
    const sql = `SELECT donhang.id_donHang, sach.id_sach, tenSach, tacGia, nguoiDich, nhaXB, chitietdonhang.soLuongSach, giaSach, thumbnail 
    FROM donhang, chitietdonhang, sach 
    WHERE donhang.id_donHang = chitietdonhang.id_donHang    
    AND sach.id_sach = chitietdonhang.id_sach 
    AND donhang.id_donHang = ?;`;

    try {
        const [rows] = await pool.query(sql, [id_donHang]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getOrderWithAccount = async (req, res) => {
    const { id_taiKhoan } = req.params;
    const sql = `SELECT   donhang.id_donHang, hoTenKH, SDT, diaChiKH, DATE_FORMAT(ngayDatHang,'%d/%m/%Y %H:%i:%s')as ngayDatHang, tongTien FROM donhang
    WHERE donhang.id_taiKhoan = ?
    Order by donhang.ngayDatHang desc;`;

    try {
        const [rows] = await pool.query(sql, [id_taiKhoan]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

const getDataToTal = async (req, res) => {
    const sql = `SELECT 
    (SELECT COUNT(*) FROM Sach) AS tongSoSach,
    (SELECT COUNT(*) FROM TaiKhoan) AS tongSoTaiKhoan,
    (SELECT COUNT(*) FROM TheLoaiSach) AS tongSoTheLoaiSach,
    (SELECT COUNT(*) FROM DonHang) AS tongDonHang;`;
    try {
        const [rows] = await pool.query(sql);
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
};

export {
    getCart,
    getOrders,
    searchBooks,
    getAllBooks,
    getBookForm,
    getDataToTal,
    getImagesBook,
    getOrdersNewest,
    getBooksInOrder,
    getBookSortByDate,
    getAllCategoryBook,
    getDescriptionBook,
    getOrderWithAccount,
    getAllBooksOfCategory,
    getOrdersWithPaginations,
    getAllBooksWithPaginations,
    getAllUsersWithPaginations,
    getAllBooksOfCategoryWithPag,
    getAllCategoriesWithPaginations,
};
