import {
  Shirt,
  Image as ImageIcon,
  Coffee,
  GlassWater,
  Accessibility,
} from "lucide-react";
import gs_logo from "./gs_logo.jpg";
import happy_store from "./happy_store.webp";
import upload_area from "./upload_area.svg";
import hero_model_img from "./hero_model_img.png";
import hero_model_2 from "./hero_model_2.png";
import hero_product_img1 from "./hero_product_img1.png";
import hero_product_img2 from "./hero_product_img2.png";
import product_img1 from "./product_img1.png";
import product_img2 from "./product_img2.png";
import product_img3 from "./product_img3.png";
import product_img4 from "./product_img4.png";
import product_img5 from "./product_img5.png";
import product_img6 from "./product_img6.png";
import product_img7 from "./product_img7.png";
import product_img8 from "./product_img8.png";
import product_img9 from "./product_img9.png";
import product_img10 from "./product_img10.png";
import product_img11 from "./product_img11.png";
import product_img12 from "./product_img12.png";
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg";
import profile_pic2 from "./profile_pic2.jpg";
import profile_pic3 from "./profile_pic3.jpg";
import aiyna_logo from "./aiyna_logo.png";
import mens_Tshirt_1 from "./mens_Tshirt_1.png";
import mens_Hoody_1 from "./mens_Hoody_1.png";
import womens_crop_top_1 from "./womens_crop_top_1.png";
import mens_oversized_tshirt_1 from "./mens_oversized_tshirt_1.png";
import wall_poster_1 from "./wall_poster_1.png";
import mug_1 from "./mug_1.png";
import anime_section_img from "./anime_section.png";
import cars_section_img from "./cars_section.png";
import office_section_img from "./office_section.png";
import anime_tshirt from "./anime_tshirt.jpg";
import anime_tshirt_1 from "./anime_tshirt_1.jpg";
import car_poster from "./car_poster.jpg";
import office_poster from "./office_poster.jpg";
import generic_profile_image from "./generic_profile_image.png";
export const assets = {
  aiyna_logo,
  upload_area,
  hero_model_img,
  hero_model_2,
  hero_product_img1,
  hero_product_img2,
  gs_logo,
  product_img1,
  product_img2,
  product_img3,
  product_img4,
  product_img5,
  product_img6,
  product_img7,
  product_img8,
  product_img9,
  product_img10,
  product_img11,
  product_img12,
  mens_Tshirt_1,
  mens_Hoody_1,
  anime_section_img,
  cars_section_img,
  office_section_img,
  anime_tshirt,
  anime_tshirt_1,
  car_poster,
  office_poster,
  generic_profile_image
};

// --- UPDATED HIERARCHICAL CATEGORY STRUCTURE WITH NEW PATHS ---
export const categoryData = [
  {
    name: "Men",
    // This will now filter by the main category "Men"
    path: "/shop?category=Men",
    subCategories: [
      // These will now filter by the specific sub-category
      { name: "T-shirts", path: "/shop?subCategory=T-shirts", icon: Shirt },
      { name: "Hoodies", path: "/shop?subCategory=Hoodies", icon: Shirt },
      {
        name: "Oversized T-shirts",
        path: "/shop?subCategory=Oversized T-shirts",
        icon: Accessibility,
      },
    ],
  },
  {
    name: "Women",
    path: "/shop?category=Women",
    subCategories: [
      { name: "T-shirts", path: "/shop?subCategory=T-shirts", icon: Shirt },
      { name: "Crop Top", path: "/shop?subCategory=Crop Top", icon: Shirt },
      { name: "Crop Tank", path: "/shop?subCategory=Crop Tank", icon: Shirt },
    ],
  },
  {
    name: "Accessories",
    path: "/shop?category=Accessories",
    subCategories: [
      {
        name: "Wall Posters",
        path: "/shop?subCategory=Wall Posters",
        icon: ImageIcon,
      },
      { name: "Mugs", path: "/shop?subCategory=Mugs", icon: Coffee },
      {
        name: "Water Bottles",
        path: "/shop?subCategory=Water Bottles",
        icon: GlassWater,
      },
    ],
  },
];

