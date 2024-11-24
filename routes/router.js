import { Router } from "express";

const router = Router();

// Route to show employee master page
router.get("/employees", (req, res) => {
    res.render("employee-list"); // Render the employee list page (with the static sidebar)
});

// Similar routes for other pages
router.get("/assets", (req, res) => {
    res.render("asset-list");
});

router.get("/asset-categories", (req, res) => {
    res.render("asset-category-list");
});

router.get("/stock-view", (req, res) => {
    res.render("stock-view");
});

router.get("/issue-asset", (req, res) => {
    res.render("issue-asset");
});

router.get("/return-asset", (req, res) => {
    res.render("return-asset");
});

router.get("/scrap-asset", (req, res) => {
    res.render("scrap-asset");
});

router.get("/asset-history", (req, res) => {
    res.render("asset-history");
});

export default router;
