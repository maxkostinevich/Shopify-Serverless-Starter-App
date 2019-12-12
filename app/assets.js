"use strict"
const path = require("path")
const StaticFileHandler = require("serverless-aws-static-file-handler")
const clientFilesPath = path.join(__dirname, '../public/')
const fileHandler = new StaticFileHandler(clientFilesPath)

module.exports.favicon = async (event, context) => {
    event.path = "favicon.png"
    return fileHandler.get(event, context)
  }

  module.exports.css = async (event, context) => {
    event.path = "css/app.css"
    return fileHandler.get(event, context)
  }

  module.exports.js = async (event, context) => {
    event.path = "js/app.js"
    return fileHandler.get(event, context)
  }