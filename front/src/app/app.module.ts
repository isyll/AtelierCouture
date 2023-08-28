import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { ArticlesComponent } from './articles-confection/articles.component';
import { ArticlesListComponent } from './articles-confection/articles-list/articles-list.component';
import { ArticlesShowComponent } from './articles-confection/articles-form/articles-form.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SelectedItemComponent } from './articles-confection/articles-form/selected-item/selected-item.component';
import { ArticleItemComponent } from './articles-confection/articles-list/article-item/article-item.component';
import { ArticlesVenteComponent } from './articles-vente/articles-vente.component';
import { FormComponent } from './articles-vente/form/form.component';
import { ListComponent } from './articles-vente/list/list.component';
import { ValidationErrorMsgComponent } from './validation-error-msg/validation-error-msg.component';
import { ArtSuggestionsComponent } from './articles-vente/form/art-suggestions/art-suggestions.component';
import { AddCategoryComponent } from './articles-confection/articles-form/add-category/add-category.component';

@NgModule({
    declarations: [
        AppComponent,
        CategorieListComponent,
        ArticlesComponent,
        ArticlesListComponent,
        ArticlesShowComponent,
        SuggestionsComponent,
        SelectedItemComponent,
        ArticleItemComponent,
        ArticlesVenteComponent,
        FormComponent,
        ListComponent,
        ValidationErrorMsgComponent,
        ArtSuggestionsComponent,
        AddCategoryComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxPaginationModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
