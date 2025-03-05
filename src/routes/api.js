import express from "express";
import multer from "multer";
import path from "path";
import appRoot from "app-root-path";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();
import {
    getAllBooks,
    getAllBooksWithPaginations,
    getBookSortByDate,
    getAllCategoryBook,
    getAllBooksOfCategory,
    getAllBooksOfCategoryWithPag,
    getBookForm,
    getImagesBook,
    getAllUsersWithPaginations,
    getDescriptionBook,
    getAllCategoriesWithPaginations,
    searchBooks,
    getCart,
    getOrdersWithPaginations,
    getOrdersNewest,
    getBooksInOrder,
    getOrderWithAccount,
    getDataToTal,
} from "../controllers/getApiController.js";

import {
    postCreateCategory,
    postCreateAccount,
    postCreateBook,
    uploadImages,
    uploadDesc,
    register,
    login,
    postCreateCart,
    postCreateOrder,
    postCreateOrderDetail,
    changePassword,
} from "../controllers/postApiController.js";

import {
    deleteAccount,
    deleteBook,
    deleteCart,
    deleteCategory,
    deleteOrder,
} from "../controllers/deleteController.js";
import {
    addInformations,
    rejectOrder,
    resolveOrder,
    updateAccount,
    updateBook,
    updateCartQuantity,
    updateCategory,
} from "../controllers/updateController.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(appRoot.path, "src/public/images");
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

export const verifyAdmin = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) return res.status(401).send("Không có token");

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403);
        if (user.role !== "ADMIN")
            return res.status(403).json({
                EC: 1,
                EM: "Đăng nhập admin thất bại",
                isADMIN: false,
            });
        req.user = user;
        next();
    });
};

const initAPIRoute = (app) => {
    // getAPI
    router.get("/getAllBooks", getAllBooks);
    router.get("/getAllBooksWithPaginations", getAllBooksWithPaginations);
    router.get("/getBookSortByDate", getBookSortByDate);
    router.get("/getCategoryBook", getAllCategoryBook);
    router.get("/getAllBooksOfCategory/:maTheLoaiSach", getAllBooksOfCategory);
    router.get(
        "/getAllBooksOfCategoryWithPag/:maTheLoaiSach",
        getAllBooksOfCategoryWithPag
    );
    router.get("/getBookForm", getBookForm);
    router.get("/getImagesBook/:id_sach", getImagesBook);
    router.get("/getDescriptionBook/:id_sach", getDescriptionBook);
    router.get("/getAllUsersWithPaginations", getAllUsersWithPaginations);
    router.get(
        "/getAllCategoriesWithPaginations",
        getAllCategoriesWithPaginations
    );
    router.get("/searchBooks", searchBooks);
    router.get("/getCart/:id_taiKhoan", getCart);
    router.get("/getOrdersWithPaginations/", getOrdersWithPaginations);
    router.get("/getOrdersNewest/:id_taiKhoan", getOrdersNewest);
    router.get("/getBooksInOrder/:id_donHang", getBooksInOrder);
    router.get("/getOrderWithAccount/:id_taiKhoan", getOrderWithAccount);
    router.get("/getDataToTal", getDataToTal);

    // postAPI
    router.post("/postCreateAccount", postCreateAccount);
    router.post("/postCreateCategory", postCreateCategory);
    router.post("/postCreateCart", postCreateCart);
    router.post("/postCreateBook", upload.single("thumbnail"), postCreateBook);
    router.post("/postImagesBook", upload.array("images", 10), uploadImages);
    router.post("/postDescBook", uploadDesc);
    router.post("/postCreateOrder", postCreateOrder);
    router.post("/postCreateOrderDetail", postCreateOrderDetail);

    // updateAPI
    router.put("/updateBook/:id_sach", upload.single("thumbnail"), updateBook);
    router.put("/updateAccount/:id_taiKhoan", updateAccount);
    router.put("/updateCategory/:maTheLoaiSach", updateCategory);
    router.put("/updateCartQuantity/:id_gioHang", updateCartQuantity);
    router.put("/resolveOrder/:id_donHang", resolveOrder);
    router.put("/rejectOrder/:id_donHang", rejectOrder);
    router.put("/addInformations/:id_taiKhoan", addInformations);

    //deleteAPI
    router.delete("/deleteAccount/:id_taiKhoan", deleteAccount);
    router.delete("/deleteBook/:id_sach", deleteBook);
    router.delete("/deleteCategory/:maTheLoaiSach", deleteCategory);
    router.delete("/deleteCart/:id_gioHang", deleteCart);
    router.delete("/deleteOrder/:id_donHang", deleteOrder);

    // Authentication
    router.post("/register", register);
    router.post("/login", login);

    router.get("/admin", verifyAdmin, (req, res) => {
        res.json({
            EC: 0,
            EM: "Đăng nhập admin thành công",
            isADMIN: true,
        });
    });

    router.post("/changePassword", changePassword);

    return app.use("/api/v1", router);
};

export default initAPIRoute;
