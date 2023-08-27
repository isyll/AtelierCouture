import { Categorie } from './Categorie';
import { Fournisseur } from './Fournisseur';
import { Pagination } from './Response';

export interface Article {
    id: number;
    libelle: string;
    ref: string;
    prix: number;
    stock: number;
    fournisseurs: Fournisseur[];
    category: Categorie;
    confection?: Array<Article>;
    quantite?: number
    promo?: boolean
}

export interface ArticleAll {
    data: Array<Article>;
    pagination: Pagination;
    fournisseurs: Array<Fournisseur>;
    categories: Array<Categorie>;
}
