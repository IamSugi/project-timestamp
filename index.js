// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date?", function (req, res) {
  function padZero(number) {
    // to add 0 in front of number between 0 - 9
    return number < 10 ? "0" + number : number;
  }
  function formatDate(parsedDate) {
    // to format date as the task ask "Thu, 01 Jan 1970 00:00:00 GMT,"
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${days[parsedDate.getUTCDay()]}, ${padZero(
      parsedDate.getUTCDate()
    )} ${
      months[parsedDate.getUTCMonth()]
    } ${parsedDate.getUTCFullYear()} ${padZero(
      parsedDate.getUTCHours()
    )}:${padZero(parsedDate.getUTCMinutes())}:${padZero(
      parsedDate.getUTCSeconds()
    )} GMT`;
    return formattedDate;
  }

  // Check if params exist
  if (req.params.date !== undefined) {
    // Define a regular expression pattern for date format
    const dateRegex = /^\d{4}\-\d{2}\-\d{2}$/;
    // Get date data from params
    const date = req.params.date;
    if (dateRegex.test(date)) {
      // if the format is [YYYY-MM-DD]
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const utcDate = formatDate(parsedDate);
        res.json({
          unix: parsedDate.getTime(),
          utc: utcDate,
        });
      }
    } else if (!isNaN(parseInt(date))) {
      // if the format is unix
      const unixTimestamp = parseInt(date);
      const parsedDate = new Date(unixTimestamp);
      if (!isNaN(parsedDate.getTime())) {
        const utcDate = formatDate(parsedDate);
        res.json({
          unix: unixTimestamp,
          utc: utcDate,
        });
      }
    } else {
      res.status(400).json({ error: "Invalid Date" });
    }
  } else {
    // If date param not exist return current time
    const currentTime = new Date();
    const utcDate = formatDate(currentTime);
    res.json({
      unix: currentTime.getTime(),
      utc: utcDate,
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
