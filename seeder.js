const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
// const Bootcamp = require("./models/Bootcamp");
// const Course = require("./models/Course");
// const User = require("./models/Users");
const Disease = require("./models/Disease");
const Test = require("./models/Test");
const RegularUser = require("./models/RegularUser");
const Community = require("./models/Community");
const ProfessionalUser = require("./models/ProfessionalUser");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Connect to DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const tags = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tags.json`, "utf-8")
);

const tests = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tests.json`, "utf-8")
);

const regularUsers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/regular-users.json`, "utf-8")
);

const communities = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/communities.json`, "utf-8")
);

const professionalUsers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/professional-users.json`, "utf-8")
);

const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posts.json`, "utf-8")
);

const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/comments.json`, "utf-8")
);

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
// );

// Import into DB
const importData = async () => {
  try {
    await Disease.create(tags);
    //await ProfessionalUser.create(professionalUsers);
    //await Test.create(tests);
    // RegularUser.create(regularUsers);
    //await Community.create(communities);
    await Post.create(posts);
    await Comment.create(comments);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Disease.deleteMany();
    await Test.deleteMany();
    await RegularUser.deleteMany();
    await Community.deleteMany();
    //await User.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
