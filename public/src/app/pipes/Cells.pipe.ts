import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "absoluteValue"
})
@Injectable()
export class AbsoluteValuePipe implements PipeTransform {
    transform(value: number) {
        if (value && !isNaN(value)) {
            return Math.abs(value);
        }

        return;
    }
}