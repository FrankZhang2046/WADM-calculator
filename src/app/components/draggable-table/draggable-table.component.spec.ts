import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DraggableTableComponent } from "./draggable-table.component";

describe("DraggableTableComponent", () => {
    let component: DraggableTableComponent;
    let fixture: ComponentFixture<DraggableTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DraggableTableComponent],
        });
        fixture = TestBed.createComponent(DraggableTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
