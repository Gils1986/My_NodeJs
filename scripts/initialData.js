const usersInitialData = [
  {
    name: {
      first: "Gil",
      last: "Shterman",
    },
    phone: "0501234567",
    email: "gilS@gmail.com",
    password: "Qq123456",
    isBusiness: false,
    isAdmin: false,
    address: {
      state: "Unknown",
      country: "Israel",
      city: "Tel-Aviv",
      street: "Rothschild",
      houseNumber: "10",
    },
  },
  {
    name: {
      first: "roy",
      last: "Cohen",
    },
    phone: "0507654321",
    email: "royC@gmail.com",
    password: "Ww123456",
    isBusiness: false,
    isAdmin: true,
    address: {
      state: "Unknown",
      country: "Israel",
      city: "Petah-Tikva",
      street: "Rothschild",
      houseNumber: "13",
    },
  },
  {
    name: {
      first: "Danny",
      last: "Yasman",
    },
    phone: "0501212123",
    email: "DannyY@gmail.com",
    password: "Mm123456",
    isBusiness: true,
    isAdmin: false,
    address: {
      state: "Unknown",
      country: "Israel",
      city: "Herzliya",
      street: "Smadar",
      houseNumber: "5",
    },
  },
];

const cardsInitialData = [
  {
    title: "First Card",
    subtitle: "first-card",
    description: "BizCard Description",
    phone: "0509999999",
    email: "firstcard@gmail.com",
    web: "firstcard-website.com",
    address: {
      state: "unknown",
      country: "Israel",
      city: "Tel-Aviv",
      street: "Herzel",
      houseNumber: "16",
    },
  },
  {
    title: "Second Card",
    subtitle: "second-card",
    description: "BizCard Description",
    phone: "0508888888",
    email: "secondcard@gmail.com",
    web: "secondcard-website.com",
    address: {
      state: "unknown",
      country: "Israel",
      city: "Petah-Tikva",
      street: "Shtamper",
      houseNumber: "13",
    },
  },
  {
    title: "Third Card",
    subtitle: "third-card",
    description: "BizCard Description",
    phone: "0505555555",
    email: "thirdcard@gmail.com",
    web: "thirdcard-website.com",
    address: {
      state: "unknown",
      country: "Israel",
      city: "Holon",
      street: "Hrav-Kuk",
      houseNumber: "20",
    },
  },
];

module.exports = {
  usersInitialData,
  cardsInitialData,
};
