
// const bodyParser = require('body-parser');
// const express = require('express');
// const cors = require('cors');
// const redirect = require("./redirect.controller.js")

// const app = express();

// app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

// const corsOptions = {
//     origin: ['http://localhost:3000', 'https://www.dineo.in', 'https://dineo.in'], // Add all allowed origins here
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true // Allow credentials
// };
// app.use(cors(corsOptions));

// app.get("/", redirect)
// app.get("/greet", (req, res)=>(res.send("hello world")))

// const port = process.env.PORT || 5600
// app.listen((port), () => console.log(`server started on PORT ${port}`))

// module.exports = app;


const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express server!' });
});

app.get('/search-services', async (req, res) => {
  const searchQuery = req.query.search;
  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required. Use ?search=yourSearchTerm' });
  }
  const apiKey = process.env.ZENOTI_API_KEY;
  const centerId = process.env.ZENOTI_CENTER_ID;
  
  let currentPage = 1;
  const size = 100;

  try {
    while (true) {
      const response = await axios.get(`https://api.zenoti.com/v1/Centers/${centerId}/services`, {
        params: {
          page: currentPage,
          size: size
        },
        headers: {
          'Authorization': `apikey ${apiKey}`,
          'accept': 'application/json'
        }
      });

      console.log(response.data.services, "response")

      const services = response.data.services;
      const matchedServices = services.filter(service => 
        service.code && service.code.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedServices.length > 0) {
        return res.json(matchedServices);
      }

      if (!services.length || services.length < size) {
        break;
      }

      currentPage++;
    }

    res.json({ message: 'No services found with the given code' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
