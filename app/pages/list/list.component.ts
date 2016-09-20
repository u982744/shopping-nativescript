import {Component, ElementRef, OnInit, ViewChild, NgZone} from "@angular/core";
import {List} from "../../shared/list/list";
import {ListService} from "../../shared/list/list.service";
import {ItemView} from "../../shared/item/item.component";
import {ItemInputView} from "../item-input.component";
import {TextField} from "ui/text-field";
import {Router} from "@angular/router";

var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  directives : [ItemView, ItemInputView],
  providers: [ListService]
})

export class ListPage implements OnInit {
  lists: Array<List> = [];
  list: string = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("listTextField") listTextField: ElementRef;

  constructor(private _router: Router, private _listService: ListService, private _zone: NgZone) {}

  ngOnInit() {
    this.isLoading = true;
    this._listService.load()
      .subscribe(loadedLists => {
        loadedLists.forEach((listObject) => {
          this.lists.unshift(listObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  share() {
    let list = [];
    for (let i = 0, size = this.lists.length; i < size ; i++) {
      list.push(this.lists[i].name);
    }
    let listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }

  view(listId) {
    console.log("list.component delete", listId);
    this._router.navigate(["/list/" + listId + "/items"]);
  }

  add(name) {
    this._listService.add(name)
      .subscribe(
        listObject => {
          this.lists.unshift(listObject);
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
        }
      )
  }

  delete(item) {
    console.log("list.component delete", item);
    this._listService.delete(item.id)
      .subscribe(
        responseSuccess => {
          // Running the change detection in a zone ensures that change
          // detection gets triggered if needed.
          this._zone.run(() => {
            this.lists.splice(item.index, 1);
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