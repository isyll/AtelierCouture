import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesListComponent } from './articles/articles-list/articles-list.component';
import { ArticlesShowComponent } from './articles/articles-form/articles-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SelectedItemComponent } from './articles/articles-form/selected-item/selected-item.component';
import { ArticleItemComponent } from './articles/articles-list/article-item/article-item.component';
import { ArticlesVenteComponent } from './articles-vente/articles-vente.component';
import { FormComponent } from './articles-vente/form/form.component';
import { ListComponent } from './articles-vente/list/list.component';
import { ValidationErrorMsgComponent } from './validation-error-msg/validation-error-msg.component';

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
