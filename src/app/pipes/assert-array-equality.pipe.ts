import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "assertArrayEquality",
    standalone: true,
})
export class AssertArrayEqualityPipe implements PipeTransform {
    transform(
        targetTableDataPosition: number[] | number | null,
        coordinates: number[]
    ): boolean {
        // assert if targetTableDataPosition is number[]
        if (Array.isArray(targetTableDataPosition)) {
            return (
                targetTableDataPosition[0] === coordinates[0] &&
                targetTableDataPosition[1] === coordinates[1]
            );
        } else return false;
    }
}
