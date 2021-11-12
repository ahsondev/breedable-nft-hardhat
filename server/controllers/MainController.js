
async function index(req, res) {
  res.json({ a: 1 })
}

async function mint(req, res, next) {
}

module.exports = {
  index
}
