import { Unite } from './Unite';

export interface Categorie {
    id?: number;
    libelle: string;
    cl?: number; // nombre d'articles de cette catégorie
    type?: 'confection' | 'vente';
    check?: boolean;
    unite?: Unite;
    unites?: Unite[];
}
