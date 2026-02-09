import { PrismaClient, PropertyType, PropertyStatus } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(title: string, city: string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${city.toLowerCase().replace(/\s+/g, '-')}`;
}

async function main() {
  const properties = [
    {
      title: 'Luxury Sea View Apartment in Tel Aviv',
      city: 'Tel Aviv',
      neighborhood: 'North Tel Aviv',
      areaText: 'North Tel Aviv, near Hilton Beach',
      propertyType: PropertyType.Apartment,
      bedrooms: 3,
      bathrooms: 2,
      sizeSqm: 95,
      price: 1250000,
      features: ['Sea View', 'Balcony', 'Elevator', 'Parking', 'Renovated'],
      description: 'Stunning **3-bedroom** apartment with panoramic sea views. Walking distance to the beach and vibrant Tel Aviv nightlife. Fully renovated with premium finishes.',
      status: PropertyStatus.Published,
      isFeatured: true,
    },
    {
      title: 'Penthouse with Rooftop Terrace',
      city: 'Herzliya',
      neighborhood: 'Herzliya Pituach',
      areaText: 'Herzliya Pituach, Marina area',
      propertyType: PropertyType.Penthouse,
      bedrooms: 4,
      bathrooms: 3,
      sizeSqm: 180,
      lotSqm: 80,
      price: 2850000,
      features: ['Sea View', 'Pool', 'Balcony', 'Parking', 'Elevator', 'Garden'],
      description: 'Exceptional penthouse with private rooftop terrace and pool. Marina views. Premium building with concierge.',
      status: PropertyStatus.Published,
      isFeatured: true,
    },
    {
      title: 'Villa with Private Garden',
      city: 'Ra\'anana',
      neighborhood: 'Ramat Ra\'anana',
      areaText: 'Ramat Ra\'anana, quiet residential',
      propertyType: PropertyType.Villa,
      bedrooms: 5,
      bathrooms: 4,
      sizeSqm: 320,
      lotSqm: 450,
      price: 3200000,
      features: ['Garden', 'Parking', 'Safe Room', 'Balcony', 'Renovated'],
      description: 'Spacious family villa on a large plot. Private garden, safe room, and high-end finishes throughout.',
      status: PropertyStatus.Published,
      isFeatured: true,
    },
    {
      title: 'Modern Apartment Near Sarona',
      city: 'Tel Aviv',
      neighborhood: 'Sarona',
      areaText: 'Sarona, Tel Aviv center',
      propertyType: PropertyType.Apartment,
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 78,
      price: 890000,
      features: ['Elevator', 'Parking', 'Balcony', 'Renovated'],
      description: 'Bright 2-bedroom in the heart of Tel Aviv. Steps from Sarona Market and business district.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
    {
      title: 'Investment Land Plot',
      city: 'Netanya',
      neighborhood: 'Poleg',
      areaText: 'Poleg, Netanya',
      propertyType: PropertyType.Land,
      lotSqm: 800,
      priceOnRequest: true,
      price: null,
      features: [],
      description: 'Prime **building plot** in developing area. Zoning approved. Ideal for investors.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
    {
      title: 'Boutique Commercial Space',
      city: 'Tel Aviv',
      neighborhood: 'Rothschild',
      areaText: 'Rothschild Boulevard, Tel Aviv',
      propertyType: PropertyType.Commercial,
      sizeSqm: 120,
      price: 1950000,
      features: ['Elevator', 'Parking'],
      description: 'Street-level commercial unit on Rothschild. Suitable for office or retail.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
    {
      title: 'Family Apartment with Safe Room',
      city: 'Kfar Saba',
      neighborhood: 'Center',
      areaText: 'Kfar Saba center',
      propertyType: PropertyType.Apartment,
      bedrooms: 4,
      bathrooms: 2,
      sizeSqm: 110,
      price: 720000,
      features: ['Safe Room', 'Parking', 'Balcony', 'Elevator'],
      description: 'Solid 4-bedroom family apartment with mandatory safe room. Great schools and parks nearby.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
    {
      title: 'Elegant Apartment in Old Jaffa',
      city: 'Tel Aviv',
      neighborhood: 'Old Jaffa',
      areaText: 'Old Jaffa, Ajami',
      propertyType: PropertyType.Apartment,
      bedrooms: 2,
      bathrooms: 1,
      sizeSqm: 65,
      price: 950000,
      features: ['Sea View', 'Balcony', 'Renovated'],
      description: 'Character apartment in historic Jaffa. Exposed stone, sea breeze, and unique atmosphere.',
      status: PropertyStatus.Published,
      isFeatured: true,
    },
    {
      title: 'New Build Apartment Ramat Gan',
      city: 'Ramat Gan',
      neighborhood: 'Diamond Exchange Area',
      areaText: 'Ramat Gan, Diamond Exchange',
      propertyType: PropertyType.Apartment,
      bedrooms: 3,
      bathrooms: 2,
      sizeSqm: 88,
      price: 680000,
      features: ['Elevator', 'Parking', 'Balcony'],
      description: 'Brand new 3-bedroom in a tower near the Diamond Exchange. Smart home ready.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
    {
      title: 'Quiet Villa in Zichron Yaakov',
      city: 'Zichron Yaakov',
      neighborhood: 'Carmel',
      areaText: 'Zichron Yaakov, Carmel hills',
      propertyType: PropertyType.Villa,
      bedrooms: 4,
      bathrooms: 3,
      sizeSqm: 240,
      lotSqm: 600,
      price: 2100000,
      features: ['Garden', 'Parking', 'Safe Room', 'Balcony', 'Sea View'],
      description: 'Peaceful villa in the Carmel. Vineyards and sea views. Perfect for families seeking quality of life.',
      status: PropertyStatus.Published,
      isFeatured: false,
    },
  ];

  for (const p of properties) {
    const slug = slugify(p.title, p.city);
    await prisma.property.upsert({
      where: { slug },
      create: {
        slug,
        title: p.title,
        city: p.city,
        neighborhood: p.neighborhood ?? undefined,
        areaText: p.areaText,
        propertyType: p.propertyType,
        bedrooms: p.bedrooms ?? undefined,
        bathrooms: p.bathrooms ?? undefined,
        sizeSqm: p.sizeSqm ?? undefined,
        lotSqm: p.lotSqm ?? undefined,
        price: p.price ?? undefined,
        priceOnRequest: p.priceOnRequest ?? false,
        features: p.features,
        description: p.description,
        status: p.status,
        isFeatured: p.isFeatured,
        images: {
          create: [
            { url: 'https://placehold.co/800x600/e2e8f0/64748b?text=Property', alt: p.title, sortOrder: 0 },
            { url: 'https://placehold.co/800x600/cbd5e1/475569?text=View+2', alt: `${p.title} - view 2`, sortOrder: 1 },
          ],
        },
      },
      update: {},
    });
  }

  console.log('Seed completed: %d properties created.', properties.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
