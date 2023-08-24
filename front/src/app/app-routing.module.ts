import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { ArticlesComponent } from './articles/articles.component';

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
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