// --- NEW DATA STRUCTURE FOR THEMED SECTIONS ---
// This is where you can easily add more sections in the future.
export const themedSectionsData = [
  {
    name: "Anime",
    title: "Anime Realms Collection",
    description:
      "Channel your inner hero with designs from your favorite sagas.",
    image: assets.anime_section_img,
    categories: ["Anime T-shirt", "Anime Poster"],
  },
  {
    name: "Cars",
    title: "Garage & Glory",
    description:
      "For the enthusiasts who appreciate horsepower and timeless design.",
    image: assets.cars_section_img,
    categories: ["Car Poster", "Car Mug"],
  },
  {
    name: "Office",
    title: "The Hustle Collection",
    description: "Elevate your workspace with gear that inspires productivity.",
    image: assets.office_section_img,
    categories: ["Office Mug", "Motivational Poster"],
  },
];

export const dummyRatingsData = [
  {
    id: "rat_1",
    rating: 4.5,
    review:
      "Absolutely love this dress! The fabric is so soft and the fit is perfect.",
    user: { name: "Chloe Davis", image: profile_pic1 },
    productId: "prod_3",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Women's Crop Top", category: "Crop Top", id: "prod_3" },
  },
  {
    id: "rat_2",
    rating: 5.0,
    review:
      "This hoodie is super comfortable and looks great. The AI recommendation was spot on!",
    user: { name: "Ben Carter", image: profile_pic2 },
    productId: "prod_2",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: {
      name: "Classic Pullover Hoodie",
      category: "Hoodies",
      id: "prod_2",
    },
  },
  {
    id: "rat_3",
    rating: 4.0,
    review:
      "Amazing quality for the price. The print is sharp and the colors are vibrant.",
    user: { name: "Olivia Martinez", image: profile_pic3 },
    productId: "prod_4",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: {
      name: "Inspirational Wall Poster",
      category: "Wall Posters",
      id: "prod_4",
    },
  },
];

export const dummyStoreData = {
  id: "store_1",
  userId: "user_1",
  name: "aiyna. Studios",
  description:
    "Welcome to aiyna Studios, where fashion meets technology. We use cutting-edge AI to help you discover clothing that perfectly matches your style, fit, and preferences. Shop smart, look incredible.",
  username: "aiynastudios",
  address: "123 Fashion Ave, Tech City, 54321",
  status: "approved",
  isActive: true,
  logo: happy_store,
  email: "contact@aiynastudios.com",
  contact: "+1 987 654 3210",
  createdAt: "2025-09-04T09:04:16.189Z",
  updatedAt: "2025-09-04T09:04:44.273Z",
  user: {
    id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
    name: "Style Maven",
    email: "maven@aiynastudios.com",
    image: gs_logo,
  },
};

