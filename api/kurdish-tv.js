const axios = require("axios");

const PLAYLIST =
  "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/iq.m3u";

module.exports = async (req, res) => {
  try {
    const response = await axios.get(PLAYLIST);

    const text = response.data;
    const lines = text.split("\n");

    let channels = [];
    let current = {};

    for (let line of lines) {
      line = line.trim();

      if (line.startsWith("#EXTINF")) {

        const name = line.split(",").pop();

        current = {
          name,
          category: "General",
          language: "Kurdish",
          logo: ""
        };

      } else if (
        line.startsWith("http")
      ) {

        current.stream = line;

        const lower = current.name.toLowerCase();

        if (
          lower.includes("rudaw") ||
          lower.includes("kurd") ||
          lower.includes("nrt") ||
          lower.includes("k24") ||
          lower.includes("kurdsat") ||
          lower.includes("waar") ||
          lower.includes("speda")
        ) {
          channels.push(current);
        }
      }
    }

    res.status(200).json({
      status: true,
      developer: "Baby Kurd",
      total: channels.length,
      channels
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};
