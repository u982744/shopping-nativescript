import {Component, Input, Output, EventEmitter, NgZone} from "@angular/core";

@Component({
  selector: "item",
  template: `
    <GridLayout columns="*, auto" class="item">
        <Label [ngClass]="{'done': item.done}" [text]="item.name" class="medium-spacing" (tap)="tap(item.id)"></Label>
        <Label text="Delete" col="1" (tap)="delete(item.id, i)"></Label>
    </GridLayout>
  `,
  styleUrls: ["shared/item/item.css"],
  providers: []
})

export class ItemView {
    private name: string;
    @Input() item;
    @Input() isViewable;
    @Input() isDoneable;

    @Output() deleteOutput = new EventEmitter();
    @Output() viewOutput = new EventEmitter();
    @Output() doneOutput = new EventEmitter();

    constructor(private _zone: NgZone) {}

    delete(id, index) {
        this.deleteOutput.emit({id: id, index: index});
    }

    tap(id) {
        if (this.isViewable) {
            this.viewOutput.emit(id);
        }

        if (this.isDoneable) {
            this._zone.run(() => {
                this.item.done = !this.item.done;
                this.doneOutput.emit({id: id, done: this.item.done});
            });
        }
    }
}