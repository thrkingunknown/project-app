const app = require('./api/index');

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`${process.env.PLATFORM_NAME || 'FAXRN'} Server is running on http://localhost:${port}`);
  });
}

module.exports = app;