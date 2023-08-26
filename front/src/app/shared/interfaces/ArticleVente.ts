import { Article } from './Article';
import { Categorie } from './Categorie';
import { PaginationResponse } from './Response';

export interface ArticleVenteData {
    categories_vente: Array<Categorie>;
    articles_confection: Array<Article>;
    articles_vente: PaginationResponse<Article>;
}
