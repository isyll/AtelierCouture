import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesVenteComponent } from './articles-vente/articles-vente.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full',
    },
    {
        path: 'categories',
        component: CategorieListComponent,
    },
    {
        path: 'articles',
        component: ArticlesComponent,
    },
    {
        path: 'articles-vente',
        component: ArticlesVenteComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
