const express = require('express');
const connection = require('./db-config.js');

function intToIPv4(ipInt) {
	return ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
}

function IPv4ToInt(ip) {
	return ip.split('.').reduce(function (ipInt, octet) { return (ipInt << 8) + parseInt(octet, 10) }, 0) >>> 0;
}

const app = express();
app.use(express.json());

connection.connect((err) => {
	if (err) throw err;
	console.log('Connected to MySQL Server!');
});

// get messages from server
app.post("/forum/api/fetch-msgs", (req, res) => {
	console.log("Fetching messages from database...");
	var query = `SELECT * FROM msg_table ORDER BY post_time DESC`;

	connection.query(query, (err, results, fields) => {
		if (err) {
			console.log(err);
			connection.end();
			return res.status(500).json({ error: "Error fetching data" });
		}

		const data = JSON.parse(JSON.stringify(results)); // Parse the entire results array
		res.json(data);
	});
});


// post message to server
app.post("/forum/api/post-msg", (req, res) => {
	console.log("Posting message to server");
	console.log(`REQ: ${req.body}`);

	const { title, msg, userIP } = req.body;
	const userIPint = IPv4ToInt(userIP);
	const userIPbackTest = intToIPv4(userIPint);
	console.log(`user from: ${userIPbackTest} posted a message`)
	const query = `INSERT INTO msg_table (title, msg, user_ip, post_time) VALUES (?, ?, ?, NOW())`;

	connection.query(query, [title, msg, userIPint], (err, results, field) => {
		if (err) {
			console.log(err);
			connection.end();
			return res.status(500).json({ error: "Failed to store message to database." });
		}
	});
	return res.status(200).json({ message: "Message stored successfully." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

