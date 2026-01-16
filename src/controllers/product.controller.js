const service = require("../services/project.service");
exports.getProducts = async (req, res) => {
    const products = await service.getProducts();
    res.json(products);
}