import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "orderby",
    pure: false
})
@Injectable()
export class ArrayOrderByPipe implements PipeTransform {

    transform(items: any[], orderFields: string): any[] {
        if (!orderFields) { return items; }
        orderFields.split(';').forEach(function (currentField) {
            var orderType = 'ASC';

            if (currentField[0] === '-') {
                orderType = 'DESC';
            }
            currentField = currentField.substring(1);

            items.sort(function (a, b) {
                if (orderType === 'ASC') {
                    if (a[currentField] < b[currentField]) return -1;
                    if (a[currentField] > b[currentField]) return 1;
                    return 0;
                } else {
                    if (a[currentField] < b[currentField]) return 1;
                    if (a[currentField] > b[currentField]) return -1;
                    return 0;
                }
            });
        });
        return items;
    }
}