function errorHandler (res, headers)  {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
        message: "無此id或欄位輸入錯誤",
        status: "fail"
    }))
    res.end()
}

module.exports = errorHandler;