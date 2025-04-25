// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Book = require('./models/bookModel');
const Review = require('./models/reviewModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error(err));

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    bio: 'Admin user for the platform'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    bio: 'Regular book lover'
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'password123',
    bio: 'Avid reader and reviewer'
  }
];

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description:
      'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    genre: ['Fiction', 'Classic', 'Literary Fiction'],
    publishedYear: 1925,
    publisher: 'Charles Scribner\'s Sons',
    isbn: '9780743273565',
    featured: true
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description:
      'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on the author\'s observations of her family, her neighbors and an event that occurred near her hometown in 1936, when she was 10 years old.',
    genre: ['Fiction', 'Classic', 'Coming-of-age'],
    publishedYear: 1960,
    publisher: 'J. B. Lippincott & Co.',
    isbn: '9780061120084',
    featured: true
  },
  {
    title: '1984',
    author: 'George Orwell',
    description:
      '1984 is a dystopian social science fiction novel by English novelist George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell\'s ninth and final book completed in his lifetime. Thematically, 1984 centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.',
    genre: ['Fiction', 'Dystopian', 'Science Fiction', 'Classic'],
    publishedYear: 1949,
    publisher: 'Secker & Warburg',
    isbn: '9780451524935',
    featured: true
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description:
      'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.',
    genre: ['Fiction', 'Classic', 'Romance'],
    publishedYear: 1813,
    publisher: 'T. Egerton, Whitehall',
    isbn: '9780141439518',
    featured: false
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description:
      'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.',
    genre: ['Fiction', 'Fantasy', 'Adventure'],
    publishedYear: 1937,
    publisher: 'George Allen & Unwin',
    isbn: '9780547928227',
    featured: false
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description:
      'Harry Potter and the Philosopher\'s Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling\'s debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.',
    genre: ['Fiction', 'Fantasy', 'Young Adult'],
    publishedYear: 1997,
    publisher: 'Bloomsbury',
    isbn: '9780747532699',
    featured: true
  }
];

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();
    
    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;
    
    // Add createdBy field to books
    const sampleBooks = books.map(book => {
      return { ...book, createdBy: adminUser };
    });
    
    // Create books
    const createdBooks = await Book.create(sampleBooks);
    
    // Create some sample reviews
    const reviews = [
      {
        review: 'This book is a masterpiece of American literature. Fitzgerald\'s prose is elegant and evocative, painting a vivid picture of the Jazz Age.',
        rating: 5,
        book: createdBooks[0]._id,
        user: createdUsers[1]._id,
        finalReview: 'This book is a masterpiece of American literature. Fitzgerald\'s prose is elegant and evocative, painting a vivid picture of the Jazz Age.'
      },
      {
        review: 'A timeless classic that everyone should read. The characters are complex and the story is as relevant today as it was when it was published.',
        rating: 5,
        book: createdBooks[1]._id,
        user: createdUsers[1]._id,
        finalReview: 'A timeless classic that everyone should read. The characters are complex and the story is as relevant today as it was when it was published.'
      },
      {
        review: 'Orwell\'s dystopian vision is chillingly prophetic. The concept of Big Brother has permeated our culture and vocabulary.',
        rating: 4,
        book: createdBooks[2]._id,
        user: createdUsers[2]._id,
        finalReview: 'Orwell\'s dystopian vision is chillingly prophetic. The concept of Big Brother has permeated our culture and vocabulary.'
      },
      {
        review: 'One of my favorite books of all time. The wit and social commentary are brilliant.',
        rating: 5,
        book: createdBooks[3]._id,
        user: createdUsers[2]._id,
        finalReview: 'One of my favorite books of all time. The wit and social commentary are brilliant.'
      }
    ];
    
    await Review.create(reviews);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Determine action from command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}