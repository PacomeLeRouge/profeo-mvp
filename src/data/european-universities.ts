export type EuropeanUniversity = {
  name: string;
  city: string;
  country: string;
};

/** Top ~100 grandes universités européennes (Belgique en tête de liste). */
export const europeanUniversities: EuropeanUniversity[] = [
  // Belgique
  { name: "KU Leuven", city: "Louvain", country: "Belgique" },
  { name: "UCLouvain", city: "Louvain-la-Neuve", country: "Belgique" },
  { name: "Université de Gand (UGent)", city: "Gand", country: "Belgique" },
  { name: "Vrije Universiteit Brussel (VUB)", city: "Bruxelles", country: "Belgique" },
  { name: "Université libre de Bruxelles (ULB)", city: "Bruxelles", country: "Belgique" },
  { name: "Université d'Anvers", city: "Anvers", country: "Belgique" },
  { name: "Université de Liège (ULiège)", city: "Liège", country: "Belgique" },
  { name: "Université de Hasselt", city: "Hasselt", country: "Belgique" },
  { name: "Université Saint-Louis — Bruxelles", city: "Bruxelles", country: "Belgique" },
  { name: "Université de Namur", city: "Namur", country: "Belgique" },

  // Royaume-Uni
  { name: "University of Oxford", city: "Oxford", country: "Royaume-Uni" },
  { name: "University of Cambridge", city: "Cambridge", country: "Royaume-Uni" },
  { name: "Imperial College London", city: "Londres", country: "Royaume-Uni" },
  { name: "University College London (UCL)", city: "Londres", country: "Royaume-Uni" },
  { name: "King's College London", city: "Londres", country: "Royaume-Uni" },
  { name: "London School of Economics (LSE)", city: "Londres", country: "Royaume-Uni" },
  { name: "University of Edinburgh", city: "Édimbourg", country: "Royaume-Uni" },
  { name: "University of Manchester", city: "Manchester", country: "Royaume-Uni" },
  { name: "University of Bristol", city: "Bristol", country: "Royaume-Uni" },
  { name: "University of Warwick", city: "Coventry", country: "Royaume-Uni" },
  { name: "University of Glasgow", city: "Glasgow", country: "Royaume-Uni" },
  { name: "University of Birmingham", city: "Birmingham", country: "Royaume-Uni" },

  // Allemagne
  { name: "LMU Munich", city: "Munich", country: "Allemagne" },
  { name: "Technical University of Munich (TUM)", city: "Munich", country: "Allemagne" },
  { name: "Heidelberg University", city: "Heidelberg", country: "Allemagne" },
  { name: "Humboldt University of Berlin", city: "Berlin", country: "Allemagne" },
  { name: "Freie Universität Berlin", city: "Berlin", country: "Allemagne" },
  { name: "RWTH Aachen University", city: "Aix-la-Chapelle", country: "Allemagne" },
  { name: "University of Bonn", city: "Bonn", country: "Allemagne" },
  { name: "University of Hamburg", city: "Hambourg", country: "Allemagne" },
  { name: "University of Cologne", city: "Cologne", country: "Allemagne" },
  { name: "University of Freiburg", city: "Fribourg", country: "Allemagne" },
  { name: "Karlsruhe Institute of Technology (KIT)", city: "Karlsruhe", country: "Allemagne" },

  // France
  { name: "Sorbonne Université", city: "Paris", country: "France" },
  { name: "Université Paris-Saclay", city: "Paris", country: "France" },
  { name: "École Polytechnique", city: "Palaiseau", country: "France" },
  { name: "Sciences Po", city: "Paris", country: "France" },
  { name: "Université de Lyon", city: "Lyon", country: "France" },
  { name: "Aix-Marseille Université", city: "Marseille", country: "France" },
  { name: "Université de Strasbourg", city: "Strasbourg", country: "France" },
  { name: "Université de Bordeaux", city: "Bordeaux", country: "France" },
  { name: "Université Toulouse Capitole", city: "Toulouse", country: "France" },
  { name: "Université de Lille", city: "Lille", country: "France" },
  { name: "Université Grenoble Alpes", city: "Grenoble", country: "France" },
  { name: "Université de Montpellier", city: "Montpellier", country: "France" },

  // Pays-Bas
  { name: "University of Amsterdam", city: "Amsterdam", country: "Pays-Bas" },
  { name: "Delft University of Technology", city: "Delft", country: "Pays-Bas" },
  { name: "Utrecht University", city: "Utrecht", country: "Pays-Bas" },
  { name: "Leiden University", city: "Leyde", country: "Pays-Bas" },
  { name: "Erasmus University Rotterdam", city: "Rotterdam", country: "Pays-Bas" },
  { name: "Wageningen University", city: "Wageningen", country: "Pays-Bas" },

  // Suisse
  { name: "ETH Zurich", city: "Zurich", country: "Suisse" },
  { name: "EPFL", city: "Lausanne", country: "Suisse" },
  { name: "University of Zurich", city: "Zurich", country: "Suisse" },
  { name: "University of Geneva", city: "Genève", country: "Suisse" },
  { name: "University of Basel", city: "Bâle", country: "Suisse" },

  // Espagne
  { name: "University of Barcelona", city: "Barcelone", country: "Espagne" },
  { name: "Autonomous University of Barcelona", city: "Barcelone", country: "Espagne" },
  { name: "Complutense University of Madrid", city: "Madrid", country: "Espagne" },
  { name: "Autonomous University of Madrid", city: "Madrid", country: "Espagne" },
  { name: "University of Valencia", city: "Valence", country: "Espagne" },
  { name: "University of Granada", city: "Grenade", country: "Espagne" },

  // Italie
  { name: "University of Bologna", city: "Bologne", country: "Italie" },
  { name: "Sapienza University of Rome", city: "Rome", country: "Italie" },
  { name: "University of Milan", city: "Milan", country: "Italie" },
  { name: "Politecnico di Milano", city: "Milan", country: "Italie" },
  { name: "University of Padua", city: "Padoue", country: "Italie" },
  { name: "University of Turin", city: "Turin", country: "Italie" },
  { name: "University of Florence", city: "Florence", country: "Italie" },

  // Scandinavie
  { name: "University of Copenhagen", city: "Copenhague", country: "Danemark" },
  { name: "Lund University", city: "Lund", country: "Suède" },
  { name: "Uppsala University", city: "Uppsala", country: "Suède" },
  { name: "KTH Royal Institute of Technology", city: "Stockholm", country: "Suède" },
  { name: "University of Oslo", city: "Oslo", country: "Norvège" },
  { name: "University of Helsinki", city: "Helsinki", country: "Finlande" },

  // Autriche & Europe centrale
  { name: "University of Vienna", city: "Vienne", country: "Autriche" },
  { name: "TU Wien", city: "Vienne", country: "Autriche" },
  { name: "Charles University", city: "Prague", country: "Tchéquie" },
  { name: "Jagiellonian University", city: "Cracovie", country: "Pologne" },
  { name: "University of Warsaw", city: "Varsovie", country: "Pologne" },
  { name: "Eötvös Loránd University", city: "Budapest", country: "Hongrie" },

  // Portugal & Irlande
  { name: "University of Lisbon", city: "Lisbonne", country: "Portugal" },
  { name: "University of Porto", city: "Porto", country: "Portugal" },
  { name: "Trinity College Dublin", city: "Dublin", country: "Irlande" },
  { name: "University College Dublin", city: "Dublin", country: "Irlande" },

  // Grèce & autres
  { name: "National and Kapodistrian University of Athens", city: "Athènes", country: "Grèce" },
  { name: "University of Bucharest", city: "Bucarest", country: "Roumanie" },
  { name: "University of Belgrade", city: "Belgrade", country: "Serbie" },
  { name: "University of Zagreb", city: "Zagreb", country: "Croatie" },
  { name: "University of Ljubljana", city: "Ljubljana", country: "Slovénie" },
  { name: "University of Tartu", city: "Tartu", country: "Estonie" },
  { name: "University of Latvia", city: "Riga", country: "Lettonie" },
  { name: "Vilnius University", city: "Vilnius", country: "Lituanie" },
  { name: "University of Cyprus", city: "Nicosie", country: "Chypre" },
  { name: "University of Malta", city: "La Valette", country: "Malte" },
  { name: "University of Luxembourg", city: "Luxembourg", country: "Luxembourg" },
  { name: "Reykjavik University", city: "Reykjavik", country: "Islande" },
  { name: "University of Iceland", city: "Reykjavik", country: "Islande" },
  { name: "University of Galway", city: "Galway", country: "Irlande" },
  { name: "University of St Andrews", city: "St Andrews", country: "Royaume-Uni" },
  { name: "Durham University", city: "Durham", country: "Royaume-Uni" },
  { name: "University of Southampton", city: "Southampton", country: "Royaume-Uni" },
  { name: "University of Leeds", city: "Leeds", country: "Royaume-Uni" },
  { name: "University of Nottingham", city: "Nottingham", country: "Royaume-Uni" },
  { name: "University of Sheffield", city: "Sheffield", country: "Royaume-Uni" },
  { name: "University of Exeter", city: "Exeter", country: "Royaume-Uni" },
  { name: "University of Liverpool", city: "Liverpool", country: "Royaume-Uni" },
  { name: "University of Aberdeen", city: "Aberdeen", country: "Royaume-Uni" },
  { name: "Cardiff University", city: "Cardiff", country: "Royaume-Uni" },
  { name: "Queen's University Belfast", city: "Belfast", country: "Royaume-Uni" },
];

export function filterEuropeanUniversities(query: string, limit = 8): EuropeanUniversity[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const scored = europeanUniversities
    .map((university) => {
      const name = university.name.toLowerCase();
      const city = university.city.toLowerCase();
      const country = university.country.toLowerCase();
      const haystack = `${name} ${city} ${country}`;

      let score = 0;
      if (name.startsWith(normalized)) score = 100;
      else if (name.includes(normalized)) score = 80;
      else if (city.startsWith(normalized)) score = 70;
      else if (country.startsWith(normalized)) score = 60;
      else if (haystack.includes(normalized)) score = 40;

      return { university, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.university.name.localeCompare(b.university.name, "fr"));

  return scored.slice(0, limit).map(({ university }) => university);
}

export function formatUniversityLabel(university: EuropeanUniversity) {
  return `${university.name} — ${university.city}, ${university.country}`;
}
