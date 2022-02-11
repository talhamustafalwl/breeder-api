const { Animal } = require("../models/Animal/Animal");
const { Product } = require("../models/Product");
const { User } = require("../models/User");

class SearchController {
  constructor() {}

  async globalSearch(req, res, next) {
    const { type } = req.query;
    let animal,
      business,
      individual,
      all,
      product = [];

    try {
      const regex = new RegExp(req.params.name);
      if (type == "animal") {
        animal = await Animal.find({
          "data.name": { $regex: req.params.name, $options: "i" },
        });
        if (!animal) {
          return res.json({
            status: 404,
            message: "Animal Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Animal Found",
          data: {
            animal,
          },
        });
      }

      if (type == "business") {
        business = await User.find({
          $and: [
            {
              //    name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { accountType: "Business" },
          ],
        });
        if (!business) {
          return res.json({
            status: 404,
            message: "Business Profile Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Business Profile Found",
          data: {
            business,
          },
        });
      }

      if (type == "individual") {
        individual = await User.find({
          $and: [
            {
              //    name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { packageType: "Individual" },
          ],
        });
        if (!individual) {
          return res.json({
            status: 404,
            message: "Individual Profile Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Individual Profile Found",
          data: {
            individual,
          },
        });
      }

      if (type == "product") {
        product = await Product.find({
          // "data.name": regex
          "data.name": { $regex: req.params.name, $options: "i" },
        });

        if (!product) {
          return res.json({
            status: 404,
            message: "Product Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Product Found",
          data: {
            product,
          },
        });
      }

      if (type == "all") {
        animal = await Animal.find({
          "data.name": { $regex: req.params.name, $options: "i" },
        });
        console.log("animal", animal);
        product = await Product.find({
          "data.name": { $regex: req.params.name, $options: "i" },
        });
        console.log("product", product);

        business = await User.find({
          $and: [
            {
              //   name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { accountType: "Business" },
          ],
        });
        console.log("business", business);
        individual = await User.find({
          $and: [
            {
              //   name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { packageType: "Individual" },
          ],
        });
        console.log("individual", individual);

        all = [].concat.apply([], [animal, product, business, individual]);
        console.log(all);
      }
      return res.status(200).json({
        status: 200,
        message: "Search Found",
        data: {
          all,
        },
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
}

module.exports = new SearchController();
