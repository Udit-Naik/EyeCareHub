/* 
   Data.js - Product Database 
*/

const products = [
    {
        id: 1,
        name: "Ray-Ban Aviator Classic",
        category: "Sunglasses",
        brand: "Ray-Ban",
        price: 13499,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1760&auto=format&fit=crop",
        desc: "Timeless aviator style with G-15 lenses."
    },
    {
        id: 2,
        name: "Oakley Holbrook",
        category: "Sunglasses",
        brand: "Oakley",
        price: 12999,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1760&auto=format&fit=crop",
        desc: "Iconic American frame design."
    },
    {
        id: 3,
        name: "Blue Cut Computer Glasses",
        category: "Computer Glasses",
        brand: "Lenskart Air",
        price: 3749,
        rating: 4.6,
        image: "https://i.pinimg.com/1200x/33/18/d9/3318d994a332e9a3253709ac9d8d897b.jpg",
        desc: "Zero power blue light blocking lenses."
    },
    {
        id: 4,
        name: "Tom Ford FT5634",
        category: "Eyeglasses",
        brand: "Tom Ford",
        price: 31499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1742&auto=format&fit=crop",
        desc: "Luxury square acetate frames."
    },
    {
        id: 5,
        name: "Acuvue Oasys (6 Pack)",
        category: "Contact Lenses",
        brand: "Johnson & Johnson",
        price: 2999,
        rating: 4.8,
        image: "https://i.pinimg.com/736x/93/8b/0f/938b0f6716da3fc22111d22855f72db5.jpg", // Placeholder contact lens related
        desc: "Hydraclear Plus technology for comfort."
    },
    {
        id: 6,
        name: "Wayfarer Matte Black",
        category: "Eyeglasses",
        brand: "Vincent Chase",
        price: 4999,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1740&auto=format&fit=crop",
        desc: "Classic matte finish for daily wear."
    },
    {
        id: 7,
        name: "Round Metal Gold",
        category: "Eyeglasses",
        brand: "John Jacobs",
        price: 6999,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1508296695146-25e7b52a8f99?q=80&w=1740&auto=format&fit=crop",
        desc: "Vintage inspired round metal frames."
    },
    {
        id: 8,
        name: "Anti-Glare Driving Glasses",
        category: "Sunglasses",
        brand: "Polarix",
        price: 4549,
        rating: 4.4,
        image: "https://i.pinimg.com/736x/5c/ca/e1/5ccae1b180f718b5327c281bb580ad63.jpg",
        desc: "Polarized lenses for night driving."
    },
    {
        id: 9,
        name: "Daily Disposables (30 Pack)",
        category: "Contact Lenses",
        brand: "Bausch + Lomb",
        price: 3749,
        rating: 4.6,
        image: "https://i.pinimg.com/1200x/6f/5d/fb/6f5dfbd218ff39c61b0a95d08361f95f.jpg",
        desc: "Fresh pair for every new day."
    },
    {
        id: 10,
        name: "Transparent Acetate Frames",
        category: "Computer Glasses",
        brand: "Lenskart Air",
        price: 4149,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1740&auto=format&fit=crop",
        desc: "Crystal clear frames with blue cut."
    }
];

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1740&auto=format&fit=crop";

const PRODUCT_IMAGE_BY_KEYWORD = {
    aviator: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1760&auto=format&fit=crop",
    oakley: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1760&auto=format&fit=crop",
    blue: "https://i.pinimg.com/1200x/33/18/d9/3318d994a332e9a3253709ac9d8d897b.jpg",
    computer: "https://i.pinimg.com/1200x/f7/9e/18/f79e1813d52670898a6a13638ddeb121.jpg",
    tom: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1742&auto=format&fit=crop",
    ford: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1742&auto=format&fit=crop",
    acuvue: "https://i.pinimg.com/736x/93/8b/0f/938b0f6716da3fc22111d22855f72db5.jpg",
    contact: "https://i.pinimg.com/1200x/6f/5d/fb/6f5dfbd218ff39c61b0a95d08361f95f.jpg",
    wayfarer: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1740&auto=format&fit=crop",
    round: "https://i.pinimg.com/736x/c3/70/f3/c370f35550f9e37b840937572de4734d.jpg",
    anti: "https://i.pinimg.com/736x/5c/ca/e1/5ccae1b180f718b5327c281bb580ad63.jpg",
    driving: "https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=1740&auto=format&fit=crop",
    daily: "https://i.pinimg.com/736x/93/8b/0f/938b0f6716da3fc22111d22855f72db5.jpg",
    transparent: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1740&auto=format&fit=crop",
    acetate: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1740&auto=format&fit=crop"
};

const PRODUCT_IMAGE_BY_CATEGORY = {
    "Sunglasses": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1760&auto=format&fit=crop",
    "Eyeglasses": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1740&auto=format&fit=crop",
    "Computer Glasses": "https://i.pinimg.com/1200x/33/18/d9/3318d994a332e9a3253709ac9d8d897b.jpg",
    "Contact Lenses": "https://i.pinimg.com/736x/93/8b/0f/938b0f6716da3fc22111d22855f72db5.jpg"
};

function getImageByName(name, category) {
    const label = `${name || ''} ${category || ''}`.toLowerCase();
    const keyword = Object.keys(PRODUCT_IMAGE_BY_KEYWORD).find((key) => label.includes(key));
    if (keyword) return PRODUCT_IMAGE_BY_KEYWORD[keyword];
    return PRODUCT_IMAGE_BY_CATEGORY[category] || DEFAULT_PRODUCT_IMAGE;
}

function normalizeImageUrl(url) {
    if (!url || typeof url !== 'string') return DEFAULT_PRODUCT_IMAGE;
    const trimmed = url.trim();
    if (!trimmed) return DEFAULT_PRODUCT_IMAGE;

    // Accept only direct web URLs to keep image rendering consistent.
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
        return trimmed;
    }

    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }

    return DEFAULT_PRODUCT_IMAGE;
}

products.forEach((product) => {
    // Keep images relevant by matching known name/category keywords first.
    const mappedImage = getImageByName(product.name, product.category);
    product.image = normalizeImageUrl(mappedImage || product.image);
});
