import {Component, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef} from "@angular/core";
import {TextField} from "ui/text-field";

@Component({
  selector: "item-input",
  template: `
    <TextField class="input-box" #itemTextField [(ngModel)]="value" hint="{{ hint }}" col="0"></TextField>
    <Image src="res://add" (tap)="add()" col="1"></Image>
  `,
  styles: [`
    .input-box {
        font-size: 16;
    }
  `],
  providers: []
})

export class ItemInputView {
    @ViewChild("itemTextField") itemTextField: ElementRef;

    @Input() value: string;
    @Input() hint: string;
    @Input() typeName: string = "item";
    @Output() addOutput = new EventEmitter();

    constructor(
        private _zone: NgZone
    ) {}

    add() {
        if (this.value.trim() === "") {
            alert("Enter an " + this.typeName);
            return;
        }

        // Dismiss the keyboard
        this._zone.run(() => {
            let textField = <TextField>this.itemTextField.nativeElement;
            textField.dismissSoftInput();
        });
        this.addOutput.emit(this.value);
        this.value = "";
    }
}