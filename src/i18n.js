import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      profileTranslations: {
        Nom: 'Name',
        'Numéro SIRET (facultatif)': 'Siret number (optional)',
        Adresse: 'Address',
        'Code postal': 'ZIP code',
        Ville: 'City',
        'Personne(s) de contact': 'Contact person(s)',
        Enregistrer: 'Save',
        'Nom et type de structure': 'Name and type of structure',
        'Le nom est obligatoire': 'Name is required',
        'Le type de structure est obligatoire': 'The type of the structure is required',
        'L\'adresse est obligatoire': 'the address is required',
        'Le code postal est obligatoire': 'ZIP code is required',
        'La ville est obligatoire': 'City is required',
        'Affiliations et partenariats': 'Affiliations and partnerships',
        'Votre structure est-elle rattachée à une ou plusieurs fédérations ?': 'Is your structure affiliated with one or more federations?',
        "Disposez-vous d'un label qualité ou d'une convention de partenariat avec l'ONF ?": 'Do you have a quality label or a partnership agreement with the NFB?',
        'Nom du label': 'Label name',
        'Supprimer ce contact': 'Delete this contact',
        'Ajouter une personne de contact': 'Add a contact person',
        'Adresse de la structure': 'Address of the structure',
      },
      profileContactTranslations: {
        Prénom: 'Firstname',
        'Ce champ est obligatoire': 'This field is required',
        Nom: 'Lastname',
        'Fonction dans la structure': 'Function in the structure',
        'Code postal': 'ZIP code',
        Ville: 'City',
        Téléphone: 'Phone number',
        'Téléphone secondaire': 'Secondary phone',
      },
    },
    fr: {
      profileTranslations: {
        Enregistrer: 'Enregistrer',
        'Nom et type de structure': 'Nom et type de structure',
        'Le nom est obligatoire': 'Le nom est obligatoire',
        'Le type de structure est obligatoire': 'Le type de structure est obligatoire',
        'L\'adresse est obligatoire': 'L\'adresse est obligatoire',
        'Le code postal est obligatoire': 'Le code postal est obligatoire',
        'La ville est obligatoire': 'La ville est obligatoire',
        'Affiliations et partenariats': 'Affiliations et partenariats',
        'Votre structure est-elle rattachée à une ou plusieurs fédérations ?': 'Votre structure est-elle rattachée à une ou plusieurs fédérations ?',
        "Disposez-vous d'un label qualité ou d'une convention de partenariat avec l'ONF ?": "Disposez-vous d'un label qualité ou d'une convention de partenariat avec l'ONF ?",
        'Nom du label': 'Nom du label',
        'Supprimer ce contact': 'Supprimer ce contact',
        'Ajouter une personne de contact': 'Ajouter une personne de contact',
        'Adresse de la structure': 'Adresse de la structure',
      },
      profileContactTranslations: {
        Prénom: 'Prénom',
        'Ce champ est obligatoire': 'Ce champ est obligatoire',
        Nom: 'Nom',
        'Fonction dans la structure': 'Fonction dans la structure',
        'Code postal': 'Code postal',
        Ville: 'Ville',
        Téléphone: 'Téléphone',
        'Téléphone secondaire': 'Téléphone secondaire',
      },
    },
  },
  fallbackLng: 'fr',
  debug: true,

  // have a common namespace used around the full app
  ns: ['profileTranslations'],
  defaultNS: 'profileTranslations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
});

export default i18n;
