const TRIP_DATA = {
  tripName: "Roma 2026",
  days: [
    {
      date: "2026-04-07",
      label: "7 Abr — Centro Histórico",
      color: "#FF5733",
      places: [
        // Landmarks
        {
          id: "piazza-navona",
          name: "Piazza Navona",
          lat: 41.8992,
          lng: 12.4731,
          description: "Plaza barroca con las fuentes de Bernini",
          time: "10:00",
          category: "landmark"
        },
        {
          id: "pantheon-d1",
          name: "Pantheon",
          lat: 41.8986,
          lng: 12.4769,
          description: "Templo romano con la cúpula de hormigón más grande del mundo",
          time: "11:00",
          category: "landmark"
        },
        {
          id: "fontana-trevi",
          name: "Fontana di Trevi",
          lat: 41.9009,
          lng: 12.4833,
          description: "La fuente más famosa del mundo",
          time: "12:00",
          category: "landmark"
        },
        // Comida
        {
          id: "roscioli",
          name: "Roscioli",
          lat: 41.8942,
          lng: 12.4729,
          description: "Restaurante gourmet y salumería. Pasta cacio e pepe legendaria",
          time: "13:30",
          category: "comida"
        },
        {
          id: "antico-forno-roscioli",
          name: "Antico Forno Roscioli",
          lat: 41.8940,
          lng: 12.4735,
          description: "Panadería histórica. Pizza al taglio increíble 🎯 Diego's tip",
          time: "13:30",
          category: "comida"
        },
        {
          id: "vineria-il-chianti",
          name: "Vineria Il Chianti",
          lat: 41.8983,
          lng: 12.4746,
          description: "Vinería con buena comida toscana 🎯 Diego's tip",
          time: "13:30",
          category: "comida"
        },
        // Café
        {
          id: "sant-eustachio",
          name: "Sant'Eustachio il Caffè",
          lat: 41.8983,
          lng: 12.4755,
          description: "El mejor café de Roma según los locales 🎯 Diego's tip",
          time: "15:00",
          category: "cafe"
        },
        {
          id: "tazza-doro",
          name: "Tazza d'Oro",
          lat: 41.8990,
          lng: 12.4773,
          description: "Café histórico junto al Pantheon. Granita di caffè 🎯 Diego's tip",
          time: "15:00",
          category: "cafe"
        },
        // Helados
        {
          id: "giolitti",
          name: "Giolitti",
          lat: 41.9003,
          lng: 12.4787,
          description: "Heladería desde 1900 🎯 Diego's tip",
          time: "16:00",
          category: "helado"
        },
        {
          id: "san-crispino",
          name: "Il Gelato di San Crispino",
          lat: 41.9005,
          lng: 12.4841,
          description: "Helado artesanal cerca de Trevi 🎯 Diego's tip",
          time: "16:00",
          category: "helado"
        },
        // Tragos
        {
          id: "bar-del-fico",
          name: "Bar del Fico",
          lat: 41.8994,
          lng: 12.4714,
          description: "Bar con terraza junto a Piazza Navona. Aperitivo",
          time: "18:00",
          category: "tragos"
        },
        {
          id: "cul-de-sac",
          name: "Cul de Sac",
          lat: 41.8985,
          lng: 12.4726,
          description: "Enoteca histórica en Piazza Navona 🎯 Diego's tip",
          time: "18:00",
          category: "tragos"
        },
        // Opcionales
        {
          id: "campo-de-fiori",
          name: "Campo de' Fiori",
          lat: 41.8956,
          lng: 12.4722,
          description: "Mercado matutino en plaza histórica",
          time: "09:00",
          category: "landmark",
          optional: true
        },
        {
          id: "forno-campo-fiori",
          name: "Forno Campo de' Fiori",
          lat: 41.8956,
          lng: 12.4720,
          description: "Pizza bianca legendaria 🎯 Diego's tip",
          time: "13:00",
          category: "comida",
          optional: true
        }
      ]
    },
    {
      date: "2026-04-08",
      label: "8 Abr — Vaticano / Prati",
      color: "#3498DB",
      places: [
        // Landmarks
        {
          id: "vatican-museums",
          name: "Vatican Museums",
          lat: 41.9065,
          lng: 12.4536,
          description: "Colección de arte papal. Incluye la Capilla Sixtina",
          time: "08:30",
          category: "landmark"
        },
        {
          id: "st-peters-basilica",
          name: "St Peter's Basilica",
          lat: 41.9022,
          lng: 12.4539,
          description: "La iglesia más grande del mundo. Cúpula de Miguel Ángel",
          time: "11:00",
          category: "landmark"
        },
        // Comida
        {
          id: "pizzarium",
          name: "Pizzarium",
          lat: 41.9072,
          lng: 12.4504,
          description: "La mejor pizza al taglio de Roma (zona Vaticano) 🎯 Diego's tip",
          time: "13:00",
          category: "comida"
        },
        {
          id: "osteria-dell-angelo",
          name: "Osteria dell'Angelo",
          lat: 41.9073,
          lng: 12.4583,
          description: "Trattoria romana auténtica en Prati. Menú fijo abundante",
          time: "13:00",
          category: "comida"
        },
        {
          id: "sicilia-in-bocca",
          name: "Sicilia in Bocca",
          lat: 41.9068,
          lng: 12.4575,
          description: "Comida siciliana en Prati 🎯 Diego's tip",
          time: "13:00",
          category: "comida"
        },
        // Café
        {
          id: "pergamino-d2",
          name: "Pergamino",
          lat: 41.9062,
          lng: 12.4604,
          description: "Specialty coffee en Prati",
          time: "15:00",
          category: "cafe"
        },
        // Helados
        {
          id: "gelateria-gracchi",
          name: "Gelateria dei Gracchi",
          lat: 41.9078,
          lng: 12.4570,
          description: "Helado artesanal top en Prati 🎯 Diego's tip",
          time: "16:00",
          category: "helado"
        },
        // Tragos
        {
          id: "les-etoiles",
          name: "Les Étoiles",
          lat: 41.9031,
          lng: 12.4630,
          description: "Rooftop bar con vista a la cúpula de San Pedro",
          time: "19:00",
          category: "tragos"
        },
        {
          id: "il-sorpasso",
          name: "Il Sorpasso",
          lat: 41.9055,
          lng: 12.4598,
          description: "Bar-restaurante trendy en Prati 🎯 Diego's tip",
          time: "19:00",
          category: "tragos"
        }
      ]
    },
    {
      date: "2026-04-09",
      label: "9 Abr — Centro + Monti",
      color: "#9B59B6",
      places: [
        // Landmarks
        {
          id: "pantheon-d3",
          name: "Pantheon",
          lat: 41.8986,
          lng: 12.4769,
          description: "Segunda visita al Pantheon — luz de la mañana",
          time: "10:00",
          category: "landmark"
        },
        {
          id: "piazza-navona-d3",
          name: "Piazza Navona",
          lat: 41.8992,
          lng: 12.4731,
          description: "Paseo por la plaza",
          time: "11:00",
          category: "landmark"
        },
        // Comida
        {
          id: "armando-al-pantheon",
          name: "Armando al Pantheon",
          lat: 41.8984,
          lng: 12.4762,
          description: "Trattoria clásica junto al Pantheon. Reservar",
          time: "13:00",
          category: "comida"
        },
        // Café
        {
          id: "barnum-cafe",
          name: "Barnum Café",
          lat: 41.8973,
          lng: 12.4693,
          description: "Café con diseño cerca de Piazza Navona",
          time: "15:00",
          category: "cafe"
        },
        {
          id: "faro-coffee",
          name: "Faro",
          lat: 41.8967,
          lng: 12.4770,
          description: "Specialty coffee. De los mejores de Roma",
          time: "09:00",
          category: "cafe"
        },
        // Tragos
        {
          id: "terrazza-borromini",
          name: "Terrazza Borromini",
          lat: 41.8991,
          lng: 12.4727,
          description: "Rooftop sobre Piazza Navona. Vistas espectaculares",
          time: "18:00",
          category: "tragos"
        },
        {
          id: "salotto-42",
          name: "Salotto 42",
          lat: 41.9001,
          lng: 12.4791,
          description: "Bar lounge con diseño en Piazza di Pietra",
          time: "19:00",
          category: "tragos"
        },
        {
          id: "ai-tre-scalini-d3",
          name: "Ai Tre Scalini",
          lat: 41.8943,
          lng: 12.4927,
          description: "Bar de vinos en Monti. Ambiente local auténtico",
          time: "20:00",
          category: "tragos"
        },
        {
          id: "drink-kong-d3",
          name: "Drink Kong",
          lat: 41.8955,
          lng: 12.4930,
          description: "Cocktail bar de diseño en Monti. Reservar",
          time: "21:00",
          category: "tragos"
        },
        // Opcionales
        {
          id: "fatamorgana",
          name: "Fatamorgana",
          lat: 41.8956,
          lng: 12.4933,
          description: "Helado artesanal con sabores creativos en Monti",
          time: "16:00",
          category: "helado",
          optional: true
        }
      ]
    },
    {
      date: "2026-04-10",
      label: "10 Abr — Coliseo + Monti",
      color: "#E67E22",
      places: [
        // Landmarks
        {
          id: "colosseum",
          name: "Colosseum",
          lat: 41.8902,
          lng: 12.4922,
          description: "Anfiteatro romano, icono de Roma",
          time: "09:00",
          category: "landmark"
        },
        // Tragos
        {
          id: "ai-tre-scalini-d4",
          name: "Ai Tre Scalini",
          lat: 41.8943,
          lng: 12.4927,
          description: "Bar de vinos en Monti",
          time: "19:00",
          category: "tragos"
        },
        {
          id: "drink-kong-d4",
          name: "Drink Kong",
          lat: 41.8955,
          lng: 12.4930,
          description: "Cocktail bar de diseño en Monti",
          time: "21:00",
          category: "tragos"
        },
        {
          id: "blackmarket-hall",
          name: "Blackmarket Hall",
          lat: 41.8950,
          lng: 12.4923,
          description: "Speakeasy en Monti. Cócteles creativos",
          time: "22:00",
          category: "tragos"
        },
        // Opcionales
        {
          id: "san-clemente",
          name: "Basílica San Clemente",
          lat: 41.8893,
          lng: 12.4976,
          description: "Iglesia con 3 niveles arqueológicos. A 5 min del Coliseo",
          time: "11:00",
          category: "landmark",
          optional: true
        },
        {
          id: "mordi-e-vai",
          name: "Mordi e Vai",
          lat: 41.8775,
          lng: 12.4731,
          description: "Puesto 15 del Mercato Testaccio. Sándwiches romanos legendarios",
          time: "13:00",
          category: "comida",
          optional: true
        },
        {
          id: "da-remo",
          name: "Da Remo",
          lat: 41.8809,
          lng: 12.4755,
          description: "Pizza romana clásica en Testaccio. Ambiente local",
          time: "20:00",
          category: "comida",
          optional: true
        },
        {
          id: "flavio-velavevodetto",
          name: "Flavio al Velavevodetto",
          lat: 41.8766,
          lng: 12.4760,
          description: "Trattoria romana auténtica en Testaccio. Cacio e pepe top",
          time: "20:00",
          category: "comida",
          optional: true
        },
        {
          id: "jardin-naranjos",
          name: "Jardín de los Naranjos",
          lat: 41.8854,
          lng: 12.4799,
          description: "Giardino degli Aranci. Mirador con vista panorámica al Tíber",
          time: "17:00",
          category: "landmark",
          optional: true
        },
        {
          id: "ojo-cerradura",
          name: "Ojo de la Cerradura",
          lat: 41.8829,
          lng: 12.4784,
          description: "Buco della Serratura — vista perfecta del domo de San Pedro por la cerradura",
          time: "17:15",
          category: "landmark",
          optional: true
        },
        {
          id: "santa-sabina",
          name: "Basílica Santa Sabina",
          lat: 41.8840,
          lng: 12.4745,
          description: "Basílica paleocristiana del siglo V en el Aventino",
          time: "17:30",
          category: "landmark",
          optional: true
        },
        {
          id: "pasticceria-regoli",
          name: "Pasticceria Regoli",
          lat: 41.8948,
          lng: 12.5009,
          description: "Pastelería histórica. Famosa por su maritozzo",
          time: "15:30",
          category: "cafe",
          optional: true
        }
      ]
    },
    {
      date: "2026-04-11",
      label: "11 Abr — Parque + Cena",
      color: "#2ECC71",
      places: [
        // Landmarks
        {
          id: "villa-borghese",
          name: "Villa Borghese",
          lat: 41.9133,
          lng: 12.4852,
          description: "Parque y galería de arte. Bernini y Caravaggio",
          time: "10:00",
          category: "landmark"
        },
        {
          id: "piazza-del-popolo",
          name: "Piazza del Popolo",
          lat: 41.9106,
          lng: 12.4764,
          description: "Gran plaza con obelisco e iglesias gemelas",
          time: "12:00",
          category: "landmark"
        },
        // Café
        {
          id: "caffe-greco",
          name: "Antico Caffè Greco",
          lat: 41.9058,
          lng: 12.4802,
          description: "Café desde 1760 en Via Condotti 🎯 Diego's tip",
          time: "14:00",
          category: "cafe"
        },
        // Comida
        {
          id: "il-convivio-troiani",
          name: "Il Convivio Troiani",
          lat: 41.9000,
          lng: 12.4708,
          description: "Alta cocina romana. Estrella Michelin 🎯 Diego's tip",
          time: "20:00",
          category: "comida"
        },
        {
          id: "ai-marmi",
          name: "Ai Marmi",
          lat: 41.8875,
          lng: 12.4720,
          description: "Pizzería popular en Trastevere. Cola pero vale la pena 🎯 Diego's tip",
          time: "20:00",
          category: "comida"
        },
        {
          id: "la-gatta-mangiona",
          name: "La Gatta Mangiona",
          lat: 41.8710,
          lng: 12.4390,
          description: "Pizza gourmet en Monteverde 🎯 Diego's tip",
          time: "20:00",
          category: "comida"
        },
        // Tragos
        {
          id: "stravinskij-bar",
          name: "Stravinskij Bar",
          lat: 41.9065,
          lng: 12.4798,
          description: "Bar del Hotel de Russie. Jardín secreto elegante",
          time: "17:00",
          category: "tragos"
        },
        {
          id: "caffe-delle-arti",
          name: "Caffè delle Arti",
          lat: 41.9160,
          lng: 12.4825,
          description: "Bar en la Galleria Nazionale. Terraza en el parque",
          time: "18:00",
          category: "tragos"
        },
        // Opcionales
        {
          id: "tonnarello",
          name: "Tonnarello",
          lat: 41.8898,
          lng: 12.4693,
          description: "Trattoria popular en Trastevere. Pasta fresca y terraza",
          time: "20:00",
          category: "comida",
          optional: true
        },
        {
          id: "trattoria-pennestri",
          name: "Trattoria Pennestri",
          lat: 41.8733,
          lng: 12.4799,
          description: "Cocina romana moderna en Ostiense. Reservar",
          time: "20:00",
          category: "comida",
          optional: true
        }
      ]
    },
    {
      date: "2026-04-12",
      label: "12 Abr — Salida Roma",
      color: "#95A5A6",
      places: [
        {
          id: "pergamino-d6",
          name: "Pergamino",
          lat: 41.9062,
          lng: 12.4604,
          description: "Último café antes de salir",
          time: "09:00",
          category: "cafe"
        }
      ]
    },
    {
      date: "2026-04-12",
      label: "12 Abr — París",
      color: "#E74C3C",
      places: [
        {
          id: "grand-palais",
          name: "Grand Palais",
          lat: 48.8662,
          lng: 2.3125,
          description: "Monumental palacio de cristal y acero de 1900",
          time: "16:15",
          category: "landmark"
        },
        {
          id: "pont-alexandre-iii",
          name: "Pont Alexandre III",
          lat: 48.8637,
          lng: 2.3136,
          description: "El puente más elegante de París sobre el Sena",
          time: "17:00",
          category: "landmark"
        },
        {
          id: "pont-des-arts",
          name: "Pont des Arts",
          lat: 48.8584,
          lng: 2.3374,
          description: "Puente peatonal frente al Louvre y el Institut de France",
          time: "17:45",
          category: "landmark"
        },
        {
          id: "nicolas-buci",
          name: "Nicolas (vino)",
          lat: 48.8537,
          lng: 2.3363,
          description: "Tienda de vinos. Pedir botella abierta o tapa rosca. Cierra 19:00 dom",
          time: "18:00",
          category: "tragos"
        },
        {
          id: "boulangerie-arts-gourmands",
          name: "Boulangerie Les Arts Gourmands",
          lat: 48.8528,
          lng: 2.3420,
          description: "Baguettes tradicionales perfectas para el queso. Cierra 21:00",
          time: "18:10",
          category: "comida"
        },
        {
          id: "monoprix-st-michel",
          name: "Monoprix (queso y variados)",
          lat: 48.8510,
          lng: 2.3440,
          description: "Sección de quesos franceses muy completa. Cierra 19:40 dom",
          time: "18:20",
          category: "comida"
        },
        {
          id: "notre-dame",
          name: "Notre-Dame",
          lat: 48.8530,
          lng: 2.3499,
          description: "Catedral gótica. Solo pasar por fuera si da el tiempo",
          time: "18:40",
          category: "landmark",
          optional: true
        },
        {
          id: "sainte-chapelle",
          name: "Sainte-Chapelle",
          lat: 48.8554,
          lng: 2.3451,
          description: "Capilla gótica del siglo XIII con vitrales espectaculares. Cierra 19:00",
          time: "18:45",
          category: "landmark"
        },
        {
          id: "square-vert-galant",
          name: "Square du Vert-Galant",
          lat: 48.8572,
          lng: 2.3414,
          description: "Jardín en la punta de la Île de la Cité. Atardecer a las 20:37",
          time: "19:00",
          category: "landmark"
        },
        {
          id: "grande-cremerie",
          name: "La Grande Crèmerie",
          lat: 48.8530,
          lng: 2.3390,
          description: "Wine bar con charcutería y quesos artesanales en Saint-Germain",
          time: "21:00",
          category: "comida"
        }
      ]
    }
  ]
};
