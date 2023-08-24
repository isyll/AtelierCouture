import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    constructor() {}

    handle(input: HTMLInputElement, callback: (base64data: string) => void) {
        const reader = new FileReader();

        if (input.files && input.files.length) {
            const file = input.files[0];

            if (file) {
                reader.readAsDataURL(file);

                reader.onload = () => callback(reader.result as string);
            }
        }
    }
}
