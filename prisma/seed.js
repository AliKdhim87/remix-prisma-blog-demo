// @ts-check

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  const john = await prisma.user.create({
    data: {
      username: 'john',
      // Hash for password - twixrox
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  });
  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: john.id, ...post };
      prisma.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  return [
    {
      title: 'React Routs',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius accusantium eligendi facere. Eveniet accusantium mollitia asperiores laudantium voluptatibus quia quasi omnis error in enim hic esse, sit facere officiis? Rerum?',
    },
    {
      title: 'Remix vs Nextjs',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius accusantium eligendi facere. Eveniet accusantium mollitia asperiores laudantium voluptatibus quia quasi omnis error in enim hic esse, sit facere officiis? Rerum?',
    },
    {
      title: 'Setup React app with webpack',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius accusantium eligendi facere. Eveniet accusantium mollitia asperiores laudantium voluptatibus quia quasi omnis error in enim hic esse, sit facere officiis? Rerum?',
    },
  ];
}
