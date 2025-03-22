import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { AuthorEntity } from '../src/modules/author/author.entity';
import { BookEntity } from '../src/modules/book/book.entity';
import { ReviewEntity } from '../src/modules/review/review.entity';

async function clearDatabase(
  authorRepository: Repository<AuthorEntity>,
  bookRepository: Repository<BookEntity>,
  reviewRepository: Repository<ReviewEntity>
) {
  // Vider les tables dans l'ordre pour respecter les contraintes de clés étrangères
  await reviewRepository.clear();
  await bookRepository.clear();
  await authorRepository.clear();
}

async function createDeletedAuthor(authorRepository: Repository<AuthorEntity>): Promise<AuthorEntity> {
  const existingDeletedAuthor = await authorRepository.findOne({ where: { name: 'Auteur Supprimé' } });
  if (existingDeletedAuthor) {
    return existingDeletedAuthor;
  }

  const deletedAuthor = authorRepository.create({
    id: 'deleted-author',
    name: 'Auteur Supprimé',
    bio: 'Cet auteur a été supprimé.',
  });
  return await authorRepository.save(deletedAuthor);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(): number {
  return parseFloat((Math.random() * (29.99 - 5.99) + 5.99).toFixed(2));
}

function getRandomComment(): string {
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F'];
  const comments = [
    "Une lecture exceptionnelle, captivante du début à la fin.",
    "Très bon livre avec des personnages bien développés.",
    "Bon livre, mais quelques longueurs par moments.",
    "Lecture agréable, mais manque d'originalité.",
    "Histoire moyenne, certains passages sont prévisibles.",
    "Quelques bonnes idées, mais mal exécutées.",
    "Peut mieux faire, l'intrigue manque de profondeur.",
    "Décevant, je m'attendais à mieux.",
    "Difficile à terminer, peu engageant.",
    "Je ne le recommanderais pas, manque d'intérêt.",
    "Très mauvais, une perte de temps.",
    "À éviter absolument, aucun intérêt."
  ];
  const index = getRandomInt(0, grades.length - 1);
  return `${grades[index]} | ${comments[index]}`;
}

async function populateAuthorsAndBooks(
  authorRepository: Repository<AuthorEntity>,
  bookRepository: Repository<BookEntity>,
  deletedAuthor: AuthorEntity
): Promise<BookEntity[]> {
  const authorsData = [
    { name: 'Isabel Allende', bio: 'Auteure chilienne connue pour son réalisme magique.', photo: 'https://www.biografieonline.it/img/bio/Isabel_Allende_1.jpg' },
    { name: 'Haruki Murakami', bio: 'Auteur japonais mêlant surréalisme et thèmes contemporains.', photo: 'https://www.britannica.com/biography/Haruki-Murakami' },
    { name: 'Zadie Smith', bio: 'Romancière britannique explorant les questions d\'identité et de multiculturalisme.', photo: 'https://www.britannica.com/biography/Zadie-Smith' },
    { name: 'Chimamanda Ngozi Adichie', bio: 'Auteure nigériane abordant les thèmes du féminisme et de la diaspora africaine.', photo: 'https://www.leprogres.fr/culture-loisirs/2021/10/31/chimamanda-ngozi-adichie-je-ressens-une-nouvelle-urgence-a-ecrire' },
    { name: 'Khaled Hosseini', bio: 'Auteur afghan-américain connu pour ses récits émouvants sur l\'Afghanistan.', photo: 'https://www.npr.org/2013/05/19/184191561/siblings-separation-haunts-in-kite-runner-authors-latest' },
  ];

  const authors = [];
  for (const data of authorsData) {
    const author = authorRepository.create(data);
    authors.push(await authorRepository.save(author));
  }

  const booksData = [
    { title: 'La Maison aux esprits', publicationYear: 1982, author: authors[0], price: getRandomPrice() },
    { title: 'De l\'amour et des ombres', publicationYear: 1984, author: authors[0], price: getRandomPrice() },
    { title: 'La Ballade de l\'impossible', publicationYear: 1987, author: authors[1], price: getRandomPrice() },
    { title: 'Kafka sur le rivage', publicationYear: 2002, author: authors[1], price: getRandomPrice() },
    { title: 'Sourires de loup', publicationYear: 2000, author: authors[2], price: getRandomPrice() },
    { title: 'Swing Time', publicationYear: 6.2, author: authors[2], price: getRandomPrice() },
    { title: 'Americanah', publicationYear: 2013, author: authors[3], price: getRandomPrice() },
    { title: 'L\'Hibiscus pourpre', publicationYear: 2003, author: authors[3], price: getRandomPrice() },
    { title: 'Les Cerfs-volants de Kaboul', publicationYear: 2003, author: authors[4], price: getRandomPrice() },
    { title: 'Mille soleils splendides', publicationYear: 2007, author: authors[4], price: getRandomPrice() },
    { title: 'Murmures du passé', publicationYear: 1998, author: deletedAuthor, price: getRandomPrice() },
    { title: 'Échos dans la poussière', publicationYear: 2005, author: deletedAuthor, price: getRandomPrice() },
  ];

  const books = [];
  for (const data of booksData) {
    const book = bookRepository.create(data);
    books.push(await bookRepository.save(book));
  }

  return books;
}

async function populateReviews(
  books: BookEntity[],
  reviewRepository: Repository<ReviewEntity>
) {
  for (const book of books) {
    const reviewCount = getRandomInt(2, 6);
    for (let i = 0; i < reviewCount; i++) {
      const review = reviewRepository.create({
        rating: getRandomInt(1, 5),
        comment: getRandomComment(),
        book,
      });
      await reviewRepository.save(review);
    }
  }
}

async function bootstrap
::contentReference[oaicite:0]{index=0}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authorRepository = app.get('AuthorEntityRepository') as Repository<AuthorEntity>;
  const bookRepository = app.get('BookEntityRepository') as Repository<BookEntity>;
  const reviewRepository = app.get('ReviewEntityRepository') as Repository<ReviewEntity>;

  // Nettoyage de la base de données
  await clearDatabase(authorRepository, bookRepository, reviewRepository);

  // Création de l'auteur supprimé
  const deletedAuthor = await createDeletedAuthor(authorRepository);

  // Remplissage des auteurs et livres
  const books = await populateAuthorsAndBooks(authorRepository, bookRepository, deletedAuthor);

  // Ajout des critiques
  await populateReviews(books, reviewRepository);

  console.log('✔️ Base de données initialisée avec succès !');
  await app.close();
}

bootstrap().catch((error) => {
  console.error( 'Erreur lors de l\'initialisation de la base de données :', error);
  process.exit(1);
});