// export const productDummyData = [
//   {
//     id: "94df6e00-2003-4fc4-afe5-ee227354b7b8",
//     name: "Men's Graphic T-shirt",
//     description:
//       "A stylish graphic T-shirt for men, made from 100% premium cotton for ultimate comfort and durability.",
//     mrp: 40,
//     price: 29,
//     images: [mens_Tshirt_1],
//     category: "T-shirts",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#ffffff", "#374151", "#fecaca"],
//     sizes: ["S", "M", "L", "XL"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)",
//   },
//   {
//     id: "prod_2",
//     name: "Classic Pullover Hoodie",
//     description:
//       "Stay warm and stylish with this classic pullover hoodie. Features a soft fleece interior and a durable exterior.",
//     mrp: 70,
//     price: 59,
//     images: [mens_Hoody_1],
//     category: "Hoodies",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#111827", "#6b7280"],
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)",
//   },
//   {
//     id: "prod_3",
//     name: "Women's Crop Top",
//     description:
//       "A trendy and comfortable crop top, perfect for a casual day out. Made with a breathable cotton blend.",
//     mrp: 35,
//     price: 25,
//     images: [womens_crop_top_1],
//     category: "Crop Top",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#fef2f2", "#dbeafe", "#fefce8"],
//     sizes: ["XS", "S", "M", "L"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)",
//   },
//   {
//     id: "prod_4",
//     name: "Inspirational Wall Poster",
//     description:
//       "Decorate your space with this high-quality wall poster featuring an inspirational quote. Printed on premium matte paper.",
//     mrp: 20,
//     price: 15,
//     images: [wall_poster_1],
//     category: "Wall Posters",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["12x18", "18x24", "24x36"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)",
//   },
//   {
//     id: "prod_5",
//     name: "Oversized Drop-Shoulder T-Shirt",
//     description:
//       "Get the perfect relaxed fit with our oversized drop-shoulder t-shirt. Made from heavy-gauge cotton for a premium feel.",
//     mrp: 45,
//     price: 35,
//     images: [mens_oversized_tshirt_1],
//     category: "Oversized T-shirts",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#000000", "#ffffff", "#d1d5db"],
//     sizes: ["M", "L", "XL"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)",
//   },
//   {
//     id: "prod_6",
//     name: "Branded Ceramic Mug",
//     description:
//       "Start your day with a coffee from this stylish branded ceramic mug. Holds 11oz of your favorite beverage.",
//     mrp: 18,
//     price: 12,
//     images: [mug_1],
//     category: "Mugs",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#ffffff"],
//     sizes: ["11oz"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: "Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)",
//     updatedAt: "Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)",
//   }, // Anime Products
//   {
//     id: "prod_anime_1",
//     name: "Anime Hero T-shirt",
//     description:
//       "High-quality cotton t-shirt featuring a dynamic anime hero design.",
//     mrp: 40,
//     price: 35,
//     images: [assets.anime_tshirt_1],
//     category: "Anime T-shirt",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#000000", "#ffffff"],
//     sizes: ["S", "M", "L", "XL"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_anime_2",
//     name: "Epic Saga Poster",
//     description: "A vibrant, high-quality poster from an epic anime saga.",
//     mrp: 25,
//     price: 18,
//     images: [assets.anime_tshirt_1],
//     category: "Anime Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["18x24"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_anime_3",
//     name: "Epic Saga Poster",
//     description: "A vibrant, high-quality poster from an epic anime saga.",
//     mrp: 25,
//     price: 18,
//     images: [assets.anime_tshirt_1],
//     category: "Anime Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["18x24"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_anime_4",
//     name: "Epic Saga Poster",
//     description: "A vibrant, high-quality poster from an epic anime saga.",
//     mrp: 25,
//     price: 18,
//     images: [assets.anime_tshirt_1],
//     category: "Anime Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["18x24"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   // Car Products
//   {
//     id: "prod_car_1",
//     name: "JDM Legend Poster",
//     description: "Sleek wall poster of a legendary JDM sports car.",
//     mrp: 25,
//     price: 18,
//     images: [assets.car_poster],
//     category: "Car Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["18x24"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_car_2",
//     name: "Turbocharged Mug",
//     description: "A ceramic mug for the car enthusiast with a turbo design.",
//     mrp: 20,
//     price: 15,
//     images: [assets.car_poster],
//     category: "Car Mug",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#000000"],
//     sizes: ["11oz"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_car_3",
//     name: "JDM Legend Poster",
//     description: "Sleek wall poster of a legendary JDM sports car.",
//     mrp: 25,
//     price: 18,
//     images: [assets.car_poster],
//     category: "Car Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["18x24"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_car_4",
//     name: "Turbocharged Mug",
//     description: "A ceramic mug for the car enthusiast with a turbo design.",
//     mrp: 20,
//     price: 15,
//     images: [assets.car_poster],
//     category: "Car Mug",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#000000"],
//     sizes: ["11oz"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   // Office Products
//   {
//     id: "prod_office_1",
//     name: '"Get It Done" Mug',
//     description: "Motivational ceramic mug for your office desk.",
//     mrp: 20,
//     price: 15,
//     images: [assets.office_poster],
//     category: "Office Mug",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#ffffff"],
//     sizes: ["11oz"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_office_2",
//     name: "Focus & Flow Poster",
//     description:
//       "A minimalist poster to inspire focus and productivity in your workspace.",
//     mrp: 25,
//     price: 18,
//     images: [assets.office_poster],
//     category: "Motivational Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["12x18"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_office_3",
//     name: '"Get It Done" Mug',
//     description: "Motivational ceramic mug for your office desk.",
//     mrp: 20,
//     price: 15,
//     images: [assets.office_poster],
//     category: "Office Mug",
//     storeId: "seller_1",
//     inStock: true,
//     colors: ["#ffffff"],
//     sizes: ["11oz"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "prod_office_4",
//     name: "Focus & Flow Poster",
//     description:
//       "A minimalist poster to inspire focus and productivity in your workspace.",
//     mrp: 25,
//     price: 18,
//     images: [assets.office_poster],
//     category: "Motivational Poster",
//     storeId: "seller_1",
//     inStock: true,
//     colors: [],
//     sizes: ["12x18"],
//     store: dummyStoreData,
//     rating: dummyRatingsData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
// ];

