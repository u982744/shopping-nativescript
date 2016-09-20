import {Component, ElementRef, OnInit, ViewChild, NgZone, AfterViewInit} from "@angular/core";
import {Item} from "../../shared/item/item";
import {ItemService} from "../../shared/item/item.service";
import {ItemView} from "../../shared/item/item.component";
import {ItemInputView} from "../item-input.component";
import {ListService} from "../../shared/list/list.service";
import {TextField} from "ui/text-field";
import {ActivatedRoute} from "@angular/router";
import {setHintColor} from "../../utils/hint-util";

var socialShare = require("nativescript-social-share");
var timer = require("timer");
var validator = require("email-validator");

@Component({
  selector: "items",
  templateUrl: "pages/items/items.html",
  styleUrls: ["pages/items/items-common.css", "pages/items/items.css"],
  directives : [ItemView, ItemInputView],
  providers: [ItemService, ListService]
})

export class ItemsPage implements OnInit {
  itemList: Array<Item> = [];
  item: string = "";
  email: string = "";
  isLoading = false;
  listLoaded = false;
  showShare = false;
  public listName: string = "";
  private _paramSubscription: any;
  private _listId: string;

  @ViewChild("itemTextField") itemTextField: ElementRef;
  @ViewChild("shareTextField") shareTextField: ElementRef;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _itemService: ItemService,
    private _listService: ListService,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this._paramSubscription = this._activatedRoute.params.subscribe(params => {
        this._listId = params['listId'];

        //console.log("route list id:", this._listId);

        this._itemService.load(params['listId'])
            .subscribe(response => {
                this.listName = response.name;
                response.items.forEach((itemObject) => {
                    this.itemList.unshift(itemObject);
                });

                console.log("itemList", JSON.stringify(this.itemList));
                this.isLoading = false;
                this.listLoaded = true;
            });
    });     

  }

  shareToggle() {
    //console.log("do shareToggle");
    this._zone.run(() => {
        this.showShare = !this.showShare;

        if (this.showShare) {
          timer.setTimeout(() => {
            let textField = <TextField>this.shareTextField.nativeElement;
            textField.focus();
          }, 200);
        }
    });
  }

  share() {
    //console.log("do share...");

    if (!validator.validate(this.email)) {
      alert("Enter a valid email address.");
      return;
    }

    let shareField = <TextField>this.shareTextField.nativeElement;

    this._listService.share(this._listId, this.email)
      .subscribe(
        response => {
          alert({
            message: response.message,
            okButtonText: "OK"
          });

          if (response.success) {
            shareField.dismissSoftInput();
            this._zone.run(() => {
                this.email = "";
            });
          }
        },
        () => {
          alert({
            message: "An error occurred sharing your list.",
            okButtonText: "OK"
          });
        }
      )
  }

  add(item) {
    this._itemService.add(item, this._listId)
      .subscribe(
        itemObject => {
            // Running the change detection in a zone ensures that change
            // detection gets triggered if needed.
            this._zone.run(() => {
                this.itemList.unshift(itemObject);
            });
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
        }
      )
  }

  done(obj) {
    //console.log("done...", JSON.stringify(obj));

    this._itemService.done(obj.id, this._listId, obj.done)
      .subscribe(
        responseSuccess => {},
        () => {
          alert({
            message: "An error occurred changing the done status of an item in your list.",
            okButtonText: "OK"
          });
        }
      )
  }

  delete(item) {
    this._itemService.delete(item.id, this._listId)
      .subscribe(
        responseSuccess => {
          // Running the change detection in a zone ensures that change
          // detection gets triggered if needed.
          this._zone.run(() => {
            this.itemList.splice(item.index, 1);
          });
        },
        () => {
          alert({
            message: "An error occurred while deleting an item from your list.",
            okButtonText: "OK"
          });
        }
      )
  }
}