import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'filter',
    pure: false,
})
@Injectable()
export class ArrayFilterPipe implements PipeTransform {

    transform(items: any[], conditions: { [field: string]: any }): any[] {
        return items.filter(item => {
            for (let field in conditions) {
                if (conditions[field] === '') { break; }
                if ((typeof item[field] === 'string' || item[field] instanceof String) &&
                    (item[field].toLowerCase().indexOf(conditions[field].toLowerCase()) == -1)) {
                    return false;
                }
                if (item[field] === null || item[field] === '') { return false; }
            }
            return true;
        });
    }
}