export const ourSpecsData = [
  {
    title: "Free Shipping",
    description:
      "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.",
    icon: SendIcon,
    accent: "#05DF72",
  },
  {
    title: "7 Days easy Return",
    description: "Change your mind? No worries. Return any item within 7 days.",
    icon: ClockFadingIcon,
    accent: "#FF8904",
  },
  {
    title: "24/7 Customer Support",
    description:
      "We're here for you. Get expert help with our customer support.",
    icon: HeadsetIcon,
    accent: "#A684FF",
  },
];

export const addressDummyData = {
  id: "addr_1",
  userId: "user_1",
  name: "John Doe",
  email: "johndoe@example.com",
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "USA",
  phone: "1234567890",
  createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
};

export const couponDummyData = [
  {
    code: "NEW20",
    description: "20% Off for New Users",
    discount: 20,
    forNewUser: true,
    forMember: false,
    isPublic: false,
    expiresAt: "2026-12-31T00:00:00.000Z",
    createdAt: "2025-08-22T08:35:31.183Z",
  },
  {
    code: "OFF10",
    description: "10% Off for All Users",
    discount: 10,
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: "2026-12-31T00:00:00.000Z",
    createdAt: "2025-08-22T08:42:21.279Z",
  },
];

export const dummyUserData = {
  id: "user_31dQbH27HVtovbs13X2cmqefddM",
  name: "GreatStack",
  email: "greatstack@example.com",
  image: gs_logo,
  cart: {},
};

// export const orderDummyData = [
//   {
//     id: "cmemm75h5001jtat89016h1p3",
//     total: 214.2,
//     status: "DELIVERED",
//     userId: "user_31dQbH27HVtovbs13X2cmqefddM",
//     storeId: "cmemkqnzm000htat8u7n8cpte",
//     addressId: "cmemm6g95001ftat8omv9b883",
//     isPaid: false,
//     paymentMethod: "COD",
//     createdAt: "2025-08-22T09:15:03.929Z",
//     updatedAt: "2025-08-22T09:15:50.723Z",
//     isCouponUsed: true,
//     coupon: dummyRatingsData[2],
//     orderItems: [
//       {
//         orderId: "cmemm75h5001jtat89016h1p3",
//         productId: "cmemlydnx0017tat8h3rg92hz",
//         quantity: 1,
//         price: 89,
//         product: productDummyData[0],
//       },
//       {
//         orderId: "cmemm75h5001jtat89016h1p3",
//         productId: "cmemlxgnk0015tat84qm8si5v",
//         quantity: 1,
//         price: 149,
//         product: productDummyData[1],
//       },
//     ],
//     address: addressDummyData,
//     user: dummyUserData,
//   },
//   {
//     id: "cmemm6jv7001htat8vmm3gxaf",
//     total: 421.6,
//     status: "DELIVERED",
//     userId: "user_31dQbH27HVtovbs13X2cmqefddM",
//     storeId: "cmemkqnzm000htat8u7n8cpte",
//     addressId: "cmemm6g95001ftat8omv9b883",
//     isPaid: false,
//     paymentMethod: "COD",
//     createdAt: "2025-08-22T09:14:35.923Z",
//     updatedAt: "2025-08-22T09:15:52.535Z",
//     isCouponUsed: true,
//     coupon: couponDummyData[0],
//     orderItems: [
//       {
//         orderId: "cmemm6jv7001htat8vmm3gxaf",
//         productId: "cmemm1f3y001dtat8liccisar",
//         quantity: 1,
//         price: 229,
//         product: productDummyData[2],
//       },
//       {
//         orderId: "cmemm6jv7001htat8vmm3gxaf",
//         productId: "cmemm0nh2001btat8glfvhry1",
//         quantity: 1,
//         price: 99,
//         product: productDummyData[3],
//       },
//       {
//         orderId: "cmemm6jv7001htat8vmm3gxaf",
//         productId: "cmemlz8640019tat8kz7emqca",
//         quantity: 1,
//         price: 199,
//         product: productDummyData[4],
//       },
//     ],
//     address: addressDummyData,
//     user: dummyUserData,
//   },
// ];

