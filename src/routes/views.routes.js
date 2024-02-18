import express from "express";

const router = express.Router();

const renderPage = (pageName) => (req, res) => {
    res.render(pageName, {});
};

router.get("/", renderPage("home"));
router.get("/realtimeproducts", renderPage("realTimeProducts"));

export default router;
