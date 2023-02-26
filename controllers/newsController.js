const asyncHandler = require("express-async-handler");
const ImageToBase64 = require("image-to-base64");
const News = require("../models/newsModel");

// @desc    Add News
// @route   POST /api/news/add-news
// @access  Public
const addNews = asyncHandler(async (req, res) => {
  try {
    const { title, content, author, category, addToSlider } = req.body;
    const base64Data = await ImageToBase64(req.files.newsImage.path);
    const news = await News.create({
      author,
      title,
      content,
      category,
      addToSlider,
      newsImage: `data:${req.files.newsImage.type};base64,${base64Data}`,
      addedAt: Date.now(),
    });
    if (news) {
      res.status(201).json({
        success: true,
        msg: "Successfully Added News",
        data: news,
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "Inavalid Data. Something Went Wrong Please Try Again Later !",
        error: "Record Not Added..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    All News with pagination & Limit
// @route   Get /api/news/get-all-news
// @access  Public
const getAllNews = asyncHandler(async (req, res) => {
  try {
    const pageLimit = req.query.pageLimit;
    const pageNo = req.query.pageNo;
    let query = {};

    if (pageNo < 0 || pageNo === 0) {
      return res.status(401).json({
        success: false,
        msg: "Invalid page number",
        error: "Invalid page number, should start with 1",
      });
    }

    query.skip = pageLimit * (pageNo - 1);
    query.limit = pageLimit;

    const totalNewsCount = await News.find();
    const news = await News.find({})
      .sort("-addedAt")
      .populate({ path: "category", select: [("_id", "category_name")] })
      .limit(Number(query.limit))
      .skip(Number(query.skip));

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Found Successfully",
        count: news.length,
        totalCount: totalNewsCount.length,
        data: news,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    News By Id
// @route   Get /api/news/get-news-byId
// @access  Public
const getNewsById = asyncHandler(async (req, res) => {
  try {
    const news = await News.findById(req.query.id)
      .sort("-addedAt")
      .populate({
        path: "category",
        select: [("_id", "category_name")],
      });

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Found Successfully",
        data: news,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    Slider News
// @route   Get /api/news/get-slider-news
// @access  Public
const getSliderNews = asyncHandler(async (req, res) => {
  try {
    const news = await News.find({ addToSlider: true }).populate({
      path: "category",
      select: [("_id", "category_name")],
    });

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Found Successfully",
        data: news,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    News By Category Id
// @route   Get /api/news/get-news-category
// @access  Public
const getNewsByCategory = asyncHandler(async (req, res) => {
  try {
    const news = await News.find({ category: req.query.id }).populate({
      path: "category",
      select: [("_id", "category_name")],
    });

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Found Successfully",
        data: news,
        count: news.length,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    Delete News
// @route   Delete /api/news/delete-news
// @access  Public
const deleteNews = asyncHandler(async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.query.id);

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Deleted Successfully",
        data: news,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

// @desc    Update News
// @route   Update /api/news/update-news
// @access  Public
const updateNews = asyncHandler(async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (news) {
      res.status(201).json({
        success: true,
        msg: "News Updated Successfully",
        data: news,
        error: "No Error",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "No News Found...",
        error: "Record Not Found..",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error occured.",
      error: err,
    });
  }
});

module.exports = {
  addNews,
  getAllNews,
  getNewsById,
  getSliderNews,
  getNewsByCategory,
  deleteNews,
  updateNews,
};