export const storesDummyData = [
  {
    id: "cmemkb98v0001tat8r1hiyxhn",
    userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
    name: "GreatStack",
    description:
      "GreatStack is the education marketplace where you can buy goodies related to coding and tech",
    username: "greatstack",
    address: "123 Maplewood Drive Springfield, IL 62704 USA",
    status: "approved",
    isActive: true,
    logo: gs_logo,
    email: "greatstack@example.com",
    contact: "+0 1234567890",
    createdAt: "2025-08-22T08:22:16.189Z",
    updatedAt: "2025-08-22T08:22:44.273Z",
    user: dummyUserData,
  },
  {
    id: "cmemkqnzm000htat8u7n8cpte",
    userId: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "Happy Shop",
    description:
      "At Happy Shop, we believe shopping should be simple, smart, and satisfying. Whether you're hunting for the latest fashion trends, top-notch electronics, home essentials, or unique lifestyle products — we've got it all under one digital roof.",
    username: "happyshop",
    address:
      "3rd Floor, Happy Shop , New Building, 123 street , c sector , NY, US",
    status: "approved",
    isActive: true,
    logo: happy_store,
    email: "happyshop@example.com",
    contact: "+0 123456789",
    createdAt: "2025-08-22T08:34:15.155Z",
    updatedAt: "2025-08-22T08:34:47.162Z",
    user: dummyUserData,
  },
];

export const dummyAdminDashboardData = {
  orders: 6,
  stores: 2,
  products: 12,
  revenue: "959.10",
  allOrders: [
    { createdAt: "2025-08-20T08:46:58.239Z", total: 145.6 },
    { createdAt: "2025-08-22T08:46:21.818Z", total: 97.2 },
    { createdAt: "2025-08-22T08:45:59.587Z", total: 54.4 },
    { createdAt: "2025-08-23T09:15:03.929Z", total: 214.2 },
    { createdAt: "2025-08-23T09:14:35.923Z", total: 421.6 },
    { createdAt: "2025-08-23T11:44:29.713Z", total: 26.1 },
    { createdAt: "2025-08-24T09:15:03.929Z", total: 214.2 },
    { createdAt: "2025-08-24T09:14:35.923Z", total: 421.6 },
    { createdAt: "2025-08-24T11:44:29.713Z", total: 26.1 },
    { createdAt: "2025-08-24T11:56:29.713Z", total: 36.1 },
    { createdAt: "2025-08-25T11:44:29.713Z", total: 26.1 },
    { createdAt: "2025-08-25T09:15:03.929Z", total: 214.2 },
    { createdAt: "2025-08-25T09:14:35.923Z", total: 421.6 },
    { createdAt: "2025-08-25T11:44:29.713Z", total: 26.1 },
    { createdAt: "2025-08-25T11:56:29.713Z", total: 36.1 },
    { createdAt: "2025-08-25T11:30:29.713Z", total: 110.1 },
  ],
};

export const dummyStoreDashboardData = {
  ratings: dummyRatingsData,
  totalOrders: 2,
  totalEarnings: 636,
  totalProducts: 5,
};
